import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { supabase } from "../../lib/supabase";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          Par Five Golf Blog
        </Link>
        <div className="navbar__links">
          <Link to="/feed">Feed</Link>
          {user ? (
            <>
              <Link to="/my-posts">My Posts</Link>
              <Link to="/write">Write</Link>
              <Link to="/profile">Profile</Link>
              <button className="navbar__logout" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="navbar__cta">
                Start Writing
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
