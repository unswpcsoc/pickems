import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import defaultImage from "../../assets/pickem/OP2_ban.jpg"; // Correct image path
import { Card, Modal, Form, Button } from 'react-bootstrap';
import { auth, db } from '../../firebase';
import { User } from 'firebase/auth';

import { doc, updateDoc } from "firebase/firestore";
import CrystalBallResult from './CrystalBallResult';
import TextOverlay from './TextOverlay';

/**
 * Method that displays all the crystal ball pickems
 */

interface PickemCardProps {  
    pickemId: string;
    crystalBallPickem: {category: string, closeTime: any, img: string, points: string, title: string, winner: string, type: string}
    categoryItems: Map<string, { img: string, name: string }>;
    userCrystalBall: { [key: string]: string };
    isNumeric: Boolean;
}

const CrystalBallCard = ({ pickemId, crystalBallPickem, categoryItems, userCrystalBall, isNumeric }: PickemCardProps) => {
  if (userCrystalBall === undefined || userCrystalBall === null) {
    userCrystalBall = {["a"]:"a"};
  }
  const [inputValue, setInputValue] = useState<string>('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default behavior (page reload)

    await updatePickem(pickemId, inputValue);
  };

  const [CBSelector, showCBSelector] = useState(false);
  const handleClose = () => showCBSelector(false);
  const handleShow = () => showCBSelector(true);

  const updatePickem = async (crystalBallId: string, itemId: string) => {
      try {
        // Update the selected state
        console.log("Match:", crystalBallPickem);
        if (!crystalBallPickem || crystalBallPickem.closeTime.seconds < Date.now() / 1000) {
          handleClose();
          return;
        } else {
          const updatedPicks = { ...userCrystalBall, [crystalBallId]: itemId };
          const userDocRef = doc(db, 'users', (auth.currentUser as User).uid);
          await updateDoc(userDocRef, {
            crystalBall: updatedPicks,
          });
        }
  
      } catch (error) {
        console.error("Error updating selection:", error);
      }
      handleClose();
    };

  const CustomToggle = React.forwardRef(({ children, onClick }: any, ref: any) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children} &#x25bc;
    </a>
  ));

  return (
    <Card style={{ maxWidth: "286px", maxHeight:"480px", position: "relative", overflow: "visible" }} className=" text-colour primary-colour ">
    <div style={{display: "flex", justifyContent: "center", paddingTop: "10px"}}>
      {/* Check if pickems exist for text overlay */}
      {userCrystalBall[pickemId] !== undefined && userCrystalBall[pickemId] !== undefined ? (

        isNumeric === true ? (
          <TextOverlay img={crystalBallPickem.img} text={userCrystalBall[pickemId]} textBool={true}></TextOverlay>
        ) : (
          <TextOverlay img={crystalBallPickem.img} text={categoryItems.get(userCrystalBall[pickemId])?.name} textBool={true}></TextOverlay>
        )
      ) : (
        <TextOverlay img={crystalBallPickem.img} text={""} textBool={false}></TextOverlay>
      )}

    </div>

    <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Card.Title style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',textAlign:"center", width: '100%' }} >{crystalBallPickem.title}</Card.Title>
      <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',textAlign:"center", width: '100%' }} >Points: {crystalBallPickem.points}</Card.Body>

      {/* Box changes based on response type (numeric/everything else), time is up, or results */}

      {crystalBallPickem.closeTime.seconds > Date.now() / 1000 ? (
        crystalBallPickem.type === "numeric" ? (
          <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {/* <Form.Label>Email address</Form.Label> */}
              <Form.Control 
                type="text"
                placeholder="Enter a number"
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        ) : (
          // Make drop down (use pop up)
          <>
            <Button variant="primary" onClick={handleShow}>Select</Button>
            <Modal
              size="lg"
              show={CBSelector}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Select your Crystal Ball Pick</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "center",
                  maxHeight: "70vh",
                  overflowY: "auto"}}>
                {/* Search bar ??? (if we have time) */}
                {/* Display all category items  */}
                {Array.from(categoryItems.entries()).map(([id, value]) => 
                  <div style={{maxHeight:"120px", width: "32  0px", borderStyle:"solid", display:"flex"}}>
                    <img src={value.img} style={{maxHeight:"90px", maxWidth:"150px"}}/>
                    <div style={{paddingLeft: "10px", display:"grid"}}>
                      <h1>{value.name}</h1>
                      <Button variant="primary" style={{width:"80px"}} onClick={() => updatePickem(pickemId, id)}>Select</Button>
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )
      ) : (
        // Check if results a submitted to display point changes! (TODO)
        <Button variant="primary" type="submit" disabled style={{ alignSelf: 'center', bottom: 0 }}>
          Pickems Closed
        </Button>
      )}
    </Card.Body>
    </Card>
    );
};

export default CrystalBallCard;
