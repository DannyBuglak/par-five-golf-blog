import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useMetaTags } from "../../hooks/useMetaTags";
import "./AuthPage.css";

function ConfirmEmailPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Extract email from URL immediately
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  useMetaTags({
    title: "Confirm Your Email",
    description: "Verify your email address to complete your Par Five account setup.",
    url: "/confirm-email",
    type: "website",
  });

  // Only redirect if no email - don't call setState in effect
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResending(true);
    setError(null);
    setResendSuccess(false);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setError(error.message);
    } else {
      setResendSuccess(true);
    }

    setResending(false);
  };

  // Don't render anything if no email (will redirect)
  if (!email) {
    return null;
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Confirm Your Email</h1>
        <p className="auth__subtitle">
          We've sent a confirmation link to {email}
        </p>

        {error && <p className="auth__error">{error}</p>}

        <div className="auth__form">
          <div className="auth__success">
            <p>Click the link in your email to verify your account and complete your signup.</p>
            <p>If you don't see the email, check your spam folder.</p>
          </div>

          <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
            Didn't receive the email?
          </p>

          <button
            className="auth__btn"
            onClick={handleResendEmail}
            disabled={resending}
            style={{ marginTop: "var(--spacing-md)" }}
          >
            {resending ? "Sending..." : "Resend Confirmation Email"}
          </button>

          {resendSuccess && (
            <p style={{ textAlign: "center", color: "var(--color-green-primary)", fontSize: "var(--font-size-sm)", marginTop: "var(--spacing-md)" }}>
              ✓ Email sent! Check your inbox.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default ConfirmEmailPage;