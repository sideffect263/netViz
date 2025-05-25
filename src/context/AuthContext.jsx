import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Set axios defaults for auth header
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Get current user
  const getCurrentUser = async () => {
    // If we already have user data, use that instead of making an API call
    if (user && user.user) {
      return { data: user.user };
    }
    
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/me');
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        getCurrentUser,
        isAuthenticated: !!user,
        isAdmin: user?.user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 