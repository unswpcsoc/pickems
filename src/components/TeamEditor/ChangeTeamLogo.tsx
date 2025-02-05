import { useState } from 'react';
import { auth, db, storage } from "../../firebase/index";
import { ImageUpload } from "../../components";

import { doc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from 'firebase/storage';

import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

interface ChangeTeamColourProps {
  id: string
  teamData: {name: string, teamColour: string, teamLogo: string };
}

const ChangeTeamColour = ({ id, teamData }: ChangeTeamColourProps) => {
  const [teamLogo, setTeamLogo] = useState<string>('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false)}
  const handleShow = () => setShow(true);

  

  const editTeamColour = async () => {
    if (teamLogo == "" || auth.currentUser == null) {
      return;
    }

    try {
      const oldLogoRef = ref(storage, `uploads/${teamLogo}`);
      const updatedTeamData = {
        [id]: { ...teamData, teamLogo: teamLogo }, 
      };
      await updateDoc(doc(db, "teams", "teamData"), updatedTeamData);

      // Delete the old logo (DOESNT WORK- NEED TO REGEX URL)
      deleteObject(oldLogoRef).then(() => {
      }).catch((e) => {
        console.log(e);
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>Edit Logo</Button>

      <div style={{ width: "95vw", margin: "auto"}}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Change Team Logo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <ImageUpload onFileUpload={setIsImageUploaded} onTeamLogo={setTeamLogo}/>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={!isImageUploaded} onClick={editTeamColour}>
              Update Team Logo
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
};

export default ChangeTeamColour;