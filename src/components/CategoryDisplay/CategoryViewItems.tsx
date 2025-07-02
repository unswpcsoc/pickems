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
  category: {name: string, items: Map<string, {img: string, name: string}> };
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
      <Button variant="primary" onClick={handleShow}>View Item</Button>

      <div style={{ width: "95vw", margin: "auto"}}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>View Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Array.from(category.items.entries()).map(([id, item]) => (
              <>
                <img src={item.img}/>
                <p>{item.name}</p>
              </>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
};

export default CategoryViewItems;