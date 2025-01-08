import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Services from './pages/Services.jsx';
import Podcast from './pages/Podcast.jsx';
import ConnectHive from './pages/ConnectHive.jsx'; // Updated from ContactUs to ConnectHive
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LearningHub from './pages/LearningHub.jsx'; // Import LearningHub page
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/services" element={<Services />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/learninghub" element={<LearningHub />} /> {/* LearningHub route */}
            <Route path="/connecthive" element={<ConnectHive />} /> {/* Updated to ConnectHive */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;