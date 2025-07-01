import { useState } from 'react';
import { auth, db } from "../../firebase/index";

import { doc, updateDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import CategoryImageUpload from './CategoryImageUpload';

interface ChangeTeamNameProps {
  id: string
  category: {name: string, items: Map<string,string> };
}

const CategoryViewItems = ({ id, category }: ChangeTeamNameProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [show, setShow] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imageURL, setImageUrl] = useState<string>('');

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
      <Button variant="primary" onClick={handleShow}>Add Item</Button>

      <div style={{ width: "95vw", margin: "auto"}}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label htmlFor="basic-url">Item Name</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control id="teamName" aria-describedby="basic-addon3" onChange={(e) => setCategoryName(e.target.value)}/>
            </InputGroup>

            <CategoryImageUpload onFileUpload={setIsImageUploaded} setLogoUrl={setImageUrl} categoryName={category.name} />

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={editCategoryName} disabled={!isImageUploaded}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
};

export default CategoryAddItems;