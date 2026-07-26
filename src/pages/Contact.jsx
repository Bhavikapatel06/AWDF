import { useState } from "react";
import "./Contact.css";

function Contact() {
    const [message, setMessage] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div className="container contact-container">
            <h2>Contact</h2>

            <input
                type="text"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <div className="message-preview">
                <p style={{ margin: 0 }}>
                    <strong>Your Message:</strong> {message || <span style={{ opacity: 0.5 }}>No message entered yet.</span>}
                </p>
            </div>

            <button onClick={() => setShowHelp(!showHelp)}>
                {showHelp ? "Hide Help" : "Show Help"}
            </button>

            {showHelp && (
                <p className="help-text">Please enter your message in the textbox.</p>
            )}
        </div>
    );
}

export default Contact;