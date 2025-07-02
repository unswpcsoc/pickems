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
        setUserPicks(picks);
        setUserScore(docSnapshot.data().score);

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

    return () => {
      unsubscribeActiveMatches();
      unsubscribeUserPicks();
      unsubscribeTeams();
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
              Select Pickems
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={}>Crystal Ball</Dropdown.Item>
              <Dropdown.Item onClick={}>Bracket Stage</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div style={{ display: "flex", gap: "10px"}}>
          <a href="/InfoAndPrize" rel="noopener noreferrer">Info and Prizes</a>
          <div><Button variant="outline-info" size="lg" active disabled>Points: {userScore}</Button></div>
        </div>
      </div>

      {/* TODO: Make it so Crystal ball and Bracket matches appear after selection appropriate dropdown item */}
      {activeMatches.length === 0 ? (
        <p>No matches available. Come back later!</p>
      ) : (
        activeMatches.map((match) => (
          <PickemComponent
            key={match.matchId}
            match={match}
            userPick={userPicks[match.matchId] || ''}
            teams={teams}
            handlePick={handlePick}
          />
        ))
      )}
    </div>
  );
};

export default Pickem;
