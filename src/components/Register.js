import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { register as apiRegister } from '../services/apiService';

const Register = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('startup');  // Добавлено поле user_type
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      console.log('Registering user...');
      const response = await apiRegister(username, email, password, userType);
      console.log('Full registration response:', response);
      if (response.status === 201) {
        console.log('User created successfully');
        onClose();
        onLogin();
      } else {
        console.error('Unexpected response status:', response.status);
        setError('Invalid registration response');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
        setError(err.response.data.detail || 'Failed to register. Please try again.');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please try again.');
      } else {
        console.error('Error setting up request:', err.message);
        setError(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Register</h3>
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
              type="email"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <input
              type="password"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
            >
              <option value="startup">Startup</option>
              <option value="investor">Investor</option>
              <option value="specialist">Specialist</option>
            </select>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
          <div className="mt-2">
            <button className="text-sm text-blue-500 hover:text-blue-800" onClick={onLogin}>
              Already have an account? Login
            </button>
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <button
            id="ok-btn"
            className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
