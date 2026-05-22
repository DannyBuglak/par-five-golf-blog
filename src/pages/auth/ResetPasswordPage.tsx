import "./AuthPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    // Check if user came from the reset email link
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setTokenValid(true);
      } else {
        setError("Invalid or expired reset link. Please try again.");
      }
      setCheckingToken(false);
    };

    checkSession();
  }, []);

  const handleResetPassword = async () => {
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect to login after successful reset
    navigate("/login");
  };

  if (checkingToken) {
    return (
      <main className="auth">
        <div className="auth__card">
          <p className="auth__subtitle">Loading...</p>
        </div>
      </main>
    );
  }

  if (!tokenValid) {
    return (
      <main className="auth">
        <div className="auth__card">
          <h1 className="auth__title">Reset Password</h1>
          <p className="auth__subtitle">
            {error || "Something went wrong"}
          </p>
          <div className="auth__form">
            <button
              className="auth__btn"
              onClick={() => navigate("/forgot-password")}
            >
              Request New Link
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Create New Password</h1>
        <p className="auth__subtitle">Enter your new password below</p>

        {error && <p className="auth__error">{error}</p>}

        <div className="auth__form">
          <div className="auth__field">
            <label htmlFor="password">New Password</label>
            <div className="auth__password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="auth__field">
            <label htmlFor="confirm">Confirm Password</label>
            <div className="auth__password-wrapper">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                className="auth__password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            className="auth__btn"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;