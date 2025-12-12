import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import defaultImage from "../../assets/pickem/OP2_ban.jpg"; // Correct image path
import { Card, Dropdown, Form } from 'react-bootstrap';
import { auth, db } from '../../firebase';
import { User } from 'firebase/auth';

import { doc, updateDoc } from "firebase/firestore";
import CrystalBallResult from './CrystalBallResult';

/**
 * Method that displays all the crystal ball pickems
 */

interface PickemCardProps {  
    pickemId: string;
    crystalBallPickem: {category: string, closeTime: any, img: string, points: string, title: string, winner: string, type: string}
    categoryItems: Map<string, { img: string, name: string }>;
    userCrystalBall: { [key: string]: string };
}

const CrystalBallCard = ({ pickemId, crystalBallPickem, categoryItems, userCrystalBall }: PickemCardProps) => {
  if (userCrystalBall === undefined || userCrystalBall === null) {
    userCrystalBall = {["a"]:"a"};
  }
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default behavior (page reload)

    await updatePickem(pickemId, inputValue);
  };

  const updatePickem = async (crystalBallId: string, itemId: string) => {
      try {
        // Update the selected state
        console.log("Match:", crystalBallPickem);
        if (!crystalBallPickem || crystalBallPickem.closeTime.seconds < Date.now() / 1000) {
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

  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }: any, ref: any) => {
      const [value, setValue] = useState('');

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <Form.Control
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child: any) =>
                !value || child.props.children.toLowerCase().startsWith(value.toLowerCase())
            )}
          </ul>
        </div>
      );
    }
  );
  return (
    <Card style={{ maxWidth: "286px", maxHeight:"480px", position: "relative", overflow: "visible" }} data-bs-theme="light">
    <div style={{display: "flex", justifyContent: "center"}}>
        <Card.Img style={{ paddingTop: "10px", paddingBottom: "10px", marginLeft:"auto", marginRight:"auto", width: "auto", maxWidth:"20vw", maxHeight: "200px" }} variant="top" src={crystalBallPickem.img || defaultImage} />
    </div>
    {crystalBallPickem.category === "Numeric" ? (
      <p style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom:"0px"}}>{userCrystalBall[pickemId] !== null && userCrystalBall[pickemId] !== undefined ? (`Pick: ${userCrystalBall[pickemId]}`) : ""}{}</p>
      ) : (
      <p style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom:"0px"}}>{userCrystalBall[pickemId] !== null && userCrystalBall[pickemId] !== undefined ? (`Pick: ${categoryItems.get(userCrystalBall[pickemId])?.name}`) : ""}{}</p>
      )}

    {/* Answer: Remove on later iterations */}
    <p style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom:"0px"}}><strong>Answer: {crystalBallPickem.winner}</strong></p>

    <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Card.Title style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',textAlign:"center", width: '100%' }} >{crystalBallPickem.title}</Card.Title>
        {crystalBallPickem.closeTime.seconds < Date.now() / 1000 ? (
          // Display points instead of button if we have answers submitted
          crystalBallPickem.winner !== "" ? (
            <CrystalBallResult pick={crystalBallPickem.winner === userCrystalBall[pickemId]} points={crystalBallPickem.points} />
          ) : (
            <Button variant="primary" type="submit" disabled style={{ alignSelf: 'center' }}>
              Pickems Closed
            </Button>
          )

        ) : crystalBallPickem.category === "Numeric" ? (
          <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {/* <Form.Label>Email address</Form.Label> */}
              <Form.Control 
                type="text"
                placeholder="Enter number (0, 1, 2, ...)"
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        ) : (
          <Dropdown
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              width: '100%', 
              position: 'relative', // Add relative positioning to the Dropdown
              zIndex: 1050, // Ensure it appears above other elements
            }}
          >
            <Dropdown.Toggle as={CustomToggle} id={`dropdown-custom-${pickemId}`}>
              {userCrystalBall[pickemId] !== null && userCrystalBall[pickemId] !== undefined ? "Change Pick" : "Select Pick"}
            </Dropdown.Toggle>

            <Dropdown.Menu
              as={CustomMenu}
              renderOnMount
              align={{ sm: 'start' }}
              style={{
                zIndex: 50, // Make sure the dropdown has a higher z-index than the card
                top: '100%', // Position below the button
                overflowX: "visible", // Make sure the menu doesn't get clipped
              }}
              container="body"
            >
              {Array.from(categoryItems.entries()).map(([itemId, categoryData]) => (
                <Dropdown.Item
                  key={itemId}
                  className="dropdown-menu-custom"
                  onClick={() => updatePickem(pickemId, itemId)}
                >
                  {categoryData.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

        )}

    {/* <Button
        className={classNames("crystal-ball-button")}
        variant="light"
        style={{ marginTop: "10px" }}
    >
        <div className="crystal-ball-points">{crystalBallPickem.points} Points</div>
    </Button> */}
    </Card.Body>
    </Card>
    );
};

export default CrystalBallCard;
