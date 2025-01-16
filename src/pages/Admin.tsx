// src/components/AdminPanel.tsx
import { useState, useEffect } from 'react';

import { getAuth } from "firebase/auth";
import { collection, query, getDocs, Firestore, Timestamp } from "firebase/firestore";  //REMOVE IF MAKING database.tsx
import { addTeamToDatabase, addMatchToDatabase } from "../firebase/database"; 

const auth = getAuth();

type UserPanelProps = {
  db: Firestore; 
};

const Admin = ({ db }: UserPanelProps) => {
  const [teamName, setTeamName] = useState<string>('');
  const [formData, setFormData] = useState({
    matchTeam1: '',
    matchTeam2: '',
    category: '',
    points: '',
    closeTime: ''
  });
  const [teamOptions, setTeamOptions] = useState<{ name: string, id: string }[]>([]);
  const [matches, setMatches] = useState<{ matchId: number, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp }[]>([]); // Matches state

  // Flags to trigger re-fetching
  const [teamAdded, setTeamAdded] = useState(false);
  const [matchAdded, setMatchAdded] = useState(false);

  // Fetch the teams from Firestore on initial load
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const q = query(collection(db, "teams"));  // Query Firestore for all teams
        const querySnapshot = await getDocs(q);

        const teamsList: { name: string, id: string }[] = [];
        querySnapshot.forEach((doc) => {
          const team = doc.data();
          teamsList.push({ name: team.name, id: doc.id });  // Push team name and id to the list
        });

        setTeamOptions(teamsList);
        setTeamAdded(false);
      } catch (error) {
        console.error("Error fetching teams: ", error);
      }
    };
    fetchTeams();
  }, [db, teamAdded]);

  // Fetch the matches/pickems from Firestore on initial load
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const q = query(collection(db, "matches"));  // Query Firestore for all matches
        const querySnapshot = await getDocs(q);

        const matchList: { matchId: number, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp }[] = [];
        querySnapshot.forEach((doc) => {
          const match = doc.data();
          matchList.push({
            matchId: match.matchId,
            team1Id: match.team1Id,
            team2Id: match.team2Id,
            category: match.category,
            points: match.points,
            closeTime: match.closeTime,
          });
        });

        setMatches(matchList);
        setMatchAdded(false);
      } catch (error) {
        console.error("Error fetching matches: ", error);
      }
    };
    fetchMatches();
  }, [db, matchAdded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTeam = async () => {
    const success = await addTeamToDatabase(db, teamName);
    if (success) {
      setTeamName('');
      setTeamAdded(true);
    }
  };

  const addMatch = async () => {
    const success = await addMatchToDatabase(db, formData);
    if (success) {
      setFormData({
        matchTeam1: '',
        matchTeam2: '',
        category: '',
        points: '',
        closeTime: '',
      });
      setMatchAdded(true);
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
        <select
          name="matchTeam1"
          value={formData.matchTeam1}
          onChange={handleChange}  // Now supports both input and select
        >
          <option value="">Select Team 1</option>
          {teamOptions.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>  // Use team ID for team1
          ))}
        </select>
        <select
          name="matchTeam2"
          value={formData.matchTeam2}
          onChange={handleChange}  // Now supports both input and select
        >
          <option value="">Select Team 2</option>
          {teamOptions.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>  // Use team ID for team2
          ))}
        </select>
      </div>
      <div>
      <input
          type="text"
          name = "category"
          value={formData.category}
          onChange={handleChange}
          placeholder="category"
        />

        <input
          type="text"
          name = "points"
          value={formData.points}
          onChange={handleChange}
          placeholder="Points"
        />
        <input
          type="datetime-local"
          name = "closeTime"
          value={formData.closeTime}
          onChange={handleChange}
          placeholder="Time to close pickem"
        />
      </div>
      <div>
        <button onClick={addMatch}>Create Match</button>
      </div>

      <h4>Teams</h4>
      <ul>
        {teamOptions.map((team, idx) => (
          <li key={idx}>{team.name}</li>  // Display list of teams
        ))}
      </ul>

      <h4>Matches</h4>
      <ul>
        {matches.map((match, idx) => (
          <li key={idx}>
            {teamOptions.find((x) => x.id === match.team1Id)?.name} vs {teamOptions.find((x) => x.id === match.team2Id)?.name} | {match.category} | Points: {match.points}
          </li>  // Display match details
        ))}
      </ul>
    </div>
  );
};

export default Admin;
