import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CategoryData } from '../../../defines';

interface ChangeTeamNameProps {
  category: CategoryData;
}

const CategoryViewItems = ({ category }: ChangeTeamNameProps) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false)}
  const handleShow = () => setShow(true);

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