import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Firestore, getDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './User.css';
import { match } from 'assert';

type UserPanelProps = {
  db: Firestore;
};

const auth = getAuth();

const User = ({ db }: UserPanelProps) => {
  const [matches, setMatches] = useState<
    { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean }[]
  >([]);
  const [userPicks, setUserPicks] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchesDocRef = doc(db, 'matches', 'matchData');
        const matchesDocSnap = await getDoc(matchesDocRef);

        if (matchesDocSnap.exists()) {
          const matchesData = matchesDocSnap.data();
          const matchList = Object.keys(matchesData).map((id) => ({
            matchId: matchesData[id].matchId,
            team1Id: matchesData[id].team1Id,
            team2Id: matchesData[id].team2Id,
            category: matchesData[id].category,
            points: matchesData[id].points,
            closeTime: matchesData[id].closeTime,
            open: matchesData[id].open,
          }));
          setMatches(matchList);
        }

        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().picks) {
          setUserPicks(userDocSnap.data().picks);
        }
      } catch (error) {
        console.error('Error fetching matches or user picks: ', error);
      }
    };

    fetchMatches();
  }, [db]);

  // Correct so user cannot change pick after pick time (add a listener for it)
  const handlePick = async (matchId: number, teamId: string) => {
    try {
      // Fetch the latest matches before allowing the user to make the pick
      const matchesDocRef = doc(db, 'matches', 'matchData');
      const matchesDocSnap = await getDoc(matchesDocRef);

      if (matchesDocSnap.exists()) {
        const matchesData = matchesDocSnap.data();
        const matchList = Object.keys(matchesData).map((id) => ({
          matchId: matchesData[id].matchId,
          team1Id: matchesData[id].team1Id,
          team2Id: matchesData[id].team2Id,
          category: matchesData[id].category,
          points: matchesData[id].points,
          closeTime: matchesData[id].closeTime,
          open: matchesData[id].open,
        }));

        // Find the match and check if it's still open
        const match = matchList.find((m) => m.matchId === matchId);
        if (match && match.open) {
          // Proceed with updating the pick
          const updatedPicks = { ...userPicks, [matchId]: teamId };
          setUserPicks(updatedPicks);

          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userDocRef, {
            picks: updatedPicks,
          });

          // Re-fetch the matches after the pick is updated
          const updatedMatchesDocSnap = await getDoc(matchesDocRef);
          if (updatedMatchesDocSnap.exists()) {
            const updatedMatchesData = updatedMatchesDocSnap.data();
            const updatedMatchList = Object.keys(updatedMatchesData).map((id) => ({
              matchId: updatedMatchesData[id].matchId,
              team1Id: updatedMatchesData[id].team1Id,
              team2Id: updatedMatchesData[id].team2Id,
              category: updatedMatchesData[id].category,
              points: updatedMatchesData[id].points,
              closeTime: updatedMatchesData[id].closeTime,
              open: updatedMatchesData[id].open,
            }));
            setMatches(updatedMatchList);  // Update the local matches state after the pick
          }
        } else {
          console.error('Match is no longer open for picking');
        }
      }
    } catch (error) {
      console.error('Error saving pick: ', error);
    }
  }

  return (
    <div>
      <h1>Pick'em Matches</h1>
      {matches.length === 0 ? (
        <p>No matches available.</p>
      ) : (
        matches.map((match) => (
          <div key={match.matchId} className="match-container">
            <div className="teams">
              <div
                className={classNames('team', {
                  chosen: userPicks[match.matchId] === match.team1Id,
                  unchosen: userPicks[match.matchId] === match.team2Id,
                })}
                onClick={() => handlePick(match.matchId, match.team1Id)}
              >
                <p>{match.team1Id}</p>
              </div>
              <div
                className={classNames('team', {
                  chosen: userPicks[match.matchId] === match.team2Id,
                  unchosen: userPicks[match.matchId] === match.team1Id,
                })}
                onClick={() => handlePick(match.matchId, match.team2Id)}
              >
                <p>{match.team2Id}</p>
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

export default User;