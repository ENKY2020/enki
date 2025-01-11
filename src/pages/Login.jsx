import { useState } from 'react';
import supabase from '../supabaseClient';
import '../styles/auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Fetch the user's email and auth_id from `users_table` using the username
      const { data: userData, error: userError } = await supabase
        .from('users_table')
        .select('email, auth_id')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        throw new Error('Invalid username or password.');
      }

      // Step 2: Log in the user with Supabase Auth using the email
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });

      if (authError) {
        throw authError;
      }

      console.log('Logged in user:', userData);
      alert('Login successful!');
      window.location.href = '/'; // Redirect to homepage after login
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
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

      console.log('Logged in with Google:', data.user);
      alert('Login with Google successful!');
      window.location.href = '/'; // Redirect to homepage after login
    } catch (error) {
      console.error('Google Login error:', error);
      setError(error.message || 'Google Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={handleGoogleLogin}>Login with Google</button>
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;