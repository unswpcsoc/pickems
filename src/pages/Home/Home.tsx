import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Button } from "react-bootstrap";
import "./Home.css"

// Credit to https://www.quackit.com/html/html_editors/scratchpad/?example=/html/templates/tables/leaderboard_ranking_table
// For their leaderboard

// Legacy
// import oceanProdigies from "../assets/HomePage/oceanProdigiesWide.jpg";
import megalan from "../../assets/HomePage/megalanArmageddon.png";
import oceanicProdigies from "../../assets/HomePage/OP2.png";
import { TournamentStanding } from '../../components';
import { TeamRanking } from '../../defines';
// const oceanProdigies = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Fhome-page%2FOP2_banner(1).jpg?alt=media&token=3382b12d-92af-4d09-a1d6-dadd7685bb48";
// add more photos for carousel if needed
// const megalan = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Fhome-page%2FmegalanWide-min.jpg?alt=media&token=0d27118f-b9a0-43fb-a977-2fc617d4c583";

const HomePage = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  // const ranking = [{name: "T1", points: 50},{name: "T2", points: 49},{name: "T3", points: 48},{name: "T4", points: 47},{name: "T5", points: 45},{name: "T6", points: 40},{name: "T7", points: 39}];
  const ranking: TeamRanking = [];

  return (
    <div className='home-body'>
      <br />

      {/* Carousel with smaller image and borders on left and right */}
      <Carousel activeIndex={index} variant="light" indicators={true} onSelect={handleSelect} className='carousel-container'>
        <Carousel.Item>
          <div className='carousel-item-div'>
            <a href="https://events.humanitix.com/megalan" target="_blank" rel="noopener noreferrer"><img
              src={megalan} 
              alt="first slide" 
              className='carousel-image'
            /></a>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className='carousel-item-div'>
            <a href="/InfoAndPrize"><img
              src={oceanicProdigies} 
              alt="second slide" 
              className='carousel-image'
            /></a>
          </div>
        </Carousel.Item>
      </Carousel>

      <br/><br/>

      {/* Flex container for Twitch + right div */}
      <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: 'center', gap: '24px' }}>
        
        {/* Left side: Twitch embedded */}
        <div className='twitch-player-container-home'>
          <iframe
            src="https://player.twitch.tv/?channel=unswpcsoc&parent=localhost&parent=alexgao.au&parent=pickems.oceanicprodigies.com&parent=pickems.megalan.com.au"
            className='twitch-player-iframe-home'
            title="PCSoc Stream"
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </div>

        {/* Right side: General info / Standings*/}
        <div className='info-container secondary-colour'>
          {/* Show ranking only when we have a match */}
          {ranking.length === 0 ? (
            <></>
          ) : (
            <>
            <h2>Tournament Standing</h2>
            <TournamentStanding ranking={ranking} />
            </>
          )}

          <br/>
          <h2>General Information</h2>
          <p>🎮 OCEANIC PRODIGIES - RE:BIRTH 🎮</p>
          <p>Prepare for RE:BIRTH, PCSoc's Esport tournament start for 2026! 🔥 Seven top-tier universities from across NSW and ACT will go head-to-head across four days of action-packed Valorant gameplay!</p>
          <b><p>Key Details:</p></b>
          
          <p>Group Stage</p>
          <ul>
            <li>📅 When: 21-22nd February 2026</li>
            <li>📍 Where: Tyree Energy Technologies Building UNSW, Kensington Campus, NSW</li>
          </ul>

          <p>Bracket Stage</p>
          <ul>
            <li>📅 When: 10th March 2026</li>
            <li>📍 Where: Roundhouse UNSW, Kensington Campus, NSW</li>
          </ul>

          <a href="https://www.oceanicprodigies.com"><Button className="bs-button">More Information</Button></a>
        </div>
      </div>
      <br/>

      {/* Style for Carousel Buttons */}
      <style>
        {`
          .carousel-control-next-icon,
          .carousel-control-prev-icon {
            color: white;
          }
        `}
      </style>

    </div>
  );
};

export default HomePage;
