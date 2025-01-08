// Podcast.jsx
import React from 'react';
import '../styles/podcast.css'; // Import the CSS file

const Podcast = () => {
  return (
    <div className="podcast-section">
      <div className="podcast-content">
        <h2>Lockdown Podcast KE</h2>
        <p>Tech insights, tutorials, entertainment, and digital solutions</p>
        <a
          href="https://www.youtube.com/@lockdownpodcastKE"
          className="subscribe-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Subscribe to Our Channel
        </a>
      </div>
    </div>
  );
};

export default Podcast;
