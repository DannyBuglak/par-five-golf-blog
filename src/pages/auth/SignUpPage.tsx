import "./AuthPage.css";
import { Link } from "react-router-dom";

function SignUpPage() {
  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Create an Account</h1>
        <p className="auth__subtitle">Join Par Five Golf Blog and start writing</p>

        <div className="auth__form">
          <div className="auth__field">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" placeholder="golfer123" />
          </div>

          <div className="auth__field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="auth__field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" />
          </div>

          <div className="auth__field">
            <label htmlFor="confirm">Confirm Password</label>
            <input id="confirm" type="password" placeholder="••••••••" />
          </div>

          <button className="auth__btn">Create Account</button>

          <p className="auth__switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignUpPage;
