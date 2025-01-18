// src/components/AdminPanel.tsx
import { useState, useEffect } from 'react';
import { TypesOfMatches } from "../defines";

import { getAuth } from "firebase/auth";
import { collection, query, getDocs, Firestore, Timestamp, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";  //REMOVE IF MAKING database.tsx
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
  const [matches, setMatches] = useState<{ matchId: string, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp, open: boolean, winner: number }[]>([]); // Matches state

  // Flags to trigger re-fetching
  const [teamAdded, setTeamAdded] = useState(false);
  const [matchAdded, setMatchAdded] = useState(false);

  // Fetch the teams from Firestore on initial load
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsDocRef = doc(db, "teams", "teamData"); // Assuming "teamData" document stores all teams
        const teamsDocSnap = await getDoc(teamsDocRef);

        if (teamsDocSnap.exists()) {
          const teamsData = teamsDocSnap.data();
          const teamsList = Object.keys(teamsData).map(id => ({
            name: teamsData[id].name,
            id,
          }));
          setTeamOptions(teamsList);
        }
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
        const matchesDocRef = doc(db, "matches", "matchData"); // Assuming "matchData" document stores all matches
        const matchesDocSnap = await getDoc(matchesDocRef);

        if (matchesDocSnap.exists()) {
          const matchesData = matchesDocSnap.data();
          const matchList = Object.keys(matchesData).map(id => ({
            matchId: matchesData[id].matchId,
            team1Id: matchesData[id].team1Id,
            team2Id: matchesData[id].team2Id,
            category: matchesData[id].category,
            points: matchesData[id].points,
            closeTime: matchesData[id].closeTime,
            open: matchesData[id].open,
            winner: matchesData[id].winner,
          }));
          setMatches(matchList);
        }
        
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

  const closePickem = async (matchId: string) => {
    try {
      const matchesDocRef = doc(db, "matches", "matchData");
      const matchesDocSnap = await getDoc(matchesDocRef);

      if (matchesDocSnap.exists()) {
        const matchesData = matchesDocSnap.data();
        matchesData[matchId].open = false; // Close the pickem
        await setDoc(matchesDocRef, matchesData);
        setMatchAdded(true); // Trigger a re-fetch
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
        matchesData[matchId].winner = winner;
        matchesData[matchId].open = false;
        setMatches(Object.keys(matchesData).map(id => ({
          matchId: matchesData[id].matchId,
          team1Id: matchesData[id].team1Id,
          team2Id: matchesData[id].team2Id,
          category: matchesData[id].category,
          points: matchesData[id].points,
          closeTime: matchesData[id].closeTime,
          open: matchesData[id].open,
          winner: matchesData[id].winner,
        })))
  
        // Update match winner in Firestore
        await setDoc(matchesDocRef, matchesData); 
  
        // Fetch all user documents
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
  
      } else {
        console.error("Match data not found.");
      }
    } catch (error) {
      console.error("Error setting winner:", error);
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
          onChange={handleChange}
        >
          <option value="">Select Team 1</option>
          {teamOptions.map((team) => (
            <option key={team.id} value={team.name}>{team.name}</option>
          ))}
        </select>
        <select
          name="matchTeam2"
          value={formData.matchTeam2}
          onChange={handleChange}
        >
          <option value="">Select Team 2</option>
          {teamOptions.map((team) => (
            <option key={team.id} value={team.name}>{team.name}</option>
          ))}
        </select>
      </div>
      <div>
        <div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Match Category</option>
            {Object.keys(TypesOfMatches).map((matchTypeKey) => (
              <option key={matchTypeKey} value={TypesOfMatches[matchTypeKey as keyof typeof TypesOfMatches]}>
                {matchTypeKey}  {/* Display the enum key */}
              </option>
            ))}
          </select>
        </div>

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
            {match.team1Id} vs {match.team2Id} | {match.category} | Points: {match.points} | Open: {match.open ? "Yes" : "No"}
            <button onClick={() => closePickem(match.matchId)} disabled={!match.open}>
              Close Pickem
            </button>
            <button onClick={() => setWinner(match.matchId, match.team1Id)} disabled={match.winner !== -1}>
              Set Winner: {match.team1Id}
            </button>
            <button onClick={() => setWinner(match.matchId, match.team2Id)} disabled={match.winner !== -1}>
              Set Winner: {match.team2Id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
