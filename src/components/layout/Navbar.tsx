import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          Par Five Golf Blog
        </Link>
        <div className="navbar__links">
          <Link to="/feed">Feed</Link>
          <Link to="/my-posts">My Posts</Link>
          <Link to="/signup">Start Blogging</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
