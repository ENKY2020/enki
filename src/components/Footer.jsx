import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="about-section">
          <h4>About Us</h4>
          <p>
            Professional ICT solutions provider specializing in digital services, marketplace solutions, and tech education.
          </p>
        </div>
        <div className="connect-section">
          <h4>Connect With Us</h4>
          <p>@Lockdown Podcast KE</p>
        </div>
        <div className="contact-section">
          <h4>Enky Solutions</h4>
          <p>
            Contact Us:{" "}
            <a href="https://wa.me/254768063078" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Enky Solutions. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
