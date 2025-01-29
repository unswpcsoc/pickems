// Purpose: Display the TeamBuilder component which allows users to create teams

import { useState } from 'react';
import { Firestore } from "firebase/firestore";
import { addTeamToDatabase } from "../../firebase/database"; 

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ImageUpload } from "../../components"

type UserPanelProps = {
  db: Firestore; 
};

const TeamBuilder = ({ db }: UserPanelProps) => {
  // States for forms/input when making teams and matches
  const [teamName, setTeamName] = useState<string>('');
  const [teamColour, setTeamColour] = useState("#ff0000");
  const [teamLogo, setTeamLogo] = useState<string>('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const addTeam = async () => {
    if (!isImageUploaded) {
      console.error("Please upload a file before submitting.");
      return;
    }

    const success = await addTeamToDatabase(db, teamName, teamColour, teamLogo);
    if (success) {
      setTeamName('');
      setTeamColour("#ff0000");
      setIsImageUploaded(false);
    }
  };

  return (
    <div>
      <Form>
        <h3>Create Team</h3>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Team Name (e.g. SKT1)"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
            <label htmlFor="teamColour">Select Team Color:</label>
            <br></br>
            <input type="color" id="teamColour" name="teamColour" value={teamColour} onChange={(e) => setTeamColour(e.target.value)} />
            </Form.Group>
          </Col>

          <Col md={6}>
            <ImageUpload onFileUpload={setIsImageUploaded} onTeamLogo={setTeamLogo}/>
          </Col>
        </Row>

        <Row className="mb-3">
          <h4>Sample pickem</h4>
        </Row>

        <Button variant="primary" type="button" disabled={!isImageUploaded} onClick={addTeam}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default TeamBuilder;