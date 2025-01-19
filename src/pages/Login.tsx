import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User  } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc, Timestamp  } from "firebase/firestore";
const auth = getAuth();
const db = getFirestore();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/user"); // Redirect to user page after successful login
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
  
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential === null) {
          setError("Google Auth Error");
        }
        
        const user = auth.currentUser as User;
        console.log([user, result])
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          console.log("User already exists in Firestore");
        } else {
          await setDoc(userRef, {
            email: user.email,
            name: user.displayName,
            picks: {},
            score: 0,
            rank: -1, // Default rank is nothing until first pickem
            lastEdited: Timestamp.now()
          });
          console.log("User added to Firestore");
        }
      

        // navigate("/user");
      }).catch((error) => {
        setError(error.message);
      });
    };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={handleGoogleLogin}>Sign in with Google</button>

      <div className="password-forgot">
        <Link to="/password-forgot">Forgot your Password?</Link>
      </div>
    </div>
  );
};

export default Login