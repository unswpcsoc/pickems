import { v4 as uuidv4} from 'uuid';
import { doc, getDoc, setDoc, Firestore, Timestamp, updateDoc, collection, getDocs } from "firebase/firestore";
import { CrystalBallFormData, CrystalBallEntry } from '../defines';
import { updateLeaderboard } from './leaderboard';
import { db } from "../firebase";

// Function to add a crystalBall Pickem to the Firestore database
export const addCrystalBallPickemToDatabase = async (
    formData: CrystalBallFormData
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

    let crystalBallData: Record<string, CrystalBallEntry> = {};
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

// Function to edit a crystalBall Pickem to the Firestore database
export const editCrystalBallPickemToDatabase = async (
    formData: CrystalBallEntry,
    id: string
  ) => {
  const { category, title, points, closeTime, winner, img} = formData;
  if (!category || !title || !points || !closeTime || !id) {
    console.log('Please fill out all fields');
    return false;
  }

  try {
    // Get the category pickem doc
    // Add extra array of category into pickem doc (pickemId -> name: blah, points: blah, closeTime: blah, array of map<str, int> of category)
    const categoryPickemDocRef = doc(db, "crystalBall", "pickems"); // Document holding crystal ball for this category
    const categoryPickemDocSnap = await getDoc(categoryPickemDocRef);

    let crystalBallData: Record<string, CrystalBallEntry> = {};
    if (categoryPickemDocSnap.exists()) {
      crystalBallData = categoryPickemDocSnap.data();
    }

    crystalBallData[formData.id] = {
      category: category,
      title: title,
      points: points,
      closeTime: closeTime,
      winner: winner,
      img: img,
      type: id,
    };

    await setDoc(categoryPickemDocRef, crystalBallData);  // Update the entire document with the new match
    console.log('Match edited successfully!');
    return true;
  } catch (error) {
    console.log('Error editing match/pickem:', error);
    return false;
  }
};

// Function to submit a crystalBall Pickem to the Firestore database
export const submitAnswerCrystalBall = async (
    formData: CrystalBallEntry,
    answer: string,
    id: string
  ) => {
  const { category, title, points, closeTime, winner, img, type} = formData;
  try {
    // Get the category pickem doc
    // Add extra array of category into pickem doc (pickemId -> name: blah, points: blah, closeTime: blah, array of map<str, int> of category)
    const categoryPickemDocRef = doc(db, "crystalBall", "pickems"); // Document holding crystal ball for this category
    const categoryPickemDocSnap = await getDoc(categoryPickemDocRef);

    let crystalBallData: Record<string, CrystalBallEntry> = {};
    if (categoryPickemDocSnap.exists()) {
      crystalBallData = categoryPickemDocSnap.data();
    }

    // Update in Firestore to ensure no user can change pick post update
    const closeTimestamp = Timestamp.fromDate(new Date());
    await updateDoc(categoryPickemDocRef, {
      [`${id}`]: {
        category: category,
        title: title,
        points: points,
        closeTime: closeTimestamp,
        winner: answer,
        img: img,
        type: type,
      }
    });

    // Update all user scores
    const usersCollectionRef = collection(db, "users");
    const userDocsSnap = await getDocs(usersCollectionRef);

    userDocsSnap.forEach(async (userDoc) => {
      const userData = userDoc.data();
      // Check if the user made a pick for this match
      const userPick = userData.crystalBall?.[id];
      if (userPick === answer) {
        const updatedScore = (userData.score || 0) + parseInt(points, 10);
        // Update the user's score in their document
        await updateDoc(doc(db, "users", userDoc.id), {
          score: updatedScore,
        });
      }
    });

    // New leaderboard based on new scores
    updateLeaderboard();

    return true;
  } catch (error) {
    return false;
  }
};