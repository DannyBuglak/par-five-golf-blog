import "./ContactPage.css";
import { useState } from "react";
import emailjs from "@emailjs/browser";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all fields");
      return;
    }

    setSending(true);
    setError(null);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: name.trim(),
          from_email: email.trim(),
          message: message.trim(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setSending(false);
  };

  return (
    <main className="contact">
      <div className="contact__container">
        <div className="contact__header">
          <h1>Contact</h1>
          <p>
            Have a question, suggestion, or just want to talk golf? We'd love to
            hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="contact__success">
            <h2>Message sent!</h2>
            <p>Thanks for reaching out. We'll get back to you soon.</p>
          </div>
        ) : (
          <div className="contact__form">
            {error && <p className="contact__error">{error}</p>}

            <div className="contact__field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="contact__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="contact__field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="What's on your mind?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>

            <div className="contact__footer">
              <button
                className="contact__submit"
                onClick={handleSubmit}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Message →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ContactPage;
