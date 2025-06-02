import { db } from "./index";
import { rank_users } from "../utils";
import { collection, query, getDocs, doc, updateDoc, setDoc, orderBy } from "firebase/firestore";  //REMOVE IF MAKING database.tsx

export const updateLeaderboard = async () => {
    const usersCollectionRef = collection(db, "users");
    // Make leaderboard
    const leaderboardQuery = query(usersCollectionRef, orderBy("score", "desc"));
    const leaderboardDocsSnap = await getDocs(leaderboardQuery);
    if (!leaderboardDocsSnap.empty) {
      const matchesData = leaderboardDocsSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: doc.id,
          name: data.name,
          score: data.score,
          rank: data.rank,
          email: data.email,
          inPerson: (data.inPerson === undefined) ? false : data.inPerson,  // Default to false if inPerson is not set (google login)
          discordUsername: (data.discordUsername === undefined) ? "" : data.discordUsername,
        }
      });

      // Algo for ties
      rank_users(matchesData);

      matchesData.forEach(async (user) => {
        const userDocRef = doc(db, "users", user.userId);
        await updateDoc(userDocRef, {
          rank: user.rank,
        });
      });

      // Updating leaderboard
      const leaderboardCollection = matchesData.map((user) => {
        return {
          name: user.name,
          rank: user.rank,
          score: user.score,
          inPerson: user.inPerson,
        }
      })
      const userDocRef = doc(db, "leaderboard", "leaderboardStatus");
      await setDoc(userDocRef, { leaderboard: leaderboardCollection});

      // Separate inPerson and remote users
      const inPersonUsers = matchesData.filter((user) => user.inPerson);
      const remoteUsers = matchesData.filter((user) => !user.inPerson);

      // Updating admin inperson leaderboard
      const inPersonLeaderboardCollection = inPersonUsers.map((user) => {
        return {
          name: user.name,
          rank: user.rank,
          score: user.score,
          discordUsername: user.discordUsername,
          email: user.email,
        }
      })
      const inPersonRef = doc(db, "leaderboard", "inPersonLeaderboard");
      await setDoc(inPersonRef, { leaderboard: inPersonLeaderboardCollection});

      // Updating admin remote leaderboard
      const remoteLeaderboardCollection = remoteUsers.map((user) => {
        return {
          name: user.name,
          rank: user.rank,
          score: user.score,
          discordUsername: user.discordUsername,
          email: user.email,
        }
      })
      const remoteRef = doc(db, "leaderboard", "remoteLeaderboard");
      await setDoc(remoteRef, { leaderboard: remoteLeaderboardCollection});
    }
}