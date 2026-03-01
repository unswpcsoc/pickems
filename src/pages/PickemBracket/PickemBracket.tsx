// src/components/Pickem.tsx
import { useState, useEffect } from 'react';
import { auth, db } from "../../firebase/index";
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { BracketComponent, PickemComponent } from '../../components'; // Import the PickemBar component
import { Button } from "react-bootstrap";
import DiscordAlert from "../../components/DiscordAlert/DiscordAlert";


import './PickemBracket.css';
import { BracketMatchData } from '../../defines';

function isOpen(match: any) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}

const PickemBracket = () => {
  const [activeMatches, setActiveMatches] = useState<BracketMatchData[]>([]);
  const [userScore, setUserScore] = useState<number>(0)
  const [userBracketPicks, setUserBracketPicks] = useState<{ [key: number]: string }>({});
  const [teams, setTeams] = useState<{[key: string]: { name: string, colour: string, teamLogo: string }}>({});
  const [userDiscordId, setDiscordId] = useState<string | null>(null);

  useEffect(() => {
    const matchesDocRef = doc(db, 'matches', 'bracketMatches');
    const unsubscribeActiveMatches = onSnapshot(matchesDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const matchesData = docSnapshot.data();
        
        let matchList: BracketMatchData[] = Object.keys(matchesData).map((id) => ({
          matchId: Number(id),
          points: matchesData[id].points,
          team1Id: matchesData[id].teamId1,
          team2Id: matchesData[id].teamId2,
          winner: matchesData[id].winner,
        }));
        setActiveMatches(matchList);
      }
    }, (error) => {
      console.error("Error listening to matches: ", error);
    });

    const unsubscribeUserPicks = onSnapshot(doc(db, 'users', (auth.currentUser as User).uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const picks = docSnapshot.data().bracketPickems || {};
        setUserBracketPicks(picks);
        setUserScore(docSnapshot.data().score);

        const discordId = docSnapshot.data().discordName;
        discordId === "" ? setDiscordId(null) : setDiscordId(discordId);
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

    return () => {
      unsubscribeActiveMatches();
      unsubscribeUserPicks();
      unsubscribeTeams();
    };
  }, [db]);

  console.log(activeMatches)
  return (
    <div style={{ width: "100vw", margin: "auto" }} className="text-colour">
      <DiscordAlert discordId={userDiscordId} />

      <div className="flex-container" style={{ display: "flex", alignItems: "baseline", marginLeft: "10vw", marginRight: "10vw"}}>
        <div style={{textAlign: "left", flex: "1 1 0px", width:"0"}}>
          <a href="/pickems"><h2 className="flex-div-text">Back to Menu</h2></a>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "right", alignItems: "center", flex: "1 1 0px", width:"0"}}>
          <a className="flex-div-text"  href="/leaderboard" rel="noopener noreferrer">Leaderboard</a>
          <div><Button variant="info" size="lg" active disabled>Points: {userScore}</Button></div>
        </div>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}><h2>Bracket Stage Pickems</h2></div>

      <div style={{ marginLeft: "10vw", marginRight: "10vw" }}>
        <BracketComponent teams={teams} matches={activeMatches} picks={userBracketPicks}/>
      </div>
    </div>
  );
};

export default PickemBracket;
