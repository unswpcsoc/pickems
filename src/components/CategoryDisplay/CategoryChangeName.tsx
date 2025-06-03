import { useState } from 'react';
import { auth, db } from "../../firebase/index";

import { doc, updateDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

interface ChangeTeamNameProps {
  id: string
  category: {name: string, items: Map<string,string> };
}

const CategoryChangeName = ({ id, category }: ChangeTeamNameProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false)}
  const handleShow = () => setShow(true);

  const editCategoryName = async () => {
    if (categoryName == "" || auth.currentUser == null) {
      return;
    }

    try {
      const updatedCategoryData = {
        [id]: { ...category, name: categoryName }, 
      };
      await updateDoc(doc(db, "crystalBall", "categories"), updatedCategoryData);
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
            <Modal.Title>Change Category Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label htmlFor="basic-url">New Category Name</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control id="teamName" aria-describedby="basic-addon3" onChange={(e) => setCategoryName(e.target.value)}/>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={editCategoryName}>
              Update Category Name
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
};

export default CategoryChangeName;