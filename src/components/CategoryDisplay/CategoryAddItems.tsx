import { useState } from 'react';
import { auth, db } from "../../firebase/index";
import { v4 as uuidv4} from 'uuid';

import { doc, updateDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import CategoryImageUpload from './CategoryImageUpload';
import { mapToObject } from '../../utils';

interface ChangeTeamNameProps {
  id: string
  category: {name: string, items: Map<string, {img: string, name: string}> };
}

const CategoryAddItems = ({ id, category }: ChangeTeamNameProps) => {
  const [itemName, setItemName] = useState("");
  const [show, setShow] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleClose = () => {setShow(false)}
  const handleShow = () => setShow(true);

  const addItem = async () => {
    if (itemName == "" || auth.currentUser == null) {
      return;
    }

    try {
      const teamId = uuidv4();
      category.items[teamId] = {img: imageUrl, name: itemName};
      const updatedCategoryData = {
        [id]: { ...category, items: category.items }, 
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
              <Form.Control id="teamName" aria-describedby="basic-addon3" onChange={(e) => setItemName(e.target.value)}/>
            </InputGroup>

            <CategoryImageUpload onFileUpload={setIsImageUploaded} setLogoUrl={setImageUrl} categoryName={category.name} />

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={addItem} disabled={!isImageUploaded}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
};

export default CategoryAddItems;