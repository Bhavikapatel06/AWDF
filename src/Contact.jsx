import { useState } from "react";

function Contact() {
    const [message, setMessage] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div>
            <h2>Contact</h2>

            <input
                type="text"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <p>Your Message: {message}</p>

            <button onClick={() => setShowHelp(!showHelp)}>
                {showHelp ? "Hide Help" : "Show Help"}
            </button>

            {showHelp && (
                <p>Please enter your message in the textbox.</p>
            )}
        </div>
    );
}

export default Contact;