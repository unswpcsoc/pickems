// src/components/Pickem.tsx
import { useState, useEffect } from 'react';
import { auth, db } from "../../firebase/index";
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Button } from "react-bootstrap";
import DiscordAlert from "../../components/DiscordAlert/DiscordAlert";
import { CrystalBallEntry } from '../../defines';
import CrystalBallSelector from '../../components/CrystalBallSelector/CrystalBallSelector';
import "./PickemCrystalBall.css";

const PickemCrystalBall = () => {
  const [userDiscordId, setDiscordId] = useState<string | null>(null);

  const [userScore, setUserScore] = useState<number>(0)
  const [categories, setCategories] = useState<Map<string, { name: string, items: Map<string, {img: string, name: string}> }>>(new Map());
  const [crystalBallPickems, setCrystalBallPickems] = useState<Map<string, CrystalBallEntry>>(new Map());
  const [userCrystalBall, setUserCrystalBall] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const unsubscribeUserPicks = onSnapshot(doc(db, 'users', (auth.currentUser as User).uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const crystalBall = (docSnapshot.data().crystalBall === null) ? {} : docSnapshot.data().crystalBall;
        setUserCrystalBall(crystalBall);
        setUserScore(docSnapshot.data().score);

        const discordId = docSnapshot.data().discordName;
        discordId === "" ? setDiscordId(null) : setDiscordId(discordId);
      }
    });

    const fetchCategories = onSnapshot(doc(db, "crystalBall", "categories"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const categoryData = docSnapshot.data();
        const categories =  new Map<string, { name: string, items: Map<string, {img: string, name: string}>}>();
        
        Object.keys(categoryData).forEach((id) => {
          const rawItems = categoryData[id].items || {};
          const itemsMap = new Map<string, { img: string; name: string }>(
            Object.entries(rawItems)
          );

          categories.set(id, {
            name: categoryData[id].name, 
            items: itemsMap
          })
        })

        setCategories(categories);
      }
    }, (error) => {
      console.error("Error fetching categories: ", error);
    });

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

        const sortedPick = new Map<string, CrystalBallEntry>(
          [...crystalBallPicks.entries()].sort(([,a],[,b]) =>
          a.title.localeCompare(b.title))
        );

        setCrystalBallPickems(sortedPick);
      }
    }, (error) => {
      console.error("Error fetching categories: ", error);
    });

    return () => {
      unsubscribeUserPicks();
      fetchCategories();
      fetchCrystalBall();
      // console.log("refreshing and rereading db!")
    };
  }, [db]);

  return (
    <div style={{ width: "100vw", margin: "auto" }} className="text-colour">
      <DiscordAlert discordId={userDiscordId} />
      <br/>

      <div className="flex-container" style={{ display: "flex", alignItems: "baseline", marginLeft: "10vw", marginRight: "10vw"}}>
        <div style={{textAlign: "left", flex: "1 1 0px", width:"0"}}>
          <a href="/pickems"><h2 className="flex-div-text">Back to Menu</h2></a>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "right", alignItems: "center", flex: "1 1 0px", width:"0"}}>
          <a className="flex-div-text"  href="/leaderboard" rel="noopener noreferrer">Leaderboard</a>
          <div><Button variant="info" size="lg" active disabled>Points: {userScore}</Button></div>
        </div>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}><h2>Crystal Ball Pickems</h2></div>

      <div style={{ marginLeft: "10vw", marginRight: "10vw" }}>
        <CrystalBallSelector categories={categories} crystalBallPickems={crystalBallPickems} userCrystalBall={userCrystalBall}/> 
      </div>
    </div>
  );
};

export default PickemCrystalBall;
