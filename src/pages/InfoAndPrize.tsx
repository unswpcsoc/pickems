import fullBanner from "../assets/InfoPage/full_banner.png";
import teams from "../assets/InfoPage/teams.png";

const InfoAndPrize = () => {
  return (
    <div style={{ width: '95vw', margin: 'auto' }}>
      <br />
      <div>
        <img src={fullBanner} style={{width:"95vw", height:"auto"}}></img>
        <h1>How the Tournament Works</h1>
        <p>
        The Oceanic Prodigies: Valorant tournament is a celebration of university esports, where teams from universities across Australia compete for glory. Hosted in the Tyree Technology Building (TETB) at UNSW Kensington, the event spans two days, 22nd-23rd of February 2025. Matches are played in a knockout format, with the best teams advancing toward the Grand Finals. Attendees can enjoy live-action gameplay, interact with fellow fans, and witness the ultimate clash of skills.
        </p>
        <p>Tournament Formats and Rules</p>
        <ul>
          <li>The tournament follows a knockout format, with teams battling it out in a best-of-1 series for each round.</li>
          <li>The Grand Finals will be played as a best-of-3 series.</li>
        </ul>
        <br/>
        <h1>What are pickems?</h1>
        <p>
        Pickems allow fans to engage with the tournament by predicting the outcomes of each match. Select the team you think will win, earn points for correct guesses, and climb the leaderboard! The top scorers by the end of the Grand Finals will receive exciting prizes. Whether you're a casual viewer or a hardcore esports fan, Pickems add an extra layer of excitement to the tournament.
        </p>
      </div>

      <div>
      <br/><br/>
        <img src={teams} style={{width:"95vw", height:"auto"}}></img>
        <h1>The teams</h1>
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
        <br/><br/>
        <h1>What are the prizes?</h1>

        <p>
          The tournament offers both in-person and online rewards:
        </p>

        <ul>
          <li>1st Place (In-Person): 1 Gigabyte GS27QC 27" 1440p Gaming Monitor</li>
          <li>1st Place (Remote): 1 Aorus Jacket</li>
          <li>2nd to 4th Place: RGB Mouse Pads</li>
          <li>5th to 16th Place: Aorus Chibi Statue</li>
        </ul>

        <p>Gear up and participate to win these amazing prizes, and don’t miss your chance to show your support for your favorite team!</p>
      </div>
    </div>
  );
};

export default InfoAndPrize;
