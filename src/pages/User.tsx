import { useState, useEffect } from 'react';
import { auth, db } from "../firebase/index";
import { useNavigate } from 'react-router-dom';
import { getOrdinalSuffix } from "../utils";
import { getDoc, doc, updateDoc } from "firebase/firestore";  // For fetching data from Firestore
import { signOut } from "firebase/auth";  // For logging out the user
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import DiscordAlert from "../components/DiscordAlert/DiscordAlert";
import InPersonAlert from "../components/InPersonAlert/InPersonAlert";

const User = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    score: number;
    rank: number;
    discordUsername?: string;
    inPerson?: boolean
  } | null>(null);  // State to hold user data

  const [loading, setLoading] = useState(true);  // Loading state

  // States used for Discord username change
  const [discordName, setDiscordName] = useState("");
  const [inPersonBool, setInPersonBool] = useState(false);

  // States used for modals (the popups)
  const [showDiscord, setShowDiscord] = useState(false);
  const [showInPerson, setShowInPerson] = useState(false);

  // Fetch user data from Firestore on component mount
  const fetchUserData = async () => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data() as any);
        }
      } catch (error) {
        console.log("Error fetching user data: ", error);
      }
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShowDiscord(false);
    setShowInPerson(false);
    fetchUserData();
  }
  const handleShowDiscord = () => setShowDiscord(true);
  const handleShowInPerson = () => setShowInPerson(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle Discord username change
  const discordChange = async () => {
    if (userData === null || discordName === "" ) {
      return; // SOme error
    }

    try {
      // Add discord name to user profile
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        discordUsername: discordName
      });
      handleClose();
    } catch (error) {
      return;
    }
    
  }

  // Handles the change in inperson attendance (on Sunday)
  const inPersonChange = async () => {
    try {
      // Add discord name to user profile
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        inPerson: inPersonBool
      });
      handleClose();
    } catch (error) {
      return;
    }
    
  }

  // Handle Sign Out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); // Redirect to home page after sign out
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) { // Type safety
    return (
      <div>
        <div>No user data available. Please log in.</div>
        <div>
          <button onClick = {handleSignOut}>Sign Out</button>
        </div>
      </div>
    );
  }

  // Blank rank is --th (when user hasn't participated in a pickem yet, -1 is the default value)
  // Only happens prior to a submitted/processed pickem the user has done
  const displayRank = userData.rank === -1 ? '--' : `${getOrdinalSuffix(userData.rank)}`;
  let verified = "Unverified";
  if (auth.currentUser !== null && auth.currentUser.emailVerified === true) {
    verified = "Verified";
  }

  return (
    <>
    <DiscordAlert discordId={userData.discordUsername} />
    <InPersonAlert attendanceStatus={userData.inPerson}/>
    <div style={{ width: "95vw", margin: "auto"}}>
      <br />
      <Card style={{ width: '20vw' }}>
      <Card.Body>
        <Card.Title>User Panel</Card.Title>
        <Card.Text>Name: {userData.name}</Card.Text>
        <Card.Text>Email: {userData.email}</Card.Text>
        <Card.Text>Email Verification: {verified}</Card.Text>
        <Card.Text>Discord Username: {userData?.discordUsername || "n/a"}</Card.Text>
        <Card.Text>Score: {userData.score}</Card.Text>
        <Card.Text>Rank: {displayRank}</Card.Text>
        <Card.Text>Is attending Inperson on Sunday? {userData?.inPerson === undefined ? "n/a" : userData?.inPerson ? "Yes" : "No"}</Card.Text>
        <Button variant="primary" onClick = {handleShowDiscord} >Update Discord Username</Button>
        <Button variant="primary" onClick = {handleShowInPerson} >Update Sunday Inperson Attendance Status</Button>
      </Card.Body>

      <Modal show={showDiscord} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Discord Username Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="basic-url">Enter Discord Username</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control id="discordName" aria-describedby="basic-addon3" onChange={(e) => setDiscordName(e.target.value)}/>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={discordChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    
      <Modal show={showInPerson} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sunday Attendance Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            type="checkbox"
            onChange={(e) => setInPersonBool(e.target.checked)}
            label="Will you be attending Megalan in person on Sunday the 23rd of Feburary?"
            />
            <Form.Text className="text-muted">
              Note: If you are not attending Megalan in person on Sunday, you will only be eligible for the online pickems prize pool (Only the 1st place Aorus Jacket). Other prizes will only be available for inperson attendeess.
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={inPersonChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </Card>
    <br />
    <Button variant="primary" onClick = {handleSignOut} >Sign Out</Button>
    </div>
    </>
  );
};

export default User;