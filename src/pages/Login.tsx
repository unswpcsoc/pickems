import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User  } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc, Timestamp  } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

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
      

        navigate("/user");
      }).catch((error) => {
        setError(error.message);
      });
    };

  return (
    <div style={{ width: "45vw", margin: "auto" }}>
      <h1>Sign in</h1>
      <Tabs
      defaultActiveKey="email"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
        <Tab eventKey="email" title="Email">
          <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          {error && <p>Error: {error}</p>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <div className="password-forgot">
            <Link to="/password-forgot">Forgot your Password?</Link>
          </div>
          </Form>
        </Tab>
        <Tab eventKey="google" title="Google">
          <Button variant="primary" onClick={handleGoogleLogin}>Sign up with Google</Button>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Login