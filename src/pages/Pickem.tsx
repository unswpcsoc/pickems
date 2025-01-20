import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Firestore, getDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import './User.css';

type UserPanelProps = {
  db: Firestore;
};

const auth = getAuth();

const Pickem = ({ db }: UserPanelProps) => {
  const [activeMatches, setActiveMatches] = useState<
    { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean }[]
  >([]);
  const [userPicks, setUserPicks] = useState<{ [key: number]: string }>({});
  const [teams, setTeams] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    // Create the reference to your matches document
    const matchesDocRef = doc(db, 'matches', 'matchData');

    // Set up the real-time listeners
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
        }));

        // Sort based on time
        matchList = matchList.sort((a, b) => 
          a.closeTime.seconds - b.closeTime.seconds
        );
        
        // Update state with the new data
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
        const teamMap = new Map<string, string>(); // Create a Map to store team names by their IDs
        Object.keys(teamsData).forEach((id) => {
          teamMap.set(id, teamsData[id].name);
        });

        console.log(teamMap)

        setTeams(teamMap);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribeActiveMatches(); 
      unsubscribeUserPicks();
      unsubscribeTeams();
    };
  }, [db]);

  const handlePick = async (matchId: number, teamId: string) => {
    const match = activeMatches.find((m) => m.matchId === matchId);

    // Pick can only occur if a match exists and is open for pickems
    if (!match || match.open == false) {
      return;
    } else {
      const updatedPicks = { ...userPicks, [matchId]: teamId };
      const userDocRef = doc(db, 'users', (auth.currentUser as User).uid);
      await updateDoc(userDocRef, {
        picks: updatedPicks,
      });
    }

  }

  return (
    <div>
      <h1>Pick'em Matches</h1>
      {activeMatches.length === 0 ? (
        <p>No matches available.</p>
      ) : (
        activeMatches.map((match) => (
          <div key={match.matchId} className="match-container">
            <div className="teams">
              <div
                className={classNames('team', {
                  chosen: userPicks[match.matchId] === match.team1Id,
                  unchosen: userPicks[match.matchId] === match.team2Id,
                })}
                onClick={() => handlePick(match.matchId, match.team1Id)}
              >
                <p>{teams.get(match.team1Id)}</p> 
              </div>
              <div
                className={classNames('team', {
                  chosen: userPicks[match.matchId] === match.team2Id,
                  unchosen: userPicks[match.matchId] === match.team1Id,
                })}
                onClick={() => handlePick(match.matchId, match.team2Id)}
              >
                <p>{teams.get(match.team2Id)}</p>
              </div>
            </div>
            <div className="details">
              <p>Category: {match.category}</p>
              <p>Points: {match.points}</p>
              <p>Close Time: {new Date(match.closeTime.seconds * 1000).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Pickem;