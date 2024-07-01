import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const handleUnauthorized = () => {
    logout();
    setError('Your session has expired. Please log in again.');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response && error.response.status === 401) {
          handleUnauthorized();
        } else {
          setError('Failed to authenticate. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    setError(null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);