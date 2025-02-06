import './Footer.css';

const Footer = ({ isLargeContent }: { isLargeContent: boolean }) => {
  return (
    <footer className={`footer ${isLargeContent ? '' : 'footer-large-content'}`}>
      <div className="footer-container">
        {/* <div className="footer-column">
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
          </ul>
        </div> */}

        <div className="footer-column">
          <ul className="footer-socials">
            <li><a href="https://discord.gg/unswpcsoc" target="_blank" rel="noopener noreferrer">Discord</a></li>
            <li><a href="https://www.facebook.com/unswpcsoc/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://www.instagram.com/unswpcsoc/reels/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>

        {/* <div className="footer-column">
          <ul className="footer-contact">
            <li><a href="https://www.unswpcsoc.com/">Website</a></li>
          </ul>
        </div> */}
      </div>

      <div className="footer-bottom">
        <p>2025 UNSW PCSoc</p>
      </div>
    </footer>
  );
};

export default Footer;
