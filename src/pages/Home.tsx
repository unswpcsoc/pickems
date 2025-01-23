const HomePage = () => {
  return (
    <div style={{ width: '95vw', margin: 'auto' }}>
      <br />
      <h1>A home page</h1>

      <h3>Most likely instructions and twitch links here, have a separate pickems page for pickems</h3>

      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', marginRight: '16px', color: 'white' }}>
        <iframe
          src="https://player.twitch.tv/?channel=unswpcsoc&parent=localhost"
          height="800"
          width="100%"
          title="Faker Stream"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default HomePage;
