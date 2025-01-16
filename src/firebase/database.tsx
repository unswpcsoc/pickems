// src/database.ts
import { collection, query, where, addDoc, getDocs, Firestore, Timestamp } from "firebase/firestore";

// Function to add a team to the Firestore database
export const addTeamToDatabase = async (db: Firestore, teamName: string) => {
  if (!teamName) {
    console.log('No team name provided');
    return false;
  }

  const q = query(collection(db, "teams"), where("name", "==", teamName));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    console.log('Team name already exists');
    return false;
  }

  try {
    await addDoc(collection(db, "teams"), {
      name: teamName,
      teamID: Date.now(),
    });
    console.log('Team added successfully');
    return true;
  } catch (error) {
    console.error('Error adding team: ', error);
    return false;
  }
};

// Function to add a match to the Firestore database
export const addMatchToDatabase = async (
  db: Firestore,
  formData: {
    matchTeam1: string;
    matchTeam2: string;
    category: string;
    points: string;
    closeTime: string;
  } // make an interface.tsx file :skull:
) => {
  const { matchTeam1, matchTeam2, category, points, closeTime } = formData;

  if (!matchTeam1 || !matchTeam2 || !category || !points || !closeTime) {
    console.log('Please fill out all fields');
    return false;
  }

  try {
    const team1Id = matchTeam1;
    const team2Id = matchTeam2;
    const closeTimestamp = Timestamp.fromDate(new Date(closeTime));
    const matchId = Math.random() * 1000000;

    await addDoc(collection(db, "matches"), {
      closeTime: closeTimestamp,
      matchId: matchId,
      open: true,
      points: points,
      team1Id: team1Id,
      team2Id: team2Id,
      category: category,
    });

    console.log('Match added to Firestore successfully!');
    return true;
  } catch (error) {
    console.log('Error adding match/pickem:', error);
    return false;
  }
};