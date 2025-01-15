import { getAuth, /*connectAuthEmulator,*/ createUserWithEmailAndPassword, sendEmailVerification, updateProfile, applyActionCode, sendPasswordResetEmail, confirmPasswordReset} from "firebase/auth";

const auth = getAuth();

// troubleshooting in debug
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

export const registerUser = async (
  displayName: string,
  email: string, 
  password: string
) => {
  // if (!email && !password) return;  

  const userCredential = await createUserWithEmailAndPassword(
    auth, email, password
  );
  
  if (userCredential && auth.currentUser) {
    
    try {
      sendEmailVerification(auth.currentUser)
      updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: "https://google.com"
      })
    } catch (error) {
      console.log(error)
    }
  }

  return userCredential
}

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


export const passwordReset = async (email: string) => {
  return await sendPasswordResetEmail(auth, email)
}

export const confirmThePasswordReset = async (
  oobCode:string, newPassword:string
) => {
  if(!oobCode && !newPassword) return;
  
  return await confirmPasswordReset(auth, oobCode, newPassword)
}