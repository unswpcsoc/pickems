import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdinalSuffix } from "../utils";
import { getDoc, doc, Firestore, updateDoc } from "firebase/firestore";  // For fetching data from Firestore
import { getAuth, signOut } from "firebase/auth";  // For logging out the user
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

type UserPanelProps = {
  db: Firestore; 
};

const auth = getAuth();

const User = ({ db }: UserPanelProps) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);  // Loading state

  // States used for Discord username change
  const [teamName, setTeamName] = useState("");
  const [teamColour, setTeamColour] = useState("");
  const [teamLogoUrl, setTeamLogoUrl] = useState<string>('');


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

  const editTeam = async () => {
    if (teamName == "" && teamColour == "") {
      return;
    }

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name:
        teamColour: 
      })
    }
  };

  return (
    <div style={{ width: "95vw", margin: "auto"}}>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Team Property Change</Modal.Title>
          <h4>Note: If you only want to change on property leave the other properties blank.</h4>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="basic-url">Enter New Team Name</Form.Label>``
          <InputGroup className="mb-3">
            <Form.Control id="discordName" aria-describedby="basic-addon3" onChange={(e) => setDiscordName(e.target.value)}/>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={editTeam}>
            Update Team
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
};

export default User;