import { useState } from 'react';
import { auth, db } from "../../firebase/index";

import { doc, updateDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

interface ChangeTeamColourProps {
  id: string
  teamData: {name: string, teamColour: string, teamLogo: string };
}

const ChangeTeamColour = ({ id, teamData }: ChangeTeamColourProps) => {
  const [teamColour, setTeamColour] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false)}
  const handleShow = () => setShow(true);

  const editTeamColour = async () => {
    if (teamColour == "" || auth.currentUser == null) {
      return;
    }

    try {
      const updatedTeamData = {
        [id]: { ...teamData, teamColour: teamColour }, 
      };
      await updateDoc(doc(db, "teams", "teamData"), updatedTeamData);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>Edit Colour</Button>

      <div style={{ width: "95vw", margin: "auto"}}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Change Team Colour</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label htmlFor="basic-url">Select Team Colour</Form.Label>
            <InputGroup className="mb-3">
              <input type="color" id="teamColour" name="teamColour" value={teamColour} onChange={(e) => setTeamColour(e.target.value)} />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={editTeamColour}>
              Update Team Colour
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
};

export default ChangeTeamColour;