// src/components/Pickem.tsx
import { useState, useEffect } from 'react';
import { Firestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import { PickemBar } from '../components'; // Import the PickemBar component

import './User.css';

type UserPanelProps = {
  db: Firestore;
};

const auth = getAuth();

function isOpen(match: any) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}

const Pickem = ({ db }: UserPanelProps) => {
  const [activeMatches, setActiveMatches] = useState<
    { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean, winner: string }[]
  >([]);
  const [userPicks, setUserPicks] = useState<{ [key: number]: string }>({});
  const [teams, setTeams] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const matchesDocRef = doc(db, 'matches', 'matchData');
    const unsubscribeActiveMatches = onSnapshot(matchesDocRef, (docSnapshot) => {
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
        }));

        matchList = matchList.sort((a, b) => a.closeTime.seconds - b.closeTime.seconds);
        matchList = matchList.filter(isOpen);

        setActiveMatches(matchList);
      }
    }, (error) => {
      console.error("Error listening to matches: ", error);
    });

    const unsubscribeUserPicks = onSnapshot(doc(db, 'users', (auth.currentUser as User).uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const picks = docSnapshot.data().picks;
        setUserPicks(picks);
      }
    });

    const unsubscribeTeams = onSnapshot(doc(db, 'teams', "teamData"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const teamsData = docSnapshot.data();
        const teamMap = new Map<string, string>();
        Object.keys(teamsData).forEach((id) => {
          teamMap.set(id, teamsData[id].name);
        });
        setTeams(teamMap);
      }
    });

    return () => {
      unsubscribeActiveMatches();
      unsubscribeUserPicks();
      unsubscribeTeams();
    };
  }, [db]);

  const handlePick = async (matchId: number, teamId: string) => {
    const match = activeMatches.find((m) => m.matchId === matchId);
    if (!match || !isOpen(match)) {
      return;
    } else {
      const updatedPicks = { ...userPicks, [matchId]: teamId };
      const userDocRef = doc(db, 'users', (auth.currentUser as User).uid);
      await updateDoc(userDocRef, {
        picks: updatedPicks,
      });
      setUserPicks(updatedPicks); // Optimistic UI update
    }
  };

  return (
    <div style={{ width: "95vw", margin: "auto" }}>
      <br />
      <h1>Pick'em Matches</h1>
      {activeMatches.length === 0 ? (
        <p>No matches available.</p>
      ) : (
        activeMatches.map((match) => (
          <PickemBar
            key={match.matchId}
            match={match}
            userPick={userPicks[match.matchId] || ''}
            teams={teams}
            handlePick={handlePick}
          />
        ))
      )}
    </div>
  );
};

export default Pickem;
