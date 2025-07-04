import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Button } from "react-bootstrap";

// Legacy
// import oceanProdigies from "../assets/HomePage/oceanProdigiesWide.jpg";
// import megalan from "../assets/HomePage/megalanWide.jpg";
const oceanProdigies = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Fhome-page%2FOP2_banner(1).jpg?alt=media&token=3382b12d-92af-4d09-a1d6-dadd7685bb48";
// add more photos for carousel if needed
// const megalan = "https://firebasestorage.googleapis.com/v0/b/pickems-2c806.firebasestorage.app/o/website-assets%2Fhome-page%2FmegalanWide-min.jpg?alt=media&token=0d27118f-b9a0-43fb-a977-2fc617d4c583";

const HomePage = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div style={{ maxWidth: '85vw', margin: 'auto' }}>
      <br />

      {/* Carousel with smaller image and borders on left and right */}
      <Carousel activeIndex={index} variant="light" indicators={true} onSelect={handleSelect} style={{ maxHeight: "600px", overflow: "hidden" }}>
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
              src={oceanProdigies} 
              alt="First slide" 
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
        {/* <Carousel.Item>
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
              alt="Second slide" 
              style={{ 
                width: "100%",
                height: "100%", 
                maxHeight: "600px",
                objectFit: "contain",
                objectPosition: "center"
              }}
            /></a>
          </div>

        </Carousel.Item> */}
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
            src="https://player.twitch.tv/?channel=unswpcsoc&parent=localhost&parent=alexgao.au&parent=pickems.unswpcsoc.com&parent=pickems.megalan.com.au"
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

        {/* Right side: General info */}
        <div style={{ flex: 1, padding: '16px', color: 'black' }} className={"secondary-colour"}>
          <h2>General Information</h2>
          <p>🎮 OCEANIC PRODIGIES: ACT II - AN INTER-UNI ESPORTS TOURNAMENT 🎮</p>
          <p>Prepare for OCEANIC PRODIGIES: ACT II, the most intense inter-university esports battle of the year! 🔥 Six top-tier universities from across NSW and ACT will go head-to-head in a 3-day action-packed event featuring the best of Valorant and League of Legends.</p>
          <p>This isn’t just another tournament—it’s a clash of esports titans, as students from six prestigious societies battle it out for ultimate glory and a share of the $5,000 AUD cash prize pool! 🏆💰</p>
          <p>Key Details:</p>
          <ul>
            <li>📅 When: 9–11 July 2025</li>
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
