import fullBanner from "../assets/InfoPage/full_banner.png";
import teams from "../assets/InfoPage/teams.png";
import monitor from "../assets/InfoPage/monitor.jpg";
import brackets from "../assets/InfoPage/brackets.jpg";

const InfoAndPrize = () => {
  return (
    <div style={{ maxWidth: '900px', width:"100%", margin: 'auto' }}>
      <br />
      <div>
        <img src={fullBanner} style={{ maxWidth: '900px', width:"100%", height:"auto"}}></img>
        <h1>How the Tournament Works</h1>
        <p>
        The Oceanic Prodigies: Valorant tournament is a celebration of university esports, where teams from universities across Australia compete for glory. Hosted in the Tyree Technology Building (TETB) at UNSW Kensington, the event spans two days, 22nd-23rd of February 2025. Matches are played in a knockout format, with the best teams advancing toward the Grand Finals. Attendees can enjoy live-action gameplay, interact with fellow fans, and witness the ultimate clash of skills.
        </p>

        <h1>Tournament Formats and Rules</h1>
        <p>The tournament follows a double-elimination format, with teams battling it out in a best-of-1 series for each round. </p>
        <img src={brackets} style={{ maxWidth: '900px', width:"100%", height:"auto"}}></img>
        
        <br/> <br/>
        <h1>What are Pickems?</h1>
        <p>
        Pickems allow fans to engage with the tournament by predicting the outcomes of each match. Select the team you think will win, earn points for correct guesses, and climb the leaderboard! The top scorers by the end of the Grand Finals will receive exciting prizes. Whether you're a casual viewer or a hardcore esports fan, Pickems add an extra layer of excitement to the tournament.
        </p>
      </div>

      <div>
      <br/>
        <h1>The Teams</h1>
        <img src={teams} style={{ maxWidth: '900px', width:"100%", height:"auto"}}></img>
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
        <img src={monitor} style={{ maxWidth: '900px', width:"100%", height:"auto"}}></img>
        <p>
          The tournament offers both in-person and online rewards:
        </p>

        <ul>
          <li>1st Place (In-Person): 1 GS27QCA 27" 1440p 180hz Curved IPS Gaming Monitor</li>
          <li>1st Place (Remote): 1 Aorus Jacket</li>
          <li>2nd to 4th Place: Aorus RGB Mousemat</li>
          <li>5th to 16th Place: Aorus Chibi Figurine</li>
        </ul>

        <p>Prizes will be awarded based on the final leaderboard standings. The top scorers will receive their rewards at the event, while remote participants will have their prizes given to them at a later date.</p>
        <p>Note: To be prize eligible you must have your discord ID on your account (Go the the user page to add or change it if necessary)</p>
      </div>
    </div>
  );
};

export default InfoAndPrize;
