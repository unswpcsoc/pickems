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
      votes: {team1Votes: 0, totalVotes: 0}
    };

    await setDoc(matchesDocRef, matchesData);  // Update the entire document with the new match
    console.log('Match added to Firestore successfully!');
    return true;
  } catch (error) {
    console.log('Error adding match/pickem:', error);
    return false;
  }
};

// Function to add a vote data for all matches to the Firestore database
export const addVoteDataToMatch = async (
  db: Firestore,
  formData: {
  matchId: string, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp, open: boolean, winner: number, votes: {team1Vote: number, totalVote: number}}[]
) => {
  try {
    const matchesDocRef = doc(db, "matches", "matchData"); // Document holding all matches
    const matchesDocSnap = await getDoc(matchesDocRef);

    let matchesData = {};
    if (matchesDocSnap.exists()) {
      matchesData = matchesDocSnap.data();
    }

    for (const match of formData) {
      matchesData[match.matchId] = {
        matchId: match.matchId,
        team1Id: match.team1Id,
        team2Id: match.team2Id,
        category: match.category,
        points: match.points,
        closeTime: match.closeTime,
        open: match.open, // Boolean which lets user figure out if the match is still open for pickems.
        winner: match.winner, // Either 1 or 2 (based on team 1/2)
        votes: match.votes
      };
    }
    // console.log(matchesData)

    await setDoc(matchesDocRef, matchesData);  // Update the entire document with the new match
    // console.log('Match added to Firestore successfully!');
    return true;
  } catch (error) {
    console.log('Error adding match/pickem:', error);
    return false;
  }
};

// Function to add a category to the Firestore database
export const addCategoryToDatabase = async (db: Firestore, categoryName: string) => {
  if (!categoryName) {
    console.log('No category name provided');
    return false;
  }

  try {
    const categoryDocRef = doc(db, "crystalBall", "categories"); // Document holding all category
    const categoryDocSnap = await getDoc(categoryDocRef);

    let categoryData = {};
    if (categoryDocSnap.exists()) {
      categoryData = categoryDocSnap.data();
    }

    const categoryId = uuidv4();
    categoryData[categoryId] = {
      name: categoryName,
      items: {},
    };

    await setDoc(categoryDocRef, categoryData);  // Update the entire document with the new map
    console.log('Team added successfully');
    return true;
  } catch (error) {
    console.error('Error adding team: ', error);
    return false;
  }
};

// TODO!
// Function to add a crystalBall Pickem to the Firestore database
export const addCrystalBallPickemToDatabase = async (
  db: Firestore,
  formData: {
    category: string;
    title: string;
    points: string;
    closeTime: string;
    type: string;
  }
) => {
  const { category, title, points, closeTime, type} = formData;
  if (!category || !title || !points || !closeTime || !type) {
    console.log('Please fill out all fields');
    return false;
  }

  try {
    // Get the category pickem doc
    // Add extra array of category into pickem doc (pickemId -> name: blah, points: blah, closeTime: blah, array of map<str, int> of category)
    const categoryPickemDocRef = doc(db, "crystalBall", "pickems"); // Document holding crystal ball for this category
    const categoryPickemDocSnap = await getDoc(categoryPickemDocRef);

    let crystalBallData = {};
    if (categoryPickemDocSnap.exists()) {
      crystalBallData = categoryPickemDocSnap.data();
    }

    const pickemId = uuidv4();
    const closeTimestamp = Timestamp.fromDate(new Date(closeTime));

    crystalBallData[pickemId] = {
      category: category,
      title: title,
      points: points,
      closeTime: closeTimestamp,
      winner: "",
      img: "",
      type: type,
    };

    await setDoc(categoryPickemDocRef, crystalBallData);  // Update the entire document with the new match
    console.log('Match added to Firestore successfully!');
    return true;
  } catch (error) {
    console.log('Error adding match/pickem:', error);
    return false;
  }
};
