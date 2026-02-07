import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Button } from "react-bootstrap";
import "./Home.css";

// Legacy
// import oceanProdigies from "../assets/HomePage/oceanProdigiesWide.jpg";
import megalan from "../../assets/HomePage/megalanArmageddon.png";
import oceanicProdigies from "../../assets/HomePage/OP2.png";
// const oceanProdigies = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Fhome-page%2FOP2_banner(1).jpg?alt=media&token=3382b12d-92af-4d09-a1d6-dadd7685bb48";
// add more photos for carousel if needed
// const megalan = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Fhome-page%2FmegalanWide-min.jpg?alt=media&token=0d27118f-b9a0-43fb-a977-2fc617d4c583";

const HomePage = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // const ranking = [{name: "T1", points: 50},{name: "T2", points: 49},{name: "T3", points: 48},{name: "T4", points: 47},{name: "T5", points: 45},{name: "T6", points: 40},{name: "T7", points: 39}];
  const ranking = [];

  return (
    <div style={{ maxWidth: '85vw', margin: 'auto' }}>
      <br />

      {/* Carousel with smaller image and borders on left and right */}
      <Carousel activeIndex={index} variant="light" indicators={true} onSelect={handleSelect} style={{ maxHeight: "600px", overflow: "hidden" }}>
        <Carousel.Item>
          <div style={{
            width: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "black",
            padding: "0 10%"
          }}>
            <a href="https://events.humanitix.com/megalan" target="_blank" rel="noopener noreferrer"><img
              src={megalan} 
              alt="first slide" 
              style={{ 
                width: "100%",
                height: "100%", 
                maxHeight: "600px",
                objectFit: "contain",
                objectPosition: "center"
              }}
            /></a>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "black", 
            padding: "0 10%"
          }}>
            <a href="/InfoAndPrize"><img
              src={oceanicProdigies} 
              alt="second slide" 
              style={{ 
                width: "100%",
                height: "100%", 
                maxHeight: "600px",
                objectFit: "contain",
                objectPosition: "center"
              }}
            /></a>
          </div>
        </Carousel.Item>
      </Carousel>

      <br/><br/>

      {/* Flex container for Twitch + right div */}
      <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: 'center', gap: '24px' }}>
        
        {/* Left side: Twitch embedded */}
        <div
          style={{
            position: 'relative',
            width: '65%', 
            minWidth: '300px',
            paddingBottom: '36.75%', 
            height: 0,
            overflow: 'hidden',
          }}
        >
          <iframe
            src="https://player.twitch.tv/?channel=unswpcsoc&parent=localhost&parent=alexgao.au&parent=pickems.oceanicprodigies.com&parent=pickems.megalan.com.au"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              minWidth: '340px',
              height: '100%',
              minHeight:'400px',
            }}
            title="PCSoc Stream"
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </div>

        {/* Right side: General info / Standings*/}
        <div style={{ flex: 1, padding: '16px' }} className={"secondary-colour"}>
          {/* Show ranking only when we have a match */}
          {ranking.length === 0 ? (
            <></>
          ) : (
            <>
            <h2>Tournament Standing</h2>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team Name</th>
                  <th>Points</th>
                </tr>
              </thead>
                {ranking.map((value, index) => (
                  <tr className={`rank-${index+1}`} style={{borderWidth: "1px"}}>
                      <td className="rank" style={{borderWidth: "1px"}}>{index+1}</td>
                      <td className="user">
                          {/* <img src="https://placehold.co/45?text=AV" alt="Avatar" className="avatar"/> */}
                          <span className="username">{value.name}</span>
                      </td>
                      <td className="points" style={{borderWidth: "1px"}}>{value.points}</td>
                  </tr>
                ))}
              <tbody>
                {/* For each rank just display team */}
              </tbody>
            </table>
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
