import { useState } from 'react';
import { auth, db } from "../../firebase/index";

import { doc, updateDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

interface ChangeTeamNameProps {
  id: string
  teamData: {name: string, teamColour: string, teamLogo: string };
}

const ChangeTeamName = ({ id, teamData }: ChangeTeamNameProps) => {
  const [teamName, setTeamName] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false)}
  const handleShow = () => setShow(true);

  const editTeamName = async () => {
    if (teamName == "" || auth.currentUser == null) {
      return;
    }

    try {
      const updatedTeamData = {
        [id]: { ...teamData, name: teamName }, 
      };
      await updateDoc(doc(db, "teams", "teamData"), updatedTeamData);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>Edit Name</Button>

      <div style={{ width: "95vw", margin: "auto"}}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Change Team Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label htmlFor="basic-url">New Team Name</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control id="teamName" aria-describedby="basic-addon3" onChange={(e) => setTeamName(e.target.value)}/>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={editTeamName}>
              Update Team Name
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
};

export default ChangeTeamName;