import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css"; // Separate CSS file for header styling

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu state

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky-header">
      <nav className="navbar">
        <div className="logo">
          <h1>Enki_WebApp</h1>
        </div>

        {/* Conditionally render the nav-list based on the state of the menu */}
        <ul className={`nav-list ${isMenuOpen ? "active" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/marketplace">Marketplace</Link></li>
          <li><Link to="/podcast">Podcast</Link></li>
          <li><Link to="/learninghub">LearningHub</Link></li>
          <li><Link to="/connecthive">ConnectHive</Link></li> {/* Updated to ConnectHive */}
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </ul>

        {/* Hamburger Menu */}
        <button className="hamburger-menu" aria-label="Menu" onClick={toggleMenu}>
          ☰
        </button>
      </nav>
    </header>
  );
};

export default Header;