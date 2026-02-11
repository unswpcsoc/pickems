// Legacy images
// import fullBanner from "../assets/InfoPage/full_banner.png";
// import teams from "../assets/InfoPage/teams.png";
// import monitor from "../assets/InfoPage/monitor.jpg";
// import brackets from "../assets/InfoPage/brackets.jpg";

import { LazyLoadImage } from 'react-lazy-load-image-component';

const valorantBrackets = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Fbrackets-page%2FValorant_Schedule.png?alt=media&token=b7aba56e-d5b9-49ff-a04a-7dddaa653135";
const leagueBrackets = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Fbrackets-page%2FLeagueSchedule.png?alt=media&token=001c7000-e49e-4001-a0ff-0972e4e2934a";
// https://www.iloveimg.com/download/8sAkvk9r9vb0r11x9pm93wAf73t7kfcsp9r5y8mpwxqAlAcp9fmq71fvny3kpfpzk3ldkclgk779pzbjjj0Ap0vg3k31t9lv8nnk0g8lr367msAn22s9j4Ac45232nj86gdx4tc81s9hlc833hbp2y9bd6gw1yhyrA2hy4tqmpq96fyr8bf1/10

// Not in use
const Brackets = () => {
  return (
    <div style={{ maxWidth: '1400px', width:"100%", margin: 'auto' }} className='text-colour'>
      <div>
        <br/><br/>
        {/* <img src={fullBanner} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}></img> */}
        <h1>Valorant Tournament Bracket and Schedule</h1>
        <p>Below is the tournament bracket for Oceanic Prodigies 2 - Valorant. Come back this over the tournament when the final bracket matches are determined!</p>
        <LazyLoadImage  src={valorantBrackets} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}/>
      </div>
      <br/><br/><br/><br/>
      <div>
        {/* <img src={fullBanner} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}></img> */}
        <h1>League of Legends Tournament Bracket and Schedule</h1>
        <p>Below is the tournament bracket for Oceanic Prodigies 2 - League of Legends. Come back this over the tournament when the final bracket matches are determined!</p>
        <LazyLoadImage  src={leagueBrackets} style={{ maxWidth: '1400px', width:"100%", height:"auto"}}/>
      </div>

      <br/><br/><br/>
    </div>
  );
};

export default Brackets;
