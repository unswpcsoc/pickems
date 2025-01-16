// src/components/AdminPanel.tsx
import { useState, useEffect } from 'react';

import { getAuth } from "firebase/auth";
import { collection, query, where, addDoc, getDocs, Firestore, Timestamp } from "firebase/firestore";  //REMOVE IF MAKING database.tsx

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
      } catch (error) {
        console.error("Error fetching teams: ", error);
      }
    };
    fetchTeams();
  }, [db]);

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
      } catch (error) {
        console.error("Error fetching matches: ", error);
      }
    };
    fetchMatches();
  }, [db]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTeam = async () => {
    // Todo: add image system (add and store)
    if (!teamName) {
      return; // Ensure there's a team name to add
    }

    const q = query(collection(db, "teams"), where("name", "==", teamName)); // Query the teams collection for the name
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('Team name already exists');
      return; // Do not add the team if it already exists
    }

    try {
      await addDoc(collection(db, "teams"), {
        name: teamName,
        teamID: Date.now(), // Change to a system that is efficient (may not be worth reading through the db)
      });
    
      setTeamName('');
      console.log('Team added successfully');
    } catch (error) {
      console.error('Error adding team: ', error);
    }
  };

  const addMatch = async () => {
    const { matchTeam1, matchTeam2, category, points, closeTime } = formData;

    if (!matchTeam1 || !matchTeam2 || !category || !points || !closeTime) {
      console.log('Please fill out all fields');
      return;  // Ensure all fields are filled
    }

    try {
      const team1Id = matchTeam1;
      const team2Id = matchTeam2;
      const closeTimestamp = Timestamp.fromDate(new Date(closeTime));
      const matchId = Math.random()*1000000;

      // Add match data to Firestore
      await addDoc(collection(db, "matches"), {
        closeTime: closeTimestamp,
        matchId: matchId,
        open: true,  // Match is open initially for pickems (might be a bug if admin makes closeTime in the past)
        points: points,
        team1Id: team1Id,
        team2Id: team2Id,
        category: category,
      });

      setFormData({
        matchTeam1: '',
        matchTeam2: '',
        category: '',
        points: '',
        closeTime: '',
      });
      console.log("Match added to Firestore successfully!");
    } catch (error) {
      console.log("Error adding match/pickem:", error);
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
