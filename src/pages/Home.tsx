const HomePage = () => {
  return (
    <div style={{ width: '95vw', margin: 'auto' }}>
      <br />
      {/* <h1>Oceanic Prodigies : Valorant</h1> */}

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
          <p>Todo!</p>
          <p>Talk about the tournament + rules + prize</p>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
