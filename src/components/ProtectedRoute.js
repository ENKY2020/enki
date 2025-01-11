import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../supabaseClient.js';

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // If still loading, show a loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Fetch the user's role from the database
  const fetchUserRole = async () => {
    const { data, error } = await supabase
      .from('profiles') // Replace with your table name
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data.role;
  };

  // Check if the user has the required role
  const hasRequiredRole = async () => {
    const userRole = await fetchUserRole();
    return userRole === role;
  };

  // If the user doesn't have the required role, redirect to the home page
  if (!hasRequiredRole()) {
    return <Navigate to="/" />;
  }

  // If the user has the required role, render the children
  return children;
};

export default ProtectedRoute;