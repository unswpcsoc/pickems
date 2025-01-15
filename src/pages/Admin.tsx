// src/components/AdminPanel.tsx
import { useState } from 'react';

type AdminPanelProps = {
  teams: string[];
  setTeams: React.Dispatch<React.SetStateAction<string[]>>;
  matches: { team1: string; team2: string; userPick: string | null }[];
  setMatches: React.Dispatch<React.SetStateAction<{ team1: string; team2: string; userPick: string | null }[]>>;
};

const Admin = ({ teams, setTeams, matches, setMatches }: AdminPanelProps) => {
  const [teamName, setTeamName] = useState<string>('');
  const [matchTeam1, setMatchTeam1] = useState<string>('');
  const [matchTeam2, setMatchTeam2] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [points, setPoints] = useState<string>('');
  const [closeTime, setCloseTime] = useState<string>('');

  const addTeam = () => {
    // Prevent duplicate teams!
    // Todo: add image system (add and store)
    if (teamName && !teams.includes(teamName)) {
      setTeams([...teams, teamName]);
      setTeamName('');
    }
  };

  const addMatch = () => {
    if (matchTeam1 && matchTeam2 && teams.includes(matchTeam1) && teams.includes(matchTeam2)) {
      setMatches([...matches, { team1: matchTeam1, team2: matchTeam2, userPick: null }]);
      setMatchTeam1('');
      setMatchTeam2('');
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <div>
        <h3>Create Team</h3>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
        />

        <button onClick={addTeam}>Add Team</button>
      </div>

      

      <div>
        <h3>Create Match</h3>
        <input
          type="text"
          value={matchTeam1}
          onChange={(e) => setMatchTeam1(e.target.value)}
          placeholder="Team 1"
        />
        <input
          type="text"
          value={matchTeam2}
          onChange={(e) => setMatchTeam2(e.target.value)}
          placeholder="Team 2"
        />
      </div>

      <div>
      <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="category"
        />

        <input
          type="text"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Points"
        />
        <input
          type="text"
          value={closeTime}
          onChange={(e) => setCloseTime(e.target.value)}
          placeholder="Time to close pickem"
        />
      </div>

      <div>
        <button onClick={addMatch}>Create Match</button>
      </div>

      <h4>Teams</h4>
      <ul>
        {teams.map((team, idx) => <li key={idx}>{team}</li>)}
      </ul>

      <h4>Matches</h4>
      <ul>
        {matches.map((match, idx) => (
          <li key={idx}>{match.team1} vs {match.team2}</li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
