import "./Footer.css";
import { Link } from "react-router-dom";

const BUYMEACOFFEE_URL = 'https://buymeacoffee.com/dannybuglak';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">Par Five Golf Blog</span>
          <p className="footer__tagline">Golf stories worth reading.</p>
        </div>

        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/feed">Feed</Link>
          <Link to="/my-posts">My Posts</Link>
          {/* Placeholder for future contact developer page */}
          <Link to="/contact">Contact</Link>{" "}
          {/* Placeholder for future redirect to buymeacoffee */}
          <Link to={BUYMEACOFFEE_URL} target="_blank" rel="noopener noreferrer">
            Support This Project
          </Link>
        </div>

        <div className="footer__copy">
          © {new Date().getFullYear()} Danny Buglak. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
