import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "../styles/homepage.css";
import supabase from "../supabaseClient"; // Import Supabase client
import Header from "../components/Header"; // Import the Header component

const HomePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);

  // Fetch blog posts from Supabase
  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data, error } = await supabase.from('blog_posts').select('*');
      if (error) {
        console.error('Error fetching blog posts:', error);
      } else {
        setBlogPosts(data);
      }
    };

    fetchBlogPosts();
  }, []);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // Group blog posts by category
  const groupedPosts = blogPosts.reduce((acc, post) => {
    if (!acc[post.category]) acc[post.category] = [];
    acc[post.category].push(post);
    return acc;
  }, {});

  return (
    <div className="homepage-container">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <div className="hero-section">
        {/* Video from Public Folder */}
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Enky Solutions</h1>
          <p>Professional ICT solutions for all your needs.</p>
          <button className="cta-button" onClick={toggleModal}>
            Get Started
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Where would you like to go?</h2>
            <ul>
              <li>
                <Link to="/services" onClick={toggleModal}>
                  Explore Services
                </Link>
              </li>
              <li>
                <Link to="/marketplace" onClick={toggleModal}>
                  View Marketplace
                </Link>
              </li>
              <li>
                <Link to="/learninghub" onClick={toggleModal}>
                  Start Learning
                </Link>
              </li>
              <li>
                <Link to="/connecthive" onClick={toggleModal} className="bee-theme-link">
                  ConnectHive
                </Link>
              </li>
            </ul>
            <button className="close-modal" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Blog Section */}
      <div className="blog-section">
        <h2>Our Latest Updates</h2>
        <div className="blog-grid">
          {/* Special Promotions */}
          <div className="blog-column">
            <h3>Special Promotions</h3>
            {groupedPosts['Special Promotions']?.map((post) => (
              <div className="blog-card" key={post.id}>
                <img src={post.image_url} alt={post.title} className="blog-img" />
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            ))}
          </div>

          {/* Breaking News */}
          <div className="blog-column">
            <h3>Breaking News</h3>
            {groupedPosts['Breaking News']?.map((post) => (
              <div className="blog-card" key={post.id}>
                <img src={post.image_url} alt={post.title} className="blog-img" />
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            ))}
          </div>

          {/* Trending Topics */}
          <div className="blog-column">
            <h3>Trending Topics</h3>
            {groupedPosts['Trending Topics']?.map((post) => (
              <div className="blog-card" key={post.id}>
                <img src={post.image_url} alt={post.title} className="blog-img" />
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;