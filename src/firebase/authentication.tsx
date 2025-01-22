import { getAuth, /*connectAuthEmulator,*/ createUserWithEmailAndPassword, sendEmailVerification, applyActionCode, sendPasswordResetEmail, confirmPasswordReset} from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp  } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

// troubleshooting in debug
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

// Function that registers a user to the system whilst sendign a email verification link
export const registerUser = async (
  displayName: string,
  email: string, 
  password: string,
  discordName: string,
) => {
  // if (!email && !password) return;  

  const userCredential = await createUserWithEmailAndPassword(
    auth, email, password
  );
  
  if (userCredential && auth.currentUser) {
    
    try {
      sendEmailVerification(auth.currentUser)

      // Add the user to Firestore with their uid as the document name
      const userRef = doc(db, "users", auth.currentUser.uid);  // Create a document reference
      const picksObject = {};
      await setDoc(userRef, {
        email: auth.currentUser.email,
        name: displayName,
        discordUsername: discordName,
        picks: picksObject,
        score: 0,
        rank: -1, // Default rank is nothing until first pickem
        lastEdited: Timestamp.now()
      });
    } catch (error) {
      console.log(error)
    }
  }

  return userCredential
}

// Not sure if this is needed with the native email verification thing
export const confirmUserEmail = async (oobCode:string) => {
  if (!oobCode) return;

  try {
    await applyActionCode(auth, oobCode)
    .then(() => alert('Your email has been verified!'))
  } catch (error:any) {
    alert(error.code)
  }
  
  return;
}

// Function that run the password reset via email
export const passwordReset = async (email: string) => {
  return await sendPasswordResetEmail(auth, email)
}

// Not sure if needed
// Function that handles password reset
export const confirmThePasswordReset = async (
  oobCode:string, newPassword:string
) => {
  if(!oobCode && !newPassword) return;
  
  return await confirmPasswordReset(auth, oobCode, newPassword)
}