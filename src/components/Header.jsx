import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css"; // Ensure this CSS file is updated

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky-header">
      <nav className="navbar">
        <div className="logo">
          <h1>Enki_WebApp</h1>
        </div>

        <ul className={`nav-list ${isMenuOpen ? "active" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/marketplace">Marketplace</Link></li>
          <li><Link to="/podcast">Podcast</Link></li>
          <li><Link to="/learninghub">LearningHub</Link></li>
          <li>
            <Link to="/connecthive" className="bee-theme-link">
              ConnectHive
            </Link>
          </li>
          <li><Link to="/admin">Dashboard</Link></li>
          <li>
            <Link to="/login" className="login-button">
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="signup-button">
              Sign Up
            </Link>
          </li>
        </ul>

        <button
          className="hamburger-menu"
          aria-label="Menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          ☰
        </button>
      </nav>
    </header>
  );
};

export default Header;