import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">Par Five Golf Blog</div>
      <div className="navbar__links">
        <a href="/">Home</a>
        <a href="/blog">Blog</a>
        <a href="/login">Login</a>
        <button className="navbar__cta">Start Writing</button>
      </div>
    </nav>
  );
}

export default Navbar;
