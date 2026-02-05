import { useState, useEffect } from 'react';
import { auth, db } from "../../../firebase/index";
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { PickemComponent } from '../..'; // Import the PickemBar component
import { Button, Dropdown, ButtonGroup } from "react-bootstrap";
import DiscordAlert from "../../DiscordAlert/DiscordAlert";
import InPersonAlert from "../../InPersonAlert/InPersonAlert";
// import CategoryCard from "./CrystalBallEditorCard"
import CrystalBallEditorCard from './CrystalBallEditorCard';


type DisplayProp = {
  categories: Map<string, { 
    name: string, 
    items: Map<string, {img: string, name: string}> }>;
};

const CrystalBallEditor = ({ categories }: DisplayProp) => {
    const [crystalBallPickems, setCrystalBallPickems] = useState<Map<string, {category: string, closeTime: any, img: string, points: string, title: string, winner: string, type: string}>>(new Map());

      useEffect(() => {
        const fetchCrystalBall = onSnapshot(doc(db, "crystalBall", "pickems"), (docSnapshot) => {
          if (docSnapshot.exists()) {
            const pickData = docSnapshot.data();
            const crystalBallPicks =  new Map<string, {category: string, closeTime: any, img: string, points: string, title: string, winner: string, type: string}>;
            
            Object.keys(pickData).forEach((id) => {
              crystalBallPicks.set(id, {
                category: pickData[id].category,
                closeTime: pickData[id].closeTime,
                img: pickData[id].img,
                points: pickData[id].points,
                title: pickData[id].title,
                winner: pickData[id].winner,
                type: pickData[id].type
              })
            })
    
            setCrystalBallPickems(crystalBallPicks);
          }
        }, (error) => {
          console.error("Error fetching categories: ", error);
        });
    
        return () => {
          fetchCrystalBall();
        };
      }, [db]);
    // console.log(crystalBallPickems)
    return (
        <div
        style={{
            display: 'flex',
            flexWrap: 'wrap', // Cards wrap to next row when no more space in the row
            gap: '20px',
            justifyContent: 'flex-start', // Aligns cards to the left
        }}
        >
        {Array.from(crystalBallPickems.entries())
        .sort(([idA, cbA], [idB, cbB]) => cbA.title.localeCompare(cbB.title))
        .map(([id, crystalBall]) => (
          <div
          style={{
              flex: '0 0 286px', // Fixed box width
              boxSizing: 'border-box',
          }}
          >
          {/* REMEMBER TO ADD IN THE IMAGE PATH IN SECOND */}
          <CrystalBallEditorCard 
              pickemId={id} 
              crystalBall={crystalBall} 
              category={categories} 
            key={id}
          />
          </div>
        ))}
        </div>
    );
}

export default CrystalBallEditor;