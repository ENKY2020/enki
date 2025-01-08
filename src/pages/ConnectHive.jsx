import React, { useState } from 'react';
import '../styles/connecthive.css';

const ConnectHive = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(true);
  const [profile, setProfile] = useState({ followers: 0, premium: false });
  const [gigs, setGigs] = useState([]);
  const [newGig, setNewGig] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    mediaUrl: '',
    likes: 0,
    rating: 0,
  });
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    mediaUrl: '',
    likes: 0,
    vibes: 0,
    cringes: 0,
    comments: [],
    shares: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle file upload for profile picture and cover photo
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          [field]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile and close popup
  const handleSaveProfile = () => {
    if (!profile?.profilePicture || !profile?.coverPhoto || !profile?.bio || !profile?.skills) {
      alert('Please fill out all fields before saving.');
      return;
    }
    setShowProfilePopup(false);
    alert('Profile saved successfully!');
  };

  // Handle gig file upload
  const handleGigFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGig({ ...newGig, mediaUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new gig
  const handleAddGig = () => {
    if (!profile) {
      alert('Please create a profile first.');
      return;
    }
    setGigs([...gigs, { ...newGig, id: gigs.length + 1, author: profile.profilePicture, username: profile.username }]);
    setNewGig({ title: '', description: '', category: '', location: '', mediaUrl: '', likes: 0, rating: 0 });
  };

  // Handle post file upload
  const handlePostFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, mediaUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new post
  const handleAddPost = () => {
    if (!profile) {
      alert('Please create a profile first.');
      return;
    }
    setPosts([...posts, { ...newPost, id: posts.length + 1, author: profile.profilePicture, username: profile.username }]);
    setNewPost({ title: '', content: '', mediaUrl: '', likes: 0, vibes: 0, cringes: 0, comments: [], shares: 0 });
  };

  // Handle likes for posts and gigs
  const handleLike = (id, type) => {
    if (type === 'post') {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } else if (type === 'gig') {
      setGigs((prevGigs) =>
        prevGigs.map((gig) =>
          gig.id === id ? { ...gig, likes: gig.likes + 1 } : gig
        )
      );
    }
  };

  // Handle vibes and cringes for posts
  const handleVibe = (id, type) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, [type]: post[type] + 1 } : post
      )
    );
  };

  // Handle comments for posts
  const handleAddComment = (id, comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, comments: [...post.comments, comment] } : post
      )
    );
  };

  // Handle sharing posts
  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  // Handle following a user
  const handleFollow = (username) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      followers: prevProfile.followers + 1,
    }));
    alert(`You are now following ${username}`);
  };

  return (
    <div className="connecthive">
      <div className="sticky-header">
        <h2>ConnectHive</h2>
        <div className="header-content">
          <div className="top-contributors">
            <span>Top Contributors</span>
            <span>Top Gig Listers</span>
            <span>Trending Topics</span>
          </div>
          <div className="hamburger-menu">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
            {isMenuOpen && (
              <div className="menu-content">
                <ul>
                  <li>Trending Discussions</li>
                  <li>Top Gig Listers</li>
                  <li>Contributors</li>
                  <li>Notifications</li>
                  <li>Settings</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfilePopup && (
        <div className="profile-popup">
          <div className="popup-content">
            <h2>Create Your Profile</h2>
            <input
              type="text"
              placeholder="Username"
              value={profile?.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
            <div className="profile-cover">
              <label htmlFor="coverPhoto">Upload Cover Photo (16:9)</label>
              <input
                id="coverPhoto"
                type="file"
                onChange={(e) => handleFileUpload(e, 'coverPhoto')}
                accept="image/*"
              />
              {profile?.coverPhoto && <img src={profile.coverPhoto} alt="Cover" />}
            </div>
            <div className="profile-picture">
              <label htmlFor="profilePicture">Upload Profile Picture (Circle)</label>
              <input
                id="profilePicture"
                type="file"
                onChange={(e) => handleFileUpload(e, 'profilePicture')}
                accept="image/*"
              />
              {profile?.profilePicture && <img src={profile.profilePicture} alt="Profile" />}
            </div>
            <textarea
              placeholder="About Yourself"
              value={profile?.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
            <input
              type="text"
              placeholder="What do you do to earn a living?"
              value={profile?.skills || ''}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            />
            <button onClick={handleSaveProfile}>Save Profile</button>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="gig-listing">
          <h3>Gig Listings</h3>
          <div className="gig-form">
            <input
              type="text"
              placeholder="The Gig I offer!"
              value={newGig.title}
              onChange={(e) => setNewGig({ ...newGig, title: e.target.value })}
            />
            <textarea
              placeholder=" Your services,Contacts, Residence Email etc"
              value={newGig.description}
              onChange={(e) => setNewGig({ ...newGig, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Industry ,Technology , Health & Fitness etc"
              value={newGig.category}
              onChange={(e) => setNewGig({ ...newGig, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Country, City, Residence etc"
              value={newGig.location}
              onChange={(e) => setNewGig({ ...newGig, location: e.target.value })}
            />
            <input
              type="file"
              onChange={handleGigFileUpload}
              accept="image/*, video/*"
            />
            <button onClick={handleAddGig}>Add Gig</button>
          </div>
          <div className="gig-grid">
            {gigs.map((gig) => (
              <div className="gig-card" key={gig.id}>
                <h3>{gig.title}</h3>
                <p>{gig.description}</p>
                <p>Category: {gig.category}</p>
                <p>Location: {gig.location}</p>
                {gig.mediaUrl && (
                  gig.mediaUrl.endsWith('.mp4') || gig.mediaUrl.endsWith('.mov') ? (
                    <video controls src={gig.mediaUrl} className="gig-media" />
                  ) : (
                    <img src={gig.mediaUrl} alt="Gig Media" className="gig-media" />
                  )
                )}
                <p className="posted-by">
                  <img src={gig.author} alt="Author" className="author-picture" />
                  <span onClick={() => handleFollow(gig.username)}>{gig.username} ({profile.followers} followers)</span>
                </p>
                <div className="gig-interactions">
                  <button className="bee-button" onClick={() => handleLike(gig.id, 'gig')}>
                    🐝 Like ({gig.likes})
                  </button>
                 
                  <button className="bee-button">🐝 Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="forum-section">
          <h3>Community Forum</h3>
          <div className="post-form">
            <input
              type="text"
              placeholder="What's on your mind?"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
            <input
              type="file"
              onChange={handlePostFileUpload}
              accept="image/*, video/*"
            />
            <button onClick={handleAddPost}>Add Post</button>
          </div>
          <div className="post-grid">
            {posts.map((post) => (
              <div className="post-card" key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.mediaUrl && (
                  post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.mov') ? (
                    <video controls src={post.mediaUrl} className="post-media" />
                  ) : (
                    <img src={post.mediaUrl} alt="Post Media" className="post-media" />
                  )
                )}
                <p className="posted-by">
                  <img src={post.author} alt="Author" className="author-picture" />
                  <span onClick={() => handleFollow(post.username)}>{post.username} ({profile.followers} followers)</span>
                </p>
                <div className="post-interactions">
                  <button className="bee-button" onClick={() => handleLike(post.id, 'post')}>
                    🐝 Like ({post.likes})
                  </button>
                  <button className="bee-button" onClick={() => handleVibe(post.id, 'vibes')}>
                    🐝 Vibe ({post.vibes})
                  </button>
                  <button className="bee-button" onClick={() => handleVibe(post.id, 'cringes')}>
                    🐝 Cringe ({post.cringes})
                  </button>
                  <button className="bee-button" onClick={() => handleShare(post)}>
                    🐝 Share
                  </button>
                </div>
                <div className="comments">
                  {post.comments.map((comment, index) => (
                    <p key={index}>{comment}</p>
                  ))}
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectHive;