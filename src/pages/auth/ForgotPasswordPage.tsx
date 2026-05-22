import "./AuthPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main className="auth">
        <div className="auth__card">
          <h1 className="auth__title">Check Your Email</h1>
          <p className="auth__subtitle">
            We've sent a password reset link to {email}
          </p>

          <div className="auth__success">
            <p>Follow the link in the email to reset your password.</p>
            <p>If you don't see the email, check your spam folder.</p>
          </div>

          <div className="auth__form">
            <button
              className="auth__btn"
              onClick={() => navigate("/login")}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Reset Password</h1>
        <p className="auth__subtitle">
          Enter your email address and we'll send you a link to reset your password
        </p>

        {error && <p className="auth__error">{error}</p>}

        <div className="auth__form">
          <div className="auth__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            className="auth__btn"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="auth__switch">
            Remember your password? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;