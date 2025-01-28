// Purpose: Display the MatchBuilder component which allows users to create matches (pickems)

import { useState } from 'react';
import { TypesOfMatches } from "../../defines";
import { Firestore } from "firebase/firestore";
import { addMatchToDatabase } from "../../firebase/database";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type UserPanelProps = {
  db: Firestore;
  teamOptions: { name: string, id: string }[];
};

const MatchBuilder = ({ db, teamOptions }: UserPanelProps) => { 
  // States for forms/input when making teams and matches
  const [formData, setFormData] = useState({
    matchTeam1: '',
    matchTeam2: '',
    category: '',
    points: '',
    closeTime: ''
  });

  // States for team and match display

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
  const addMatch = async () => {
    const success = await addMatchToDatabase(db, formData);
    if (success) {
      setFormData({
        matchTeam1: '',
        matchTeam2: '',
        category: '',
        points: '',
        closeTime: '',
      });
    }
  };

  return (
    <div>
      <Form>
        <h3>Create Match</h3>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formMatchTeam1">
              <Form.Label>Select Team 1</Form.Label>
              <Form.Select
                name="matchTeam1"
                value={formData.matchTeam1}
                onChange={handleChange}
              >
                <option value="">Select Team 1</option>
                {teamOptions.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formMatchTeam2">
              <Form.Label>Select Team 2</Form.Label>
              <Form.Select
                name="matchTeam2"
                value={formData.matchTeam2}
                onChange={handleChange}
              >
                <option value="">Select Team 2</option>
                {teamOptions.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formMatchCategory">
              <Form.Label>Select Match Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {Object.keys(TypesOfMatches).map((matchTypeKey) => (
                  <option key={matchTypeKey} value={TypesOfMatches[matchTypeKey as keyof typeof TypesOfMatches]}>
                    {matchTypeKey}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formMatchPoints">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="text"
                name="points"
                value={formData.points}
                onChange={handleChange}
                placeholder="Points"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formMatchCloseTime">
              <Form.Label>Pickem Close Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleChange}
                placeholder="Time to close pickem"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="button" onClick={addMatch}>
          Create Match
        </Button>
      </Form>
    </div>
  )
}

export default MatchBuilder;