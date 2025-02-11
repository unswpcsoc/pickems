import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Button } from "react-bootstrap";
import oceanProdigies from "../assets/HomePage/oceanProdigiesWide.jpg";
import megalan from "../assets/HomePage/megalanWide.jpg";

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

        </Carousel.Item>
      </Carousel>

      <br/><br/>

      {/* Flex container for Twitch + right div */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '24px' }}>
        
        {/* Left side: Twitch embedded */}
        <div
          style={{
            position: 'relative',
            width: '65%', 
            paddingBottom: '36.75%', 
            height: 0,
            overflow: 'hidden',
          }}
        >
          <iframe
            src="https://player.twitch.tv/?channel=unswpcsoc&parent=localhost&parent=alexgao.au"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            title="PCSoc Stream"
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </div>

        {/* Right side: General info */}
        <div style={{ flex: 1, backgroundColor: 'rgb(108,117,125)', padding: '16px', color: 'black' }}>
          <h2>General Information</h2>
          <p>The Oceanic Prodigies: Valorant tournament is a thrilling competition designed to bring together the best university esports players across Australia. Taking place at the Tyree Technology Building (ETB), UNSW Kensington, on the 22nd-23rd of February, 2025, the tournament promises intense matches and exciting moments for players and fans alike.</p>
          <Button variant="dark" href="/InfoAndPrize">More Information</Button>
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
