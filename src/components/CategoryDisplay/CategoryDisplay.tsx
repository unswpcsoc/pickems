import { useState } from 'react';
import { TypesOfMatches } from "../../defines";
import { Firestore } from "firebase/firestore";
import { addMatchToDatabase } from "../../firebase/database";
import CategoryCard from "./CategoryCard"

type DisplayProp = {
  categories: Map<string, { 
    name: string, 
    items: Map<string, {img: string, name: string}> }>;
};

const CategoryDisplay = ({ categories }: DisplayProp) => {
    return (
        <div
        style={{
            display: 'flex',
            flexWrap: 'wrap', // Cards wrap to next row when no more space in the row
            gap: '20px',
            justifyContent: 'flex-start', // Aligns cards to the left
        }}
        >
        {Array.from(categories.entries()).map(([id, category]) => (
            <div
            style={{
                flex: '0 0 286px', // Fixed box width
                boxSizing: 'border-box',
            }}
            >
            {/* REMEMBER TO ADD IN THE IMAGE PATH IN SECOND */}
            {CategoryCard(id, category)} 
            </div>
        ))}
        </div>
    );
}

export default CategoryDisplay;