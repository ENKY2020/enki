import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Import Supabase client
import '../styles/admin-dashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [connectHivePosts, setConnectHivePosts] = useState([]);
  const [connectHiveGigs, setConnectHiveGigs] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [settings, setSettings] = useState({ siteTitle: 'Enky Solutions', theme: 'light' });
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '', category: '' });
  const [activeSection, setActiveSection] = useState('blog');

  // Check if the user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Authentication error:', authError);
          window.location.href = '/login'; // Redirect to login on error
          return;
        }

        if (user) {
          setUser(user);
        } else {
          window.location.href = '/login'; // Redirect unauthenticated users
        }
      } catch (error) {
        console.error('Error in fetchUser:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch all data in a single useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: blogPosts, error: blogError },
          { data: marketplaceListings, error: marketplaceError },
          { data: userActivity, error: activityError },
          { data: connectHivePosts, error: connectHivePostsError },
          { data: connectHiveGigs, error: connectHiveGigsError },
          { data: topContributors, error: topContributorsError },
          { data: trendingTopics, error: trendingTopicsError },
        ] = await Promise.all([
          supabase.from('blog_posts').select('*'),
          supabase.from('products').select('*'),
          supabase.from('user_activity').select('*'),
          supabase.from('connecthive_posts').select('*'),
          supabase.from('connecthive_gigs').select('*'),
          supabase.from('top_contributors').select('*'),
          supabase.from('trending_topics').select('*'),
        ]);

        if (blogError) console.error('Error fetching blog posts:', blogError);
        else setBlogPosts(blogPosts);

        if (marketplaceError) console.error('Error fetching marketplace listings:', marketplaceError);
        else setMarketplaceListings(marketplaceListings);

        if (activityError) console.error('Error fetching user activity:', activityError);
        else setUserActivity(userActivity);

        if (connectHivePostsError) console.error('Error fetching Connect Hive posts:', connectHivePostsError);
        else setConnectHivePosts(connectHivePosts);

        if (connectHiveGigsError) console.error('Error fetching Connect Hive gigs:', connectHiveGigsError);
        else setConnectHiveGigs(connectHiveGigs);

        if (topContributorsError) console.error('Error fetching top contributors:', topContributorsError);
        else setTopContributors(topContributors);

        if (trendingTopicsError) console.error('Error fetching trending topics:', trendingTopicsError);
        else setTrendingTopics(trendingTopics);
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    fetchData(); // Fetch data for all users
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      window.location.href = '/login'; // Redirect to login after logout
    }
  };

  // Handle image upload for blog posts
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(`blog/${file.name}`, file);

    if (error) {
      console.error('Error uploading image:', error);
    } else {
      setNewPost({ ...newPost, image_url: data.path });
    }
  };

  // Add a new blog post
  const handleAddBlogPost = async () => {
    const { data, error } = await supabase.from('blog_posts').insert([newPost]).select();
    if (error) {
      console.error('Error adding blog post:', error);
    } else {
      setBlogPosts([...blogPosts, data[0]]);
      setNewPost({ title: '', content: '', image_url: '', category: '' }); // Reset form
    }
  };

  // Delete a blog post
  const handleDeleteBlogPost = async (id) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting blog post:', error);
    } else {
      setBlogPosts(blogPosts.filter((post) => post.id !== id));
    }
  };

  // Delete a marketplace listing
  const handleDeleteListing = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting listing:', error);
    } else {
      setMarketplaceListings(marketplaceListings.filter((listing) => listing.id !== id));
    }
  };

  // Delete a Connect Hive post
  const handleDeleteConnectHivePost = async (id) => {
    const { error } = await supabase.from('connecthive_posts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting Connect Hive post:', error);
    } else {
      setConnectHivePosts(connectHivePosts.filter((post) => post.id !== id));
    }
  };

  // Delete a Connect Hive gig
  const handleDeleteConnectHiveGig = async (id) => {
    const { error } = await supabase.from('connecthive_gigs').delete().eq('id', id);
    if (error) {
      console.error('Error deleting Connect Hive gig:', error);
    } else {
      setConnectHiveGigs(connectHiveGigs.filter((gig) => gig.id !== id));
    }
  };

  // Update site settings
  const handleUpdateSettings = async () => {
    const { error } = await supabase.from('settings').upsert([settings]);
    if (error) {
      console.error('Error updating settings:', error);
    } else {
      alert('Settings updated successfully!');
    }
  };

  // Show loading state while checking user status
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}! Here, you can manage your site content.</p>
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      <div className="dashboard-options">
        <button
          className={`dashboard-btn ${activeSection === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveSection('blog')}
        >
          Manage Blog Posts
        </button>
        <button
          className={`dashboard-btn ${activeSection === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveSection('marketplace')}
        >
          Manage Marketplace Listings
        </button>
        <button
          className={`dashboard-btn ${activeSection === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveSection('activity')}
        >
          View User Activity
        </button>
        <button
          className={`dashboard-btn ${activeSection === 'connecthive' ? 'active' : ''}`}
          onClick={() => setActiveSection('connecthive')}
        >
          Manage Connect Hive
        </button>
        <button
          className={`dashboard-btn ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          Settings
        </button>
      </div>

      {/* Manage Blog Posts Section */}
      {activeSection === 'blog' && (
        <div className="manage-section">
          <h2>Manage Blog Posts</h2>
          <div className="blog-form">
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
            <input type="file" onChange={handleImageUpload} />
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Tech Insights">Tech Insights</option>
              <option value="Internet Cafe News">Internet Cafe News</option>
              <option value="Special Promotions">Special Promotions</option>
              <option value="Breaking News">Breaking News</option>
              <option value="Trending Topics">Trending Topics</option>
            </select>
            <button className="add-btn" onClick={handleAddBlogPost}>
              Add New Blog Post
            </button>
          </div>
          <ul className="blog-list">
            {blogPosts.length === 0 ? (
              <p>No blog posts found.</p>
            ) : (
              blogPosts.map((post) => (
                <li key={post.id} className="blog-card">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <img src={post.image_url} alt={post.title} className="blog-img" />
                  <p>Category: {post.category}</p>
                  <button onClick={() => handleDeleteBlogPost(post.id)}>Delete</button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Manage Marketplace Listings Section */}
      {activeSection === 'marketplace' && (
        <div className="manage-section">
          <h2>Manage Marketplace Listings</h2>
          <ul className="marketplace-list">
            {marketplaceListings.length === 0 ? (
              <p>No marketplace listings found.</p>
            ) : (
              marketplaceListings.map((listing) => (
                <li key={listing.id} className="marketplace-card">
                  <p>{listing.productName}</p>
                  <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* View User Activity Section */}
      {activeSection === 'activity' && (
        <div className="manage-section">
          <h2>User Activity</h2>
          <ul className="activity-list">
            {userActivity.length === 0 ? (
              <p>No user activity found.</p>
            ) : (
              userActivity.map((activity) => (
                <li key={activity.id} className="activity-card">
                  <p>User: {activity.user_id}</p>
                  <p>Action: {activity.action}</p>
                  <p>Timestamp: {new Date(activity.timestamp).toLocaleString()}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Manage Connect Hive Section */}
      {activeSection === 'connecthive' && (
        <div className="manage-section">
          <h2>Manage Connect Hive</h2>

          {/* Manage Posts */}
          <div className="connecthive-posts">
            <h3>Posts</h3>
            <ul className="post-list">
              {connectHivePosts.length === 0 ? (
                <p>No Connect Hive posts found.</p>
              ) : (
                connectHivePosts.map((post) => (
                  <li key={post.id} className="post-card">
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                    <button onClick={() => handleDeleteConnectHivePost(post.id)}>Delete</button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Manage Gigs */}
          <div className="connecthive-gigs">
            <h3>Gigs</h3>
            <ul className="gig-list">
              {connectHiveGigs.length === 0 ? (
                <p>No Connect Hive gigs found.</p>
              ) : (
                connectHiveGigs.map((gig) => (
                  <li key={gig.id} className="gig-card">
                    <h4>{gig.title}</h4>
                    <p>{gig.description}</p>
                    <button onClick={() => handleDeleteConnectHiveGig(gig.id)}>Delete</button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Manage Top Contributors */}
          <div className="top-contributors">
            <h3>Top Contributors</h3>
            <ul className="contributor-list">
              {topContributors.length === 0 ? (
                <p>No top contributors found.</p>
              ) : (
                topContributors.map((contributor) => (
                  <li key={contributor.id} className="contributor-card">
                    <p>{contributor.username}</p>
                    <p>Posts: {contributor.post_count}</p>
                    <p>Likes: {contributor.likes}</p>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Manage Trending Topics */}
          <div className="trending-topics">
            <h3>Trending Topics</h3>
            <ul className="topic-list">
              {trendingTopics.length === 0 ? (
                <p>No trending topics found.</p>
              ) : (
                trendingTopics.map((topic) => (
                  <li key={topic.id} className="topic-card">
                    <p>{topic.name}</p>
                    <p>Engagement: {topic.engagement}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <div className="manage-section">
          <h2>Settings</h2>
          <div className="settings-form">
            <label>
              Site Title:
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              />
            </label>
            <label>
              Theme:
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <button className="save-btn" onClick={handleUpdateSettings}>
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;