import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky-header">
      <nav className="navbar">
        <div className="logo">
          <h1>Enki_WebApp</h1>
        </div>

        <ul className={`nav-list ${isMenuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
          <li><Link to="/marketplace" onClick={closeMenu}>Marketplace</Link></li>
          <li><Link to="/podcast" onClick={closeMenu}>Podcast</Link></li>
          <li><Link to="/learninghub" onClick={closeMenu}>LearningHub</Link></li>
          <li>
            <Link to="/connecthive" className="bee-theme-link" onClick={closeMenu}>
              ConnectHive
            </Link>
          </li>
          <li><Link to="/admin" onClick={closeMenu}>Dashboard</Link></li>
          <li>
            <Link to="/login" className="login-button" onClick={closeMenu}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="signup-button" onClick={closeMenu}>
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
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </nav>
    </header>
  );
};

export default Header;
