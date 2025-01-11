import { useState } from 'react';
import supabase from '../supabaseClient';
import '../styles/auth.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // Step 2: Insert the user into the `users_table` with username and auth_id
      const { error: userError } = await supabase
        .from('users_table')
        .insert([
          {
            auth_id: authData.user.id, // UUID from Supabase Auth
            username,
            email,
            password, // Note: In a real app, you should hash the password before storing it
            role: 'user', // Default role
          },
        ]);

      if (userError) {
        throw userError;
      }

      console.log('Signed up user:', authData.user);
      alert('Signup successful! Please check your email for confirmation.');
      window.location.href = '/login'; // Redirect to login page after signup
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      // After Google Sign-In, prompt the user to choose a username
      const username = prompt('Choose a username:');
      if (username) {
        const { error: userError } = await supabase
          .from('users_table')
          .insert([
            {
              auth_id: data.user.id, // UUID from Supabase Auth
              username,
              email: data.user.email,
              role: 'user', // Default role
            },
          ]);

        if (userError) {
          throw userError;
        }

        console.log('Signed up with Google:', data.user);
        alert('Signup with Google successful!');
        window.location.href = '/'; // Redirect to homepage after signup
      }
    } catch (error) {
      console.error('Google Sign-Up error:', error);
      setError(error.message || 'Google Sign-Up failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;