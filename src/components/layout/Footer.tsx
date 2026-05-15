import "./Footer.css";
import { Link } from "react-router-dom";

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
          <Link to="/signup">Start Blogging</Link>
          <Link to="/login">Sign In</Link>
        </div>

        <div className="footer__copy">
          © {new Date().getFullYear()} Danny Buglak. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
