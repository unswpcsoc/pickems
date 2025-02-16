// Legacy images
// import fullBanner from "../assets/InfoPage/full_banner.png";
// import teams from "../assets/InfoPage/teams.png";
// import monitor from "../assets/InfoPage/monitor.jpg";
// import brackets from "../assets/InfoPage/brackets.jpg";

import { LazyLoadImage } from 'react-lazy-load-image-component';

const fullBanner = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Finfo-page%2Ffull_banner-min.jpg?alt=media&token=d9568a06-17da-45c2-a6ca-9db0f9cf1972";
const teams = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Finfo-page%2Fteams.png?alt=media&token=e673fb0c-392c-42e4-983a-6392c5bc4a75";
const monitor = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Finfo-page%2Fmonitor.jpg?alt=media&token=b2bffdf0-568a-430e-8e7d-4027edc8c3b1";
const brackets = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Finfo-page%2Fbrackets.jpg?alt=media&token=f97a94c8-a512-4868-8ff9-dc7855c0e349";

const InfoAndPrize = () => {
  return (
    <div style={{ maxWidth: '1400px', width:"100%", margin: 'auto' }}>
      <br />
      <div>
        {/* <img src={fullBanner} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}></img> */}
        <LazyLoadImage  src={fullBanner} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}/>
        <h1>How the Tournament Works</h1>
        <p>
        The Oceanic Prodigies: Valorant tournament is a celebration of university esports, where teams from universities across Australia compete for glory. Hosted in the Tyree Energy Technology Building (TETB) at UNSW Kensington, the event spans two days from the 22nd to the 23rd of February 2025 where 8 Universities battle it out to see who has the best Valorant team. Matches are played in a double elimination format, with the best teams advancing toward the Grand Finals. Attendees can enjoy live action-packed gameplay, interact with fellow fans, and witness the ultimate clash of skills.
        </p>

        <h1>Tournament Formats and Rules</h1>
        <p>The tournament follows a double-elimination format, with teams battling it out in a Best-of-One series for each round culminating in a Best-of-Three Grand Final. </p>
        {/* <img src={brackets} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}></img> */}
        <LazyLoadImage  src={brackets} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}/>
        
        <br/> <br/>
        <h1>What are Pickems?</h1>
        <p>
        Pickems allow fans to engage with the tournament by predicting the outcomes of each match. Select the team you think will win, earn points for correct guesses, and climb the leaderboard! The top scorers by the end of the Grand Finals will receive exciting prizes. Whether you're a casual viewer or a hardcore esports fan, Pickems add an extra layer of excitement to the tournament.
        </p>
      </div>

      <div>
      <br/>
        <h1>The Teams</h1>
        {/* <img src={teams} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}></img> */}
        <LazyLoadImage  src={teams} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}/>
        <p>
          The competition features talented players representing their universities:
        </p>
        <ul>
          <li>University of NSW: PCSoc</li>
          <li>University of Wollongong: Video-Game Society</li>
          <li>Western Sydney University: Alliance of Social Gamers</li>
          <li>University of Newcastle: Gaming and Anime Club</li>
          <li>University of Technology Sydney: UTS Esports</li>
          <li>Macquarie University: Macquarie Uni Gaming Society</li>
          <li>University of Sydney: Society of Gamers</li>
          <li>Australian National University: ANU Esports</li>
        </ul>
      </div>

      <div>
        <br/>
        <h1>What are the Prizes?</h1>
        {/* <img src={monitor} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}></img> */}
        <LazyLoadImage  src={monitor} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}/>
        <p>
          The pickems leaderboard offers both in person (Attending Megalan on Sunday) and online rewards:
        </p>

        <p>The in person rewards are as followed:</p>

        <ul>
          <li>1st Place: 1 GS27QCA 27" 1440p 180hz Curved IPS Gaming Monitor</li>
          <li>2nd to 4th Place: Aorus RGB Mousemat</li>
          <li>5th to 16th Place: Aorus Chibi Figurine</li>
        </ul>

        <p>The online rewards are as followed:</p>
        <ul>
          <li>1st Place: 1 Aorus Jacket</li>
        </ul>

        <p>Prizes will be awarded based on the final leaderboard standings. The top scorers will receive their rewards at the event, while the top remote participant will have their Aorus Jacket given to them at a later date (contact via Discord).</p>
        <p>To check and edit your in person status for Sunday go to the user page and click the edit button to change it.</p>
        <p>To be prize eligible for either leaderboards you must have your discord ID added to your account. (Go the the user page to add or change your Discord ID)</p>
        <p>Warning: If your discord ID or in person status is incorrect by the time prizes are distributed you will automatically forfeit any prizes you were about to win.</p>
      </div>
    </div>
  );
};

export default InfoAndPrize;
