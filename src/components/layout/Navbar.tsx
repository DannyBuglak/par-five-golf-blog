import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      if (data) setUsername(data.username);
    };
    fetchUsername();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          Par Five Golf Blog
        </Link>

        <button
          className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
        </button>

        <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          <Link to="/feed" onClick={closeMenu}>
            Feed
          </Link>
          {user ? (
            <>
              <Link to="/my-posts" onClick={closeMenu}>
                My Posts
              </Link>
              <Link to="/write" onClick={closeMenu}>
                Write
              </Link>
              {username && (
                <Link
                  to={`/profile/${username}`}

                  onClick={closeMenu}
                >
                  Profile
                </Link>
              )}
              <button className="navbar__logout" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" onClick={closeMenu}>
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
