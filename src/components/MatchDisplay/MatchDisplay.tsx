import { db } from "../../firebase/index";
import { collection, getDocs, Timestamp, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";  //REMOVE IF MAKING database.tsx

import { MatchEditor } from "../../components"
import DataTable from 'react-data-table-component';
import { createTheme } from 'react-data-table-component';
import { updateLeaderboard } from "../../firebase/leaderboard";

function isOpen(match: any) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}

createTheme('dark', {
  background: {
    default: 'transparent',
  },
});

type matchDisplayProp = {
  teams: Map<string, {
    name: string;
    teamColour: string;
    teamLogo: string;
  }>;
  matches: { 
    matchId: string;
    team1Id: string;
    team2Id: string;
    category: string;
    points: string;
    closeTime: Timestamp;
    open: boolean;
    winner: number,
    votes: {
      team1Vote: number,
      totalVote: number}
  }[];
};

// see if you can combine graphTeam and team into one type! TODO
const MatchDisplay = ({ teams, matches } : matchDisplayProp) => {
  const closePickem = async (matchId: string) => {
    try {
      const matchesDocRef = doc(db, "matches", "matchData");
      const matchesDocSnap = await getDoc(matchesDocRef);

      if (matchesDocSnap.exists()) {
        const matchesData = matchesDocSnap.data();
        matchesData[matchId].open = false; // Close the pickem
        await setDoc(matchesDocRef, matchesData);
        console.log(`Pickem closed for match ${matchId}`);
      }
    } catch (error) {
      console.error("Error closing pickem:", error);
    }
  };

  const setWinner = async (matchId: string, winner: string) => {
    try {
      const matchesDocRef = doc(db, "matches", "matchData");
      const matchesDocSnap = await getDoc(matchesDocRef);
  
      if (matchesDocSnap.exists()) {
        const matchesData = matchesDocSnap.data();

        // Update match winner in Firestore
        await updateDoc(matchesDocRef, {
          [`${matchId}.winner`]: winner,
          [`${matchId}.open`]: false,
        }); 
  
        // Update all user scores
        const usersCollectionRef = collection(db, "users");
        const userDocsSnap = await getDocs(usersCollectionRef);
  
        userDocsSnap.forEach(async (userDoc) => {
          const userData = userDoc.data();
          // Check if the user made a pick for this match
          const userPick = userData.picks?.[matchId];
          if (userPick === winner) {
            const updatedScore = (userData.score || 0) + parseInt(matchesData[matchId].points, 10);
            // Update the user's score in their document
            await updateDoc(doc(db, "users", userDoc.id), {
              score: updatedScore,
            });
          }
        });

        // New leaderboard based on new scores
        updateLeaderboard();

      } else {
        console.error("Match data not found.");
      }
    } catch (error) {
      console.error("Error setting winner:", error);
    }
  };

  const columns = [
    {
      name: 'closeTime',
      selector: (match: any) => new Date(match.closeTime.seconds * 1000).toLocaleString(),
      sortable: true,
      sortFunction: (a, b) => a.closeTime.seconds - b.closeTime.seconds
    },
    {
      name: 'Category',
      selector: (match: any) => match.category,
      sortable: true,
    },
    {
      name: 'Press to Close Pickems',
      cell:(match) => {
        if (isOpen(match)) {
          return <button onClick={() => closePickem(match.matchId)}>Close</button>
        } else {
          return <button onClick={() => closePickem(match.matchId)} disabled>Close</button>
        }
      },
      sortable: true,
      sortFunction: (a, b) => a.open - b.open
    },
    {
      name: 'Click for winner',
      selector: match => match.team1Id,
      cell: (match) => {
        if (match.winner === "-1") {
          return <button onClick={() => setWinner(match.matchId, match.team1Id)}>{teams.get(match.team1Id)?.name}</button>
        } else {
          return teams.get(match.team1Id)?.name;
        }
      }
    },
    {
      name: 'Click for winner',
      cell: (match) => {
        if (match.winner === "-1") {
          return <button onClick={() => setWinner(match.matchId, match.team2Id)}>{teams.get(match.team2Id)?.name}</button>
        } else {
          return teams.get(match.team2Id)?.name;
        }
      },
    },
    {
      name: 'winner',
      selector: match => teams.get(match.winner)?.name,
      sortable: true,
    },
    {
      name: 'points',
      selector: match => match.points,
      sortable: true,
      sortFunction : (a, b) => a.points - b.points
    },
    {
      name: 'Edit Match',
      cell: (match) => {
        if (match.winner === "-1") {
          return <MatchEditor db={db} teamOptions={teams} matchId = {match.matchId} matches={matches}/>
        } else {
          return "Can no longer edit";
        }
      },
    }
  ];

  return (
    <DataTable
    title="Matches"
    columns={columns}
    data={matches}
    defaultSortFieldId={1}
    theme="dark"
    />
  );
};

export default MatchDisplay;
