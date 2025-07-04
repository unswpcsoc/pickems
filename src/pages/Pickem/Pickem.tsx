// src/components/Pickem.tsx
import { useState, useEffect } from 'react';
import { auth, db } from "../../firebase/index";
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { PickemComponent } from '../../components'; // Import the PickemBar component
import { Button, Dropdown, ButtonGroup } from "react-bootstrap";
import DiscordAlert from "../../components/DiscordAlert/DiscordAlert";
import InPersonAlert from "../../components/InPersonAlert/InPersonAlert";


import './pickem.css';
import CrystalBallSelector from '../../components/CrystalBallSelector/CrystalBallSelector';

function isOpen(match: any) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}

const Pickem = () => {
  const [activeMatches, setActiveMatches] = useState<
    { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean, winner: string, votes: {team1Vote: number, totalVote: number} }[]
  >([]);
  const [userScore, setUserScore] = useState<number>(0)
  const [userPicks, setUserPicks] = useState<{ [key: number]: string }>({});
  const [teams, setTeams] = useState<{[key: string]: { name: string, colour: string, teamLogo: string }}>({});
  const [userDiscordId, setDiscordId] = useState<string | null>(null);
  const [userInPerson, setInPerson] = useState<boolean | null>(null);

  const [categories, setCategories] = useState<Map<string, { name: string, items: Map<string, {img: string, name: string}> }>>(new Map());
  const [crystalBallPickems, setCrystalBallPickems] = useState<Map<string, {category: string, closeTime: any, img: string, points: string, title: string, winner: string, type: string}>>(new Map());
  const [userCrystalBall, setUserCrystalBall] = useState<{ [key: string]: string }>({});

  const [pickemType, setPickemType] = useState<string>('Select Pickems'); // State to manage the selected pickem type

  useEffect(() => {
    const matchesDocRef = doc(db, 'matches', 'matchData');
    const unsubscribeActiveMatches = onSnapshot(matchesDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const matchesData = docSnapshot.data();
        
        let matchList = Object.keys(matchesData).map((id) => ({
          matchId: matchesData[id].matchId,
          team1Id: matchesData[id].team1Id,
          team2Id: matchesData[id].team2Id,
          category: matchesData[id].category,
          points: matchesData[id].points,
          closeTime: matchesData[id].closeTime,
          open: matchesData[id].open,
          winner: matchesData[id].winner,
          votes: (matchesData[id].votes === undefined ? {team1Vote: 0, totalVote: 0} : matchesData[id].votes)
        }));

        matchList = matchList.sort((a, b) => a.matchId - b.matchId);
        matchList = matchList.sort((a, b) => a.closeTime.seconds - b.closeTime.seconds);
        // matchList = matchList.filter(isOpen);

        setActiveMatches(matchList);
      }
    }, (error) => {
      console.error("Error listening to matches: ", error);
    });

    const unsubscribeUserPicks = onSnapshot(doc(db, 'users', (auth.currentUser as User).uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const picks = docSnapshot.data().picks;
        const crystalBall = (docSnapshot.data().crystalBall === null) ? {} : docSnapshot.data().crystalBall;
        setUserPicks(picks);
        setUserScore(docSnapshot.data().score);
        setUserCrystalBall(crystalBall);

        const discordId = docSnapshot.data().discordName;
        discordId === "" ? setDiscordId(null) : setDiscordId(discordId);

        const inPerson = docSnapshot.data().inPerson;
        inPerson === "" ? setInPerson(null) : setInPerson(inPerson);
      }
    });

    const unsubscribeTeams = onSnapshot(doc(db, 'teams', "teamData"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const teamsData = docSnapshot.data();
        // console.log(teamsData)

        const teamList = Object.keys(teamsData).reduce((acc, id) => {
          acc[id] = {
            name: teamsData[id].name,
            colour: teamsData[id].teamColour,
            teamLogo: teamsData[id].teamLogo,
          };
          return acc;
        }, {});

        setTeams(teamList);
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
      unsubscribeActiveMatches();
      unsubscribeUserPicks();
      unsubscribeTeams();
      fetchCategories();
      fetchCrystalBall();

      console.log("refreshing and rereading db!")
    };
  }, [db]);

  const handlePick = async (matchId: number, teamId: string) => {
    const match = activeMatches.find((m) => m.matchId === matchId);
    if (!match || !isOpen(match)) {
      return;
    } else {
      const updatedPicks = { ...userPicks, [matchId]: teamId };
      const userDocRef = doc(db, 'users', (auth.currentUser as User).uid);
      await updateDoc(userDocRef, {
        picks: updatedPicks,
      });
      setUserPicks(updatedPicks); // Optimistic UI update
    }
  };

  return (
    <div style={{ width: "100vw", margin: "auto" }}>
      <DiscordAlert discordId={userDiscordId} />
      <InPersonAlert attendanceStatus={userInPerson}/>
      <br/>

      <div className="flex-container">
        <div style={{textAlign: "left"}}>
          <h2>Pick'ems</h2>
        </div>
        <div style={{textAlign: "center"}}>
          <Dropdown as={ButtonGroup} size="lg">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {pickemType}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setPickemType("Crystal Ball")}>Crystal Ball</Dropdown.Item>
              <Dropdown.Item onClick={() => setPickemType("Bracket Stage")}>Bracket Stage</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div style={{ display: "flex", gap: "10px"}}>
          <a href="/InfoAndPrize" rel="noopener noreferrer">Info and Prizes</a>
          <div><Button variant="outline-info" size="lg" active disabled>Points: {userScore}</Button></div>
        </div>
      </div>

      {activeMatches.length === 0 ? (
        <p>No matches available. Come back later!</p>
      ) : pickemType === "Crystal Ball" ? (
        <CrystalBallSelector categories={categories} crystalBallPickems={crystalBallPickems} userCrystalBall={userCrystalBall}/> 
      ) : pickemType === "Bracket Stage" ? (
        activeMatches.map((match) => (
          <PickemComponent
            key={match.matchId}
            match={match}
            userPick={userPicks[match.matchId] || ''}
            teams={teams}
            handlePick={handlePick}
          />
        ))
      ) : (<></>)}
    </div>
  );
};

export default Pickem;
