import React, { useState } from 'react';
import '../styles/learninghub.css';

const LearningHub = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for user authentication
  const [suggestedCourse, setSuggestedCourse] = useState(''); // For course suggestions

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn); // Toggle login state
  };

  const handleCourseSuggestion = (e) => {
    e.preventDefault();
    alert(`Thank you for suggesting: "${suggestedCourse}". We'll consider adding it!`);
    setSuggestedCourse('');
  };

  return (
    <div className="learning-hub">
      {!isLoggedIn ? (
        <div className="auth-section">
          <h2>Welcome to LearningHub</h2>
          <p>Empower your learning journey with Enky Solutions. Log in to access courses.</p>
          <button className="auth-btn" onClick={handleLoginToggle}>
            Log In
          </button>
        </div>
      ) : (
        <>
          <header className="intro-section">
            <h2>Welcome to LearningHub</h2>
            <p>Empower your learning journey with Enky Solutions</p>
            <button className="auth-btn" onClick={handleLoginToggle}>
              Log Out
            </button>
          </header>

          {/* Featured Courses Section */}
          <section className="courses-section">
            <h3>Featured Courses</h3>
            <div className="course-list">
              {/* Course Items */}
              <div className="course-item">
                <h4>Computer Basic Skills with Certificate</h4>
                <p>Duration: 2-4 weeks (Learn Online)</p>
                <p>Price: <strong>KES 3,500</strong></p>
                <button className="enroll-btn">Enroll Now</button>
              </div>
              <div className="course-item">
                <h4>Digital Marketing Full Course</h4>
                <p>Duration: 1 month</p>
                <p>Price: <strong>KES 4,500</strong></p>
                <button className="enroll-btn">Enroll Now</button>
              </div>
              <div className="course-item">
                <h4>Advanced Excel</h4>
                <p>Duration: 2 months</p>
                <p>Price: <strong>KES 6,000</strong></p>
                <button className="enroll-btn">Enroll Now</button>
              </div>
              <div className="course-item">
                <h4>React.Js - JavaScript Master Class</h4>
                <p>Duration: 2 months (Full Stack Developer Course)</p>
                <p>Price: <strong>KES 10,000</strong></p>
                <button className="enroll-btn">Enroll Now</button>
              </div>
              <div className="course-item">
                <h4>Website Developer Hackathon</h4>
                <p>Duration: Weekly (Monthly Fee)</p>
                <p>Price: <strong>KES 1,000/month</strong></p>
                <p>Join live podcasts, informative videos, and learn emerging technologies.</p>
                <button className="enroll-btn">Enroll Now</button>
              </div>
            </div>
          </section>

          {/* Student Dashboard Section */}
          <section className="dashboard">
            <h3>Your Dashboard</h3>
            <div className="dashboard-list">
              <div className="dashboard-item">
                <h4>Computer Basic Skills</h4>
                <p>Status: In Progress</p>
                <button className="continue-btn">Continue</button>
              </div>
              <div className="dashboard-item">
                <h4>Digital Marketing</h4>
                <p>Status: Not Started</p>
                <button className="start-btn">Start Course</button>
              </div>
            </div>
          </section>

          {/* Course Suggestion Section */}
          <section className="suggestion-section">
            <h3>Suggest a Course</h3>
            <p>Is there a course you'd like to see in the LearningHub? Let us know!</p>
            <form onSubmit={handleCourseSuggestion}>
              <input
                type="text"
                placeholder="Enter course name"
                value={suggestedCourse}
                onChange={(e) => setSuggestedCourse(e.target.value)}
                required
              />
              <button type="submit" className="suggest-btn">
                Suggest Course
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
};

export default LearningHub;