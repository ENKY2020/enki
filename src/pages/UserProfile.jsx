import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import '../styles/connecthive.css';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    bio: '',
    skills: '',
    interests: '',
    profilePicture: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('bio, skills, interests, profile_picture')
          .eq('id', user.id)
          .single();

        if (error) console.error('Error fetching profile:', error);
        else setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('users')
        .update(profile)
        .eq('id', user.id);

      if (error) console.error('Error saving profile:', error);
      else alert('Profile saved successfully!');
    }
  };

  return (
    <div className="profile-section">
      <h3>Your Profile</h3>
      <textarea
        placeholder="Bio"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
      />
      <textarea
        placeholder="Skills/Services Offered"
        value={profile.skills}
        onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
      />
      <textarea
        placeholder="Interests/Topics"
        value={profile.interests}
        onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
      />
      <input
        type="text"
        placeholder="Profile Picture URL"
        value={profile.profilePicture}
        onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
      />
      <button onClick={handleSaveProfile}>Save Profile</button>
    </div>
  );
};

export default UserProfile;