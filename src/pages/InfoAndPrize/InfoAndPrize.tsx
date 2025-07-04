// Legacy images
// import fullBanner from "../assets/InfoPage/full_banner.png";
// import teams from "../assets/InfoPage/teams.png";
// import monitor from "../assets/InfoPage/monitor.jpg";
// import brackets from "../assets/InfoPage/brackets.jpg";

import { LazyLoadImage } from 'react-lazy-load-image-component';

const fullBanner = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Finfo-page%2FOP2_banner.jpg?alt=media&token=67db0976-6602-4fc9-908c-312e617e1c9d";
const teams = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Finfo-page%2FThe%20teams(1).png?alt=media&token=8d746656-ff32-4580-b99c-ebe5a04d5ecc";
const monitor = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Finfo-page%2Fmonitor.jpg?alt=media&token=a48ca0fe-85c2-4ca3-ba35-c5fbb0530641";
// const brackets = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Finfo-page%2FInterUni_Brackets_Day_1(1).png?alt=media&token=93f45612-51cb-4583-8535-6eaa347b0aad";

const InfoAndPrize = () => {
  return (
    <div style={{ maxWidth: '1400px', width:"100%", margin: 'auto' }} className='text-colour'>
      <br />
      <div>
        {/* <img src={fullBanner} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}></img> */}
        <LazyLoadImage  src={fullBanner} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}/>
        <h1>Event Overview</h1>
        <p>
          The Oceanic Prodigies: Valorant tournament is a celebration of university esports, where teams from universities across Australia compete for glory.
          Watch as 6 of the best university esports teams from across the country battle it out in Valorant for a $4,000 AUD cash prize pool and ultimate supremacy.
        </p>

        <h1>Event Details</h1>
        <ul>
          <li>Event Date: 9th–11th July 2025</li>
          <li>Where: The Roundhouse at UNSW Kensington Campus, Sydney, NSW</li>
          <li>Tickets: Free Spectator Admission – Come and watch the action live!</li>
        </ul>

        {/* <h1>Tournament Formats and Rules</h1>
        <p>The tournament follows a double-elimination format, with teams battling it out in a Best-of-One series for each round culminating in a Best-of-Three Grand Final. </p>
        {/* <img src={brackets} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}></img> */}
        {/* <LazyLoadImage  src={brackets} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}/>
        
        <br/> <br/>
        <h1>What are Pickems?</h1>
        <p>
        Pickems allow fans to engage with the tournament by predicting the outcomes of each match. Select the team you think will win, earn points for correct guesses, and climb the leaderboard! The top scorers by the end of the Grand Finals will receive exciting prizes. Whether you're a casual viewer or a hardcore esports fan, Pickems add an extra layer of excitement to the tournament.
        </p>
        <h2>How to Participate in Pickems</h2>
        <ol>
          <li><strong>Pick Your Winners:</strong> As the tournament unfolds, you’ll make predictions on who will claim the top spots in each match.</li>
          <li><strong>Rack Up Points:</strong> Correct picks will earn you points, and the more accurate your predictions, the higher your score.</li>
          <li><strong>Win Big:</strong> At the end of the tournament, the top pickers will be rewarded with prizes and exclusive goodies.</li>
        </ol> */}
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
          Oceanic Prodigies this time round is offering only in-person rewards:
        </p>

        <p>The In-person rewards are as followed:</p>

        <ul>
          <li>1st Place: 1 Gigabyte arous MO27US Monitor</li>
          <li>2nd to 20th place: Gigabyte Aorus X GXWS Studios Goodie Bag</li>
        </ul>

        <p>Prizes will be awarded based on the final leaderboard standings. The top scorers will receive their rewards at the event on the 11th of July at UNSW.</p>
        <p>To check and change your in-person status for the Pickems prizes, go to the user page and click the edit button to change it.</p>
        <p>To be prize eligible you must have your discord ID added to your account. (Go the the user page to add/change your Discord ID)</p>
        <p>Warning: If your discord ID or in person status is incorrect by the time prizes are distributed you will automatically forfeit any prizes you were about to win.</p>
      </div>
    </div>
  );
};

export default InfoAndPrize;
