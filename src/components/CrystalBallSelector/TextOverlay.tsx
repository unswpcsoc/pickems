import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import defaultImage from "../../assets/pickem/OP2_basic.png"; // Correct image path
import { Card, Dropdown, Form } from 'react-bootstrap';
import { auth, db } from '../../firebase';
import { User } from 'firebase/auth';

import { doc, updateDoc } from "firebase/firestore";
import CrystalBallResult from './CrystalBallResult';

/**
 * Method that displays text at bottom of image
 */

interface TextOverlayProps {
  img: string;
  text: string;
  textBool: boolean;
}

const TextOverlay = ({img, text, textBool}: TextOverlayProps) => {
  return (
    <div style={{ position: "relative", textAlign: "center" }}>
        <img style={{ marginLeft:"auto", marginRight:"auto", width: "auto", maxWidth: "270px", maxHeight: "auto", objectFit: "contain" }} src={img || defaultImage}></img>
        {textBool === true ? (
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", backgroundColor: "grey", opacity: 0.8, color: "white", fontSize: "24px"}}>Pick: {text}</div>
        ) : (
            <></>
        )}
        
    </div>
    );
};

export default TextOverlay;
