// Purpose: Display the TeamBuilder component which allows users to create teams

import { useState } from 'react';
import { Firestore } from "firebase/firestore";
import { addCategoryToDatabase } from "../../firebase/database"; 

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type UserPanelProps = {
  db: Firestore; 
};

const CategoryCreator = ({ db }: UserPanelProps) => {
  // States for forms/input when making teams and matches
  const [categoryName, setCategoryName] = useState<string>('');

  const addCategory = async () => {
    const success = await addCategoryToDatabase(db, categoryName);
    if (success) {
      setCategoryName('');
    }
  };

  return (
    <div>
      <Form>
        <h3>Create a Category</h3>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Category Name (e.g. Champions/Dragons/Objectives/Teams)"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="button" onClick={addCategory}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default CategoryCreator;