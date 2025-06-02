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
  categories: Map<string, {
    name: string;
    objs: Map<string, string>;
  }>
};

const CrystalBallCreator = ({ db, categories }: UserPanelProps) => { 
  // States for forms/input when making teams and matches
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    points: '',
    closeTime: '',
  });

  // States for team and match display

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
  const addCrystalBall = async () => {
    const success = await addCrystalBallToDatabase(db, formData);
    if (success) {
      setFormData({
        category: '',
        title: '',
        points: '',
        closeTime: '',
      });
    }
  };

  return (
    <div>
      <Form>
        <h3>Create Crystal Ball Pickem</h3>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formMatchTeam1">
              <Form.Label>Select Category</Form.Label>
              <Form.Select
                name="matchTeam1"
                value={formData.category}
                onChange={(e) => handleChange}
              >
                <option value="">Select Category</option>
                {Array.from(categories.entries()).map(([id, category]) => (
                  <option key={id} value={id}>{category.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
            <Form.Label>Crystal Ball Pickem Title</Form.Label>
            <Form.Control
              type="text"
              name="Crystal Ball Pickem Title"
              placeholder="Pickem Title (e.g. Most Kills, Most Deaths, etc.)"
              value={formData.category}
              onChange={handleChange}
            />
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

        <Button variant="primary" type="button" onClick={addCrystalBall}>
          Create Match
        </Button>
      </Form>
    </div>
  )
}

export default CrystalBallCreator;