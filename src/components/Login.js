import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { login as apiLogin } from '../services/apiService';

const Login = ({ onClose = () => {}, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      console.log('Attempting to login with:', { username, password });
      const response = await apiLogin(username, password);
      console.log('Login response:', response);
      if (response.data && response.data.access) {  
        localStorage.setItem('token', response.data.access);
        login({ token: response.data.access, username: username });
        onClose();
        navigate('/profile');
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      console.error('Login error:', err.response || err);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Login</h3>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <form className="mt-2 px-7 py-3" onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-2">
            <button className="text-sm text-blue-500 hover:text-blue-800" onClick={onRegister} disabled={isLoading}>
              Don't have an account? Register
            </button>
          </div>
          <div className="mt-2">
            <button className="text-sm text-blue-500 hover:text-blue-800" disabled={isLoading}>
              Forgot password?
            </button>
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <button
            id="ok-btn"
            className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;