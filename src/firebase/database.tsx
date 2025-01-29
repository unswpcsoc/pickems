// src/database.ts
import { v4 as uuidv4} from 'uuid';
import { doc, getDoc, setDoc, Firestore, Timestamp } from "firebase/firestore";

// Function to add a team to the Firestore database
export const addTeamToDatabase = async (db: Firestore, teamName: string, teamColour: string, teamLogo: string) => {
  if (!teamName) {
    console.log('No team name provided');
    return false;
  }

  try {
    const teamsDocRef = doc(db, "teams", "teamData"); // Document holding all teams
    const teamsDocSnap = await getDoc(teamsDocRef);

    let teamsData = {};
    if (teamsDocSnap.exists()) {
      teamsData = teamsDocSnap.data();
    }

    const teamId = uuidv4();
    teamsData[teamId] = {
      name: teamName,
      teamColour: teamColour,
      teamLogo: teamLogo,
    };

    await setDoc(teamsDocRef, teamsData);  // Update the entire document with the new map
    console.log('Team added successfully');
    return true;
  } catch (error) {
    console.error('Error adding team: ', error);
    return false;
  }
};

// export const fetchTeamFromDatabase = async (db: Firestore) => {
//   try {
//         const teamsDocRef = doc(db, "teams", "teamData"); // Assuming "teamData" document stores all teams
//         const teamsDocSnap = await getDoc(teamsDocRef);

//         if (teamsDocSnap.exists()) {
//           const teamsData = teamsDocSnap.data();
//           const teamsList = Object.keys(teamsData).map(id => ({
//             name: teamsData[id].name,
//             id,
//           }));
//           setTeamOptions(teamsList);
//         }
//         setTeamAdded(false);
//       } catch (error) {
//         console.error("Error fetching teams: ", error);
//       }
// }

// Function to add a match to the Firestore database
export const addMatchToDatabase = async (
  db: Firestore,
  formData: {
    matchTeam1: string;
    matchTeam2: string;
    category: string;
    points: string;
    closeTime: string;
  }
) => {
  const { matchTeam1, matchTeam2, category, points, closeTime } = formData;
  if (!matchTeam1 || !matchTeam2 || !category || !points || !closeTime) {
    console.log('Please fill out all fields');
    return false;
  }

  try {
    const matchesDocRef = doc(db, "matches", "matchData"); // Document holding all matches
    const matchesDocSnap = await getDoc(matchesDocRef);

    let matchesData = {};
    if (matchesDocSnap.exists()) {
      matchesData = matchesDocSnap.data();
    }

    const matchId = uuidv4();
    const closeTimestamp = Timestamp.fromDate(new Date(closeTime));

    matchesData[matchId] = {
      matchId: matchId,
      team1Id: matchTeam1,
      team2Id: matchTeam2,
      category: category,
      points: points,
      closeTime: closeTimestamp,
      open: true, // Boolean which lets user figure out if the match is still open for pickems.
      winner: "-1", // Either 1 or 2 (based on team 1/2)
    };

    await setDoc(matchesDocRef, matchesData);  // Update the entire document with the new match
    console.log('Match added to Firestore successfully!');
    return true;
  } catch (error) {
    console.log('Error adding match/pickem:', error);
    return false;
  }
};