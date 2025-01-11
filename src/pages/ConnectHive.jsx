import { useState, useEffect } from 'react';
import '../styles/connecthive.css';
import supabase from '../supabaseClient'; // Ensure this path is correct

// Define the uploadImage function using Supabase Storage
const uploadImage = async (file, userId, imageType) => {
  const filePath = `${userId}/${imageType}/${file.name}`;

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  // Get the public URL of the uploaded file
  const { data: publicUrl } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
};

const ConnectHive = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(true);
  const [profile, setProfile] = useState({
    id: '', // Ensure this is set when the user logs in
    username: '',
    profilePicture: '',
    coverPhoto: '',
    bio: '',
    skills: '',
    followers: 0,
    premium: false,
  });
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

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profile.id)
          .single();

        if (data) {
          setProfile(data);
          setShowProfilePopup(false); // Hide the profile popup if profile exists
        } else {
          setShowProfilePopup(true); // Show the popup if no profile exists
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (profile.id) {
      fetchProfile();
    }
  }, [profile.id]);

  // Handle file upload for profile picture and cover photo
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file, profile.id, field);
      if (imageUrl) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          [field]: imageUrl,
        }));
      }
    }
  };

  // Save profile and close popup
  const handleSaveProfile = async () => {
    if (
      !profile.username ||
      !profile.profilePicture ||
      !profile.coverPhoto ||
      !profile.bio ||
      !profile.skills
    ) {
      alert('Please fill out all fields before saving.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: profile.id,
            username: profile.username,
            profile_picture: profile.profilePicture,
            cover_photo: profile.coverPhoto,
            bio: profile.bio,
            skills: profile.skills,
          },
        ]);

      if (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
      } else {
        setShowProfilePopup(false);
        alert('Profile saved successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving the profile.');
    }
  };

  // Handle gig file upload
  const handleGigFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file, profile.id, 'gig_media');
      if (imageUrl) {
        setNewGig({ ...newGig, mediaUrl: imageUrl });
      }
    }
  };

  // Add a new gig
  const handleAddGig = async () => {
    if (!profile.id) {
      alert('Please create a profile first.');
      return;
    }

    const { data, error } = await supabase
      .from('gigs')
      .insert([
        {
          user_id: profile.id,
          title: newGig.title,
          description: newGig.description,
          category: newGig.category,
          location: newGig.location,
          media_url: newGig.mediaUrl,
          likes_count: newGig.likes,
          rating: newGig.rating,
        },
      ]);

    if (error) {
      console.error('Error adding gig:', error);
    } else {
      setGigs([...gigs, { ...newGig, id: data[0].id, author: profile.profilePicture, username: profile.username }]);
      setNewGig({ title: '', description: '', category: '', location: '', mediaUrl: '', likes: 0, rating: 0 });
    }
  };

  // Handle post file upload
  const handlePostFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file, profile.id, 'post_media');
      if (imageUrl) {
        setNewPost({ ...newPost, mediaUrl: imageUrl });
      }
    }
  };

  // Add a new post
  const handleAddPost = async () => {
    if (!profile.id) {
      alert('Please create a profile first.');
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: profile.id,
          title: newPost.title,
          content: newPost.content,
          media_url: newPost.mediaUrl,
          likes_count: newPost.likes,
          vibes_count: newPost.vibes,
          cringes_count: newPost.cringes,
          comments: newPost.comments,
          shares_count: newPost.shares,
        },
      ]);

    if (error) {
      console.error('Error adding post:', error);
    } else {
      setPosts([...posts, { ...newPost, id: data[0].id, author: profile.profilePicture, username: profile.username }]);
      setNewPost({ title: '', content: '', mediaUrl: '', likes: 0, vibes: 0, cringes: 0, comments: [], shares: 0 });
    }
  };

  // Handle likes for posts and gigs
  const handleLike = async (id, type) => {
    const table = type === 'post' ? 'posts' : 'gigs';
    const { data, error } = await supabase
      .from(table)
      .update({ likes_count: supabase.raw('likes_count + 1') })
      .eq('id', id);

    if (error) {
      console.error('Error updating likes:', error);
    } else {
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
    }
  };

  // Handle vibes and cringes for posts
  const handleVibe = async (id, type) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ [type]: supabase.raw(`${type} + 1`) })
      .eq('id', id);

    if (error) {
      console.error('Error updating vibes/cringes:', error);
    } else {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, [type]: post[type] + 1 } : post
        )
      );
    }
  };

  // Handle comments for posts
  const handleAddComment = async (id, comment) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ comments: supabase.raw('array_append(comments, ?)', [comment]) })
      .eq('id', id);

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, comments: [...post.comments, comment] } : post
        )
      );
    }
  };

  // Handle sharing posts
  const handleShare = (post) => {
    const shareUrl = `https://yourwebsite.com/post/${post.id}`;
    const shareText = `Check out this post: ${post.title}\n${post.content}`;

    // Facebook Share
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    // Twitter Share
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    // WhatsApp Share
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;

    // WhatsApp Business Share
    const whatsappBusinessShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}&phone=YOUR_BUSINESS_NUMBER`;

    // Instagram Share (Note: Instagram doesn't support direct sharing via URL)
    const instagramShareUrl = `https://www.instagram.com/`;

    // Open share links in new tabs
    window.open(facebookShareUrl, '_blank');
    window.open(twitterShareUrl, '_blank');
    window.open(whatsappShareUrl, '_blank');
    window.open(whatsappBusinessShareUrl, '_blank');
    window.open(instagramShareUrl, '_blank');
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
              {profile?.coverPhoto && <img src={profile.coverPhoto} alt="Cover Preview" className="image-preview" />}
            </div>
            <div className="profile-picture">
              <label htmlFor="profilePicture">Upload Profile Picture (Circle)</label>
              <input
                id="profilePicture"
                type="file"
                onChange={(e) => handleFileUpload(e, 'profilePicture')}
                accept="image/*"
              />
              {profile?.profilePicture && <img src={profile.profilePicture} alt="Profile Preview" className="image-preview" />}
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
                  <button className="bee-button" onClick={() => handleShare(gig)}>
                    🐝 Share
                  </button>
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