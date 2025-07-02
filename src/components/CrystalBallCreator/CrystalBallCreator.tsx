import { useState } from 'react';
import { TypesOfMatches } from "../../defines";
import { Firestore } from "firebase/firestore";
import { addCrystalBallPickemToDatabase, addMatchToDatabase } from "../../firebase/database";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { db } from '../../firebase';

type UserPanelProps = {
  categories: Map<string, { 
    name: string, 
    items: Map<string, {
      img: string, 
      name: string
    }> 
  }>
};

const CrystalBallCreator = ({ categories }: UserPanelProps) => { 
  // States for forms/input when making teams and matches
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    points: '',
    closeTime: '',
  });

  // States for team and match display

  // Adding numeric pickems (pickems that dont rely on a category but a discrete numeric value)
  let operableCategories: Map<string, { name: string, items: Map<string, { img: string, name: string}>}> =
    categories;
  operableCategories.set("Numeric", {name: "numeric", items: new Map()});
  console.log(formData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
  const addCrystalBall = async () => {
    const success = await addCrystalBallPickemToDatabase(db, formData);
    if (success) {
      setFormData({
        category: '',
        title: '',
        points: '',
        closeTime: '',
      });
    } else {
      // Error 
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
                name="category"
                value={formData.category}
                onChange={(e) => handleChange(e)}
              >
                <option value="">Select Category</option>
                {Array.from(operableCategories.entries()).map(([id, category]) => (
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
              name="title"
              placeholder="Pickem Title (e.g. Most Kills, Most Deaths, etc.)"
              value={formData.title}
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