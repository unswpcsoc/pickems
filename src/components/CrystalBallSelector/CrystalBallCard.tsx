import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import defaultImage from "../../assets/pickem/OP2_ban.jpg"; // Correct image path
import { Card, Dropdown, Form } from 'react-bootstrap';
import { auth, db } from '../../firebase';
import { User } from 'firebase/auth';

import { doc, updateDoc } from "firebase/firestore";

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
    <Card style={{ maxWidth: "286px", maxHeight:"360px" }}>
    <div style={{display: "flex", justifyContent: "center"}}>
        <Card.Img style={{ paddingTop: "10px", paddingBottom: "10px", marginLeft:"auto", marginRight:"auto", width: "auto", maxHeight: "200px" }} variant="top" src={crystalBallPickem.img || defaultImage} />
    </div>
    <Card.Body>
        <Card.Title style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >{crystalBallPickem.title}</Card.Title>
        <Dropdown style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Dropdown.Toggle as={CustomToggle} id={`dropdown-custom-${pickemId}`} >
            {userCrystalBall[pickemId] !== null && userCrystalBall[pickemId] !== undefined ? (categoryItems.get(userCrystalBall[pickemId])?.name) : "Select Pick"}
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
        {Array.from(categoryItems.entries()).map(([itemId, categoryData]) => (
            <Dropdown.Item
            key={itemId}
            onClick={() => updatePickem(pickemId, itemId)}
            >
            {categoryData.name}
            </Dropdown.Item>
        ))}
        </Dropdown.Menu>
    </Dropdown>

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
