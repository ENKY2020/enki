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
        <video autoPlay loop muted className="background-video">
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
            <div className="blog-card">
              <img src="20-percent-off.png" alt="Special Promotions" className="blog-img" />
              <h4><strong>Exclusive Launch Week Discounts: Save Big on ICT Solutions!</strong></h4>
              <p>
                To celebrate the launch of Enki_WebApp, we’re offering exclusive discounts on our top services! Whether you’re looking for cutting-edge web development solutions, IT consulting, or professional CV services, now is the perfect time to invest in your business.
                <br /><br />
                🎉 Special Offers:
                <ul>
                  <li>20% off on all ICT consulting services.</li>
                  <li>Free adding of your products on the marketplace platform.</li>
                  <li>Discounts on numerous purchases.</li>
                </ul>
                Don’t miss out—these offers are valid only for the first week!
                <br /><br />
                <strong>Call to Action:</strong> 👉 <a href="/services">Explore Services</a>
              </p>
            </div>
          </div>

          {/* Breaking News */}
          <div className="blog-column">
            <h3>Breaking News</h3>
            <div className="blog-card">
              <img src="robot-cafe.jpg" alt="Breaking News" className="blog-img" />
              <h4>Nairobi Ranked Among Top Tech Hubs in Africa!</h4>
              <p>
                Nairobi has been recognized as one of the leading tech hubs in Africa, according to a recent report by the African Tech Foundation. The city’s thriving startup ecosystem, coupled with its innovative ICT infrastructure, has positioned it as a key player in the continent’s digital transformation.
                <br /><br />
                🌟 Key Highlights:
                <ul>
                  <li>Nairobi is home to over 200 tech startups.</li>
                  <li>The city has seen a 30% increase in tech investments in the past year.</li>
                  <li>Major global companies are setting up offices in Nairobi, creating thousands of jobs.</li>
                </ul>
                <strong>Call to Action:</strong> 👉 <a href="/nairobi-tech-scene">Learn More About Nairobi’s Tech Scene</a>
              </p>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="blog-column">
            <h3>Trending Topics</h3>
            <div className="blog-card">
              <img src="tech-bee.jpg" alt="Trending Topics" className="blog-img" />
              <h4>AI in Africa: How Artificial Intelligence is Transforming Industries</h4>
              <p>
                Artificial Intelligence (AI) is no longer a futuristic concept—it’s here, and it’s transforming industries across Africa. From healthcare to agriculture, AI is driving innovation and solving real-world problems.
                <br /><br />
                🚀 Trending Applications:
                <ul>
                  <li>Healthcare: AI-powered diagnostics are improving patient outcomes.</li>
                  <li>Agriculture: Smart farming tools are boosting crop yields.</li>
                  <li>Finance: AI is revolutionizing fraud detection and customer service.</li>
                </ul>
                <strong>Call to Action:</strong> 👉 <a href="/ai-benefits">Discover How AI Can Benefit Your Business</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div> // Closing div for homepage-container
  );
};

export default HomePage; // Correct placement of export statement