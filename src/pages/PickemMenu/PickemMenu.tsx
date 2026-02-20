// src/components/Pickem.tsx
import { useState, useEffect } from 'react';
import { auth, db } from "../../firebase/index";
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { TournamentStanding } from '../../components';
import { Button } from "react-bootstrap";
import DiscordAlert from "../../components/DiscordAlert/DiscordAlert";
import opStock from "../../assets/pickem/BG_2.png";

import './PickemMenu.css';
import { TeamRanking } from '../../defines';



const PickemMenu = () => {
  // const ranking: TeamRanking = [];
  const ranking = [{name: "UNSW PCSoc", points: 0},{name: "UTS Esports", points: 0},{name: "MQU Gaming", points: 0},{name: "WSU Esports", points: 0},{name: "USYD SOG", points: 0},{name: "UOW Esports", points: 0}];

  const [userScore, setUserScore] = useState<number>(0)
  const [userDiscordId, setDiscordId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeUserPicks = onSnapshot(doc(db, 'users', (auth.currentUser as User).uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserScore(docSnapshot.data().score);

        const discordId = docSnapshot.data().discordName;
        discordId === "" ? setDiscordId(null) : setDiscordId(discordId);
      }
    });

    return () => {
      unsubscribeUserPicks();
    };
  }, [db]);

  const handleClick = (myLink: string) => () => {
    window.location.href=myLink;
  }

  return (
    <div style={{ width: "100vw", margin: "auto" }} className="text-colour">
      <DiscordAlert discordId={userDiscordId} />
      <br/>

      <div className="flex-container" style={{ display: "flex", alignItems: "baseline", marginLeft: "10vw", marginRight: "10vw"}}>
        <div style={{textAlign: "left", flex: "1 1 0px", width:"0"}}>
          <h2 className="flex-div-text" >2026 Pickems</h2>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "right", alignItems: "center", flex: "1 1 0px", width:"0"}}>
          <a className="flex-div-text"  href="/leaderboard" rel="noopener noreferrer">Leaderboard</a>
          <div><Button variant="info" size="lg" active disabled>Points: {userScore}</Button></div>
        </div>
      </div>

      <div className="button-container" style={{ marginLeft: "10vw", marginRight: "10vw", display: 'flex', flexWrap: "wrap", justifyContent: 'center', gap: '24px', alignItems: "flex-start", marginBottom: "10vh" }}>
        {/* Add three buttons for crystal ball, swiss, bracket */}
        <div className="pickem-button-div">
          <div onClick={handleClick("/pickems/crystalball")} className='pick-button-container'>
            <img className='pick-button-image' src={opStock} />
            <div className='centred-text'>Crystal Ball</div>
            <div className='bottom-centred-text'>Open till 21st of February 10:30am</div>
          </div>
          <div onClick={handleClick("/pickems/swiss")} className='pick-button-container'>
            <img className='pick-button-image' src={opStock} />
            <div className='centred-text'>Round Robin Stage</div>
            <div className='bottom-centred-text'>All games are open, close at their respective match start time</div>
          </div>
          <div className='pick-button-container'>
            <img className='pick-button-image' src={opStock} />
            <div className='centred-text'>Bracket Stage</div>
            <div className='bottom-centred-text'>Opens after MEGALAN!! </div>
          </div>
        </div>

        {/* Add tournament standing to right */}
        <div style={{ minWidth: "250px", flex: 1, padding: '16px' }} className="secondary-colour standing-container">
          {/* Show ranking only when we have a match */}
          {ranking.length === 0 ? (
            <></>
          ) : (
            <>
            <h2>Tournament Standing (Swiss Stage)</h2>
            <TournamentStanding ranking={ranking} />
            </>
          )}
        </div>
      </div>

      {/* Prizes below all of it */}
      <div style={{ padding: '16px' , marginLeft: "10vw", marginRight: "10vw"}} className={"teriary_colour"}>
          <h2>Pickems Prizes</h2>
          <p>Prizes will be announced soon!</p>
      </div>

      {/* Stream */}
      <div style={{ padding: '16px' , marginLeft: "10vw", marginRight: "10vw"}} className={"teriary_colour"}>
        <h2>Watch the Stream!</h2>
        <div className='twitch-player-container' >
          <iframe
            src="https://player.twitch.tv/?channel=unswpcsoc&parent=localhost&parent=alexgao.au&parent=pickems.oceanicprodigies.com&parent=pickems.megalan.com.au"
            className='twitch-player-iframe'
            title="PCSoc Stream"
            frameBorder="0"
            allowFullScreen={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PickemMenu;
