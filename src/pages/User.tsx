// src/components/UserPanel.tsx
import { useState } from 'react';

type UserPanelProps = {
  teams: string[];
  matches: { team1: string; team2: string; userPick: string | null }[];
};

const User = ({ teams, matches }: UserPanelProps) => {
  const [userPicks, setUserPicks] = useState<{ [key: number]: string }>({});

  const handlePick = (matchIdx: number, team: string) => {
    setUserPicks({
      ...userPicks,
      [matchIdx]: team,
    });
  };

  return (
    <div>
      <h2>User Panel</h2>

      {matches.length === 0 ? (
        <p>No matches available.</p>
      ) : (
        matches.map((match, idx) => (
          <div key={idx}>
            <h3>{match.team1} vs {match.team2}</h3>
            <div>
              <button
                onClick={() => handlePick(idx, match.team1)}
                disabled={userPicks[idx]}
              >
                Pick {match.team1}
              </button>
              <button
                onClick={() => handlePick(idx, match.team2)}
                disabled={userPicks[idx]}
              >
                Pick {match.team2}
              </button>
            </div>
            {userPicks[idx] && <p>Your pick: {userPicks[idx]}</p>}
          </div>
        ))
      )}
    </div>
  );
};

export default User;
