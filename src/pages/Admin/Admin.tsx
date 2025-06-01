// src/components/AdminPanel.tsx
import { useState, useEffect } from 'react';
import { getOrdinalSuffix } from "../../utils";
import { db } from "../../firebase/index";
import { rank_users } from "../../utils";
import { collection, query, getDocs, Timestamp, doc, getDoc, updateDoc, setDoc, onSnapshot, orderBy } from "firebase/firestore";  //REMOVE IF MAKING database.tsx

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { teamCard, TeamBuilder, MatchBuilder, MatchEditor } from "../../components"
import DataTable from 'react-data-table-component';
import { createTheme } from 'react-data-table-component';
import { Button } from 'react-bootstrap';

import { addVoteDataToMatch } from "../../firebase/database"

function isOpen(match: any) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}

createTheme('dark', {
  background: {
    default: 'transparent',
  },
});


const Admin = () => {
  // States for team and match display
  const [teams, setTeams] = useState<Map<string, {name: string, teamColour: string, teamLogo: string}>>(new Map());
  const [matches, setMatches] = useState<{ matchId: string, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp, open: boolean, winner: number, votes: {team1Vote: number, totalVote: number} }[]>([]); // Matches state
  const [graphTeams, setGraphTeams] = useState<Map<string, string>>(new Map());

  // Leaderboard states for admin
  const [inPersonLeaderboard, setInPersonleaderboard] = useState<any[]>([]);  // State to hold the leaderboard data
  const [remoteLeaderboard, setRemoteLeaderboard] = useState<any[]>([]);  // State to hold the leaderboard data

  // Using snapshot to update both teams and matches on server update
  useEffect(() => {
    const fetchTeams = onSnapshot(doc(db, "teams", "teamData"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const teamsData = docSnapshot.data();
        console.log(teamsData);
        const teams =  new Map<string, {name: string, teamColour: string, teamLogo: string}>();
        Object.keys(teamsData).forEach((id) => {
          teams.set(id, {
            name: teamsData[id].name, 
            teamColour: teamsData[id].teamColour, 
            teamLogo: teamsData[id].teamLogo
          })
        })

        setTeams(teams);
      }
    }, (error) => {
      console.error("Error fetching teams: ", error);
    });

    // Set up the real-time listeners
    const fetchMatches = onSnapshot(doc(db, 'matches', 'matchData'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const matchesData = docSnapshot.data();
        let matchList = Object.keys(matchesData).map((id) => ({
          matchId: matchesData[id].matchId,
          team1Id: matchesData[id].team1Id,
          team2Id: matchesData[id].team2Id,
          category: matchesData[id].category,
          points: matchesData[id].points,
          closeTime: matchesData[id].closeTime,
          open: matchesData[id].open,
          winner: matchesData[id].winner,
          votes: (matchesData[id].votes === undefined ? {team1Vote: 0, totalVote: 0} : matchesData[id].votes)
        }));

        matchList = matchList.sort((a, b) => a.closeTime.seconds - b.closeTime.seconds);
        setMatches(matchList);
      }
    }, (error) => {
      console.error("Error listening to matches: ", error);
    });

    const unsubscribeTeams = onSnapshot(doc(db, 'teams', "teamData"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const teamsData = docSnapshot.data();
        const teamMap = new Map<string, string>(); // Create a Map to store team names by their IDs
        Object.keys(teamsData).forEach((id) => {
          teamMap.set(id, teamsData[id].name);
        });
        setGraphTeams(teamMap);
      }
    });

    const inPersonUnsubscribe = onSnapshot(doc(db, "leaderboard", "inPersonLeaderboard"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data.leaderboard) {
          // Sort the leaderboard by rank
          const sortedLeaderboard = data.leaderboard.sort((a: any, b: any) => a.rank - b.rank);
          setInPersonleaderboard(sortedLeaderboard);
        }
      }
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
    });

    const remoteUnsubscribe = onSnapshot(doc(db, "leaderboard", "remoteLeaderboard"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data.leaderboard) {
          // Sort the leaderboard by rank
          const sortedLeaderboard = data.leaderboard.sort((a: any, b: any) => a.rank - b.rank);
          setRemoteLeaderboard(sortedLeaderboard);
        }
      }
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
    });

    // Clean up the listener when the component unmounts
    return () => {
      fetchTeams();
      fetchMatches();
      unsubscribeTeams();
      inPersonUnsubscribe();
      remoteUnsubscribe();
    };
  }, [db]);

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

  const updateLeaderboard = async () => {
    const usersCollectionRef = collection(db, "users");
    // Make leaderboard
    const leaderboardQuery = query(usersCollectionRef, orderBy("score", "desc"));
    const leaderboardDocsSnap = await getDocs(leaderboardQuery);
    if (!leaderboardDocsSnap.empty) {
      const matchesData = leaderboardDocsSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: doc.id,
          name: data.name,
          score: data.score,
          rank: data.rank,
          email: data.email,
          inPerson: (data.inPerson === undefined) ? false : data.inPerson,  // Default to false if inPerson is not set (google login)
          discordUsername: (data.discordUsername === undefined) ? "" : data.discordUsername,
        }
      });

      // Algo for ties
      rank_users(matchesData);

      matchesData.forEach(async (user) => {
        const userDocRef = doc(db, "users", user.userId);
        await updateDoc(userDocRef, {
          rank: user.rank,
        });
      });

      // Updating leaderboard
      const leaderboardCollection = matchesData.map((user) => {
        return {
          name: user.name,
          rank: user.rank,
          score: user.score,
          inPerson: user.inPerson,
        }
      })
      const userDocRef = doc(db, "leaderboard", "leaderboardStatus");
      await setDoc(userDocRef, { leaderboard: leaderboardCollection});

      // Separate inPerson and remote users
      const inPersonUsers = matchesData.filter((user) => user.inPerson);
      rank_users(inPersonUsers);
      const remoteUsers = matchesData.filter((user) => !user.inPerson);
      rank_users(remoteUsers);

      // Updating admin inperson leaderboard
      const inPersonLeaderboardCollection = inPersonUsers.map((user) => {
        return {
          name: user.name,
          rank: user.rank,
          score: user.score,
          discordUsername: user.discordUsername,
          email: user.email,
        }
      })
      const inPersonRef = doc(db, "leaderboard", "inPersonLeaderboard");
      await setDoc(inPersonRef, { leaderboard: inPersonLeaderboardCollection});

      // Updating admin remote leaderboard
      const remoteLeaderboardCollection = remoteUsers.map((user) => {
        return {
          name: user.name,
          rank: user.rank,
          score: user.score,
          discordUsername: user.discordUsername,
          email: user.email,
        }
      })
      const remoteRef = doc(db, "leaderboard", "remoteLeaderboard");
      await setDoc(remoteRef, { leaderboard: remoteLeaderboardCollection});
    }
  }

  const updateVoteStats = async () => {
    const usersCollectionQuery = query(collection(db, "users"));
    const usersCollectionDocsSnap = await getDocs(usersCollectionQuery);
    if (!usersCollectionDocsSnap.empty) {
      const users = usersCollectionDocsSnap.docs.map((userData) => {
        const data = userData.data();
        return {
          picks: data.picks,
        }
      })

      for (const match of matches) {
        match.votes.team1Vote = 0;
        match.votes.totalVote = 0;
      }

      for (const user of users) {
        if (user.picks !== undefined) {
          for (const userPick of Object.entries(user.picks)) {
            for (const match of matches) {
              if (match.matchId === userPick[0] && match.team1Id === userPick[1]) {
                match.votes.team1Vote++;
                match.votes.totalVote++;
              } else if (match.matchId === userPick[0]) {
                match.votes.totalVote++;
              }
            }
          }
        }
      }
      addVoteDataToMatch(db, matches);
    }
  }

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
      selector: match => graphTeams.get(match.team1Id),
      cell: (match) => {
        if (match.winner === "-1") {
          return <button onClick={() => setWinner(match.matchId, match.team1Id)}>{graphTeams.get(match.team1Id)}</button>
        } else {
          return graphTeams.get(match.team1Id);
        }
      }
    },
    {
      name: 'Click for winner',
      cell: (match) => {
        if (match.winner === "-1") {
          return <button onClick={() => setWinner(match.matchId, match.team2Id)}>{graphTeams.get(match.team2Id)}</button>
        } else {
          return graphTeams.get(match.team2Id);
        }
      },
    },
    {
      name: 'winner',
      selector: match => graphTeams.get(match.winner),
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
  
  const specificLeaderboardCol = [
      {
        name: "Rank",
        selector: user => getOrdinalSuffix(user.rank),
        sortable: true,
        sortFunction: (a: any, b: any) => a.rank - b.rank,
      },
      {
        name: "Name",
        selector: user => (user.name),
        sortable: true,
      },
      {
        name: "Score",
        selector: user => user.score,
        sortable: true,
        sortFunction: (a: any, b: any) => a.score - b.score,
      },
      {
        name: "Discord",
        selector: user => user.discordUsername,
        sortable: true,
      },
      {
        name: "Email",
        selector: user => user.email,
        sortable: true,
      },
    ]

  return (
    <div style={{ width: "95vw", margin: "auto"}}>
      <br />
      <h2>Admin Panel</h2>
      <Tabs
        defaultActiveKey="match"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="match" title="Matches">
          <MatchBuilder db={db} teamOptions={teams}/>
          
          {/* Matches Table */}
          <DataTable
            title="Matches"
            columns={columns}
            data={matches}
            defaultSortFieldId={1}
            theme="dark"
          />
        </Tab>

        <Tab eventKey="teams" title="Teams">
          <TeamBuilder db={db} />

          <h3>Teams</h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap', // Cards wrap to next row when no more space in the row
              gap: '20px',
              justifyContent: 'flex-start', // Aligns cards to the left
            }}
          >
            {Array.from(teams.entries()).map(([id, team]) => (
              <div
                style={{
                  flex: '0 0 286px', // Fixed box width
                  boxSizing: 'border-box',
                }}
              >
                {/* REMEMBER TO ADD IN THE IMAGE PATH IN SECOND */}
                {teamCard(id, team)} 
              </div>
            ))}
          </div>
        </Tab>

        <Tab eventKey="miscellaneous" title="Miscellaneous Commands">
          <h3>Update Vote Stats</h3>
          <p>This is a manual command, and will update the data on the percentage of votes of each pickems.</p>
          <Button onClick={updateVoteStats}>Update Stats</Button>

          <h3>Update Leaderboard</h3>
          <p>Leaderboard is updated automatically when a match is closed. However, you can manually update the leaderboard with the button below (Note this could affect the firestore bill by a lot based on the number of users).</p>
          <Button onClick={updateLeaderboard}>Update Leaderboard</Button>
        </Tab>
        <Tab eventKey="leaderboards" title="Prize Leaderboards">
          <Tabs>
            <Tab eventKey="inPerson-leaderboard" title="InPerson Leaderboard">
              <DataTable
                title="InPerson Leaderboard"
                columns={specificLeaderboardCol}
                data={inPersonLeaderboard}
                defaultSortFieldId={1}
                theme='dark'
              />
            </Tab>
            <Tab eventKey="remote-leaderboard" title="Remote Leaderboard">
              <DataTable
                title="Remote Leaderboard"
                columns={specificLeaderboardCol}
                data={remoteLeaderboard}
                defaultSortFieldId={1}
                theme='dark'
              />
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Admin;
