import "./AuthPage.css";
import { Link } from "react-router-dom";

function LogInPage() {
  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Welcome Back</h1>
        <p className="auth__subtitle">
          Sign in to your Par Five Golf Blog account
        </p>

        <div className="auth__form">
          <div className="auth__field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="auth__field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" />
          </div>

          <button className="auth__btn">Sign In</button>

          <p className="auth__switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LogInPage;
