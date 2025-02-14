import { useState } from "react";
import { auth, db } from "../firebase/index";

import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, User  } from "firebase/auth";
import { registerUser } from "../firebase/authentication";
import { doc, setDoc, getDoc, Timestamp  } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discordUsername: '',
    password: '',
    confirmPassword: '',
    inPersonBool: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords did not match.");
        return;
      }

      if (!formData.email.endsWith("edu.au")) {
        setError("You are not registering with a University email (edu.au), please try Google Sign in");
        return;
      }

      // Register user
      await registerUser(formData.name, formData.email, formData.password, formData.discordUsername, formData.inPersonBool);
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else {
        setError(error.message || "An error occurred during signup.");
      }
    }
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
          setError("User already exists in the database, please try logging in!");
        } else {
          await setDoc(userRef, {
            email: user.email,
            name: user.displayName,
            picks: {},
            score: 0,
            rank: -1, // Default rank is nothing until first pickem
            lastEdited: Timestamp.now(),
          });
          navigate("/");
        }
      

        // navigate("/user");
      }).catch((error) => {
        setError(error.message);
      });
    };

  return (
    <div style={{ width: "45vw", minWidth: "350px", margin: "auto" }}>
      <br />
      <h1>Sign up</h1>
      <Tabs
      defaultActiveKey="email"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
        <Tab eventKey="email" title="Email">
          <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter Username"
              value={formData.name}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Visible name that will be displayed on the leaderboard and used when distributing prizes.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Note: Only edu.au emails are accepted as valid emails.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDiscord">
            <Form.Label>Discord Username</Form.Label>
            <Form.Control
              type="text"
              name="discordUsername"
              placeholder="Enter Discord Username"
              value={formData.discordUsername}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Discord usernames are strictly used for contacting winners who won prizes for the pickems.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Note: Passwords must be 6 characters or longer and contain at least 1 uppercase letter, lowercase letter, and numeric character.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
            type="checkbox"
            checked={formData.inPersonBool}
            onChange={(e) => setFormData({...formData, inPersonBool: e.target.checked})}
            label="Will you be attending Megalan inperson on Sunday the 23rd of Feburary?"
            />
            <Form.Text className="text-muted">
              Note: If you are not attending Megalan inperson on Sunday, you will only be eligible for the online pickems prize pool (Only the 1st place Aorus Jacket). Other prizes will only be available for inperson attendeess.
            </Form.Text>
          </Form.Group>

          {error && <p>Error: {error}</p>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
          </Form>
        </Tab>
        <Tab eventKey="google" title="Google">
          <Button variant="primary" onClick={handleGoogleLogin}>Sign up with Google</Button>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Signup;
