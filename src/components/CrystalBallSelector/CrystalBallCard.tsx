import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import defaultImage from "../../assets/pickem/OP2_ban.jpg"; // Correct image path
import { Card, Modal, Form, Button, InputGroup, ModalTitle } from 'react-bootstrap';
import { auth, db } from '../../firebase';
import { User } from 'firebase/auth';

import { doc, Timestamp, updateDoc } from "firebase/firestore";
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
  const [numericValue, setNumericValue] = useState(0);

  const [CBSelector, showCBSelector] = useState(false);
  const handleClose = () => showCBSelector(false);
  const handleShow = () => showCBSelector(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
      const { value } = e.target;
      
      const numValue = parseInt(value, 10);

      setNumericValue(numValue);
    };

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

  
  let winner = (crystalBallPickem.category === "Numeric") ? crystalBallPickem.winner : categoryItems.get(crystalBallPickem.winner)?.name;
  if (winner === undefined) {
    winner = "";
  }

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
        <>
          <Button variant="primary" onClick={handleShow}>Select</Button>
          <Modal
            size="xl"
            show={CBSelector}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Select your Crystal Ball Pick</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              
              {isNumeric ? (
                <>
                {/* Numeric */}
                <h3>Enter a number (e.g. 1, 2 , 3, ...) </h3>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter a number (0, 1, 2 , ...)"
                    aria-label="Enter a number for the pickems"
                    aria-describedby="basic-addon2"
                    value={numericValue.toString() === "NaN" ? "" : numericValue.toString()}
                    onChange={(e) => handleChange(e)}
                  />
                  <Button variant="primary" id="button-addon2" onClick={() => updatePickem(pickemId, numericValue.toString())}>
                    Submit
                  </Button>
                </InputGroup>
                </>
              ) : (
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "center",
                  maxHeight: "70vh",
                  overflowY: "auto",
                  alignItems: "stretch"
                }}>
                {/* Other: Display all category items  */}
                {Array.from(categoryItems.entries()).sort((a,b) => {
                  return a[1].name.localeCompare(b[1].name);
                }).map(([id, value]) => 
                <div style={{width: "400px", borderStyle:"solid", display:"flex", flexDirection: "row"}}>
                  <img src={value.img} style={{maxHeight:"90px", maxWidth:"150px"}}/>
                  <div style={{paddingLeft: "10px", display:"grid", justifyContent: "flex-end"}}>
                    <h1>{value.name}</h1>
                    <Button variant="primary" style={{width:"80px", height:"36px", textAlign: "center"}} onClick={() => updatePickem(pickemId, id)}>Select</Button>
                  </div>
                </div>
                )}
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
        ) : (
          crystalBallPickem.winner === "" ? (
            // Check if results a submitted to display point changes! (TODO)
            <Button variant="primary" type="submit" disabled style={{ alignSelf: 'center', bottom: 0 }}>
              Pickems Closed
            </Button>
          ) : (
            <>
              <Button variant="primary" type="submit" disabled style={{ alignSelf: 'center', bottom: 0 }}>
                Answer: {winner}
              </Button>

              {crystalBallPickem.category === "Numeric" ? (
                <CrystalBallResult winnerId={crystalBallPickem.winner} winner={winner} points={crystalBallPickem.points} pick={userCrystalBall[pickemId]} />
              ) : (
                <CrystalBallResult winnerId={crystalBallPickem.winner} winner={winner} points={crystalBallPickem.points} pick={userCrystalBall[pickemId]} />
              )}
            </>
          )
      )}
    </Card.Body>
    </Card>
    );
};

export default CrystalBallCard;
