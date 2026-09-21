import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

  // Non-blocking Async I/O submission handler
  const handleAsyncSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setSubmitStatus({
        type: "error",
        text: "Please enter a message before sending.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate non-blocking async network I/O dispatch
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitStatus({
        type: "success",
        text: "Your message was sent successfully via Async I/O!",
      });
      setMessage("");
    } catch {
      setSubmitStatus({
        type: "error",
        text: "Async transmission failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container contact-container">
      <h2>Contact</h2>

      <form onSubmit={handleAsyncSubmit} style={{ width: "100%", maxWidth: "500px" }}>
        <input
          type="text"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="message-preview">
          <p style={{ margin: 0 }}>
            <strong>Your Message:</strong>{" "}
            {message || (
              <span style={{ opacity: 0.5 }}>No message entered yet.</span>
            )}
          </p>
        </div>

        <div className="contact-actions" style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setShowHelp(!showHelp)}
          >
            {showHelp ? "Hide Help" : "Show Help"}
          </button>
        </div>

        {submitStatus && (
          <div
            className={`status-banner status-${submitStatus.type}`}
            role="alert"
          >
            {submitStatus.text}
          </div>
        )}

        {showHelp && (
          <p className="help-text">Please enter your message in the textbox.</p>
        )}
      </form>
    </div>
  );
}

export default Contact;