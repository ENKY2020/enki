import React, { useState, useEffect } from "react";
import "../styles/homepage.css";
import supabase from "../supabaseClient"; // Import Supabase client

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
      {/* Hero Section */}
      <div className="hero-section">
        {/* YouTube Embed */}
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Ga3-OdwDTw8?si=uksD7X0Sk2f2J83P"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          className="background-video"
        ></iframe>
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Where would you like to go?</h2>
            <ul>
              <li>
                <a href="/services" onClick={toggleModal}>
                  Explore Services
                </a>
              </li>
              <li>
                <a href="/marketplace" onClick={toggleModal}>
                  View Marketplace
                </a>
              </li>
              <li>
                <a href="/learninghub" onClick={toggleModal}>
                  Start Learning
                </a>
              </li>
              <li>
                <a href="/connecthive" onClick={toggleModal}>
                  ConnectHive
                </a>
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