import { useState, useEffect } from 'react';
import { db } from "../../../firebase/index";
import { doc, onSnapshot } from 'firebase/firestore';
import CrystalBallEditorCard from './CrystalBallEditorCard';
import { CategoryData, CrystalBallEntry } from '../../../defines';


type DisplayProp = {
  categories: Map<string, CategoryData>;
};

const CrystalBallEditor = ({ categories }: DisplayProp) => {
    const [crystalBallPickems, setCrystalBallPickems] = useState<Map<string, CrystalBallEntry>>(new Map());

      useEffect(() => {
        const fetchCrystalBall = onSnapshot(doc(db, "crystalBall", "pickems"), (docSnapshot) => {
          if (docSnapshot.exists()) {
            const pickData = docSnapshot.data();
            const crystalBallPicks =  new Map<string, CrystalBallEntry>;
            
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