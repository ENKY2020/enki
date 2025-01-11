import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Services from './pages/Services.jsx';
import Podcast from './pages/Podcast.jsx';
import ConnectHive from './pages/ConnectHive.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LearningHub from './pages/LearningHub.jsx';
import UserDashboard from './pages/UserDashboard.jsx'; // Import the UserDashboard
import ProtectedRoute from './components/ProtectedRoute.js'; // Import the ProtectedRoute
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/services" element={<Services />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/learninghub" element={<LearningHub />} />
            <Route path="/connecthive" element={<ConnectHive />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            {/* Admin Dashboard - Only accessible to users with the "admin" role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* User Dashboard - Only accessible to users with the "user" role */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;