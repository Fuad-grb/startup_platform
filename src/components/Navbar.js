import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout, error } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              {/* ... (logo) ... */}
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="text-gray-800 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link to="/startups" className="text-gray-800 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Startups</Link>
                {user && (
                  <Link to="/profile" className="text-gray-800 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-800">Welcome, {user.username}!</span>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setShowRegister(true)} variant="outline">
                  Register
                </Button>
                <Button onClick={() => setShowLogin(true)} variant="primary">
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onRegister={() => {setShowLogin(false); setShowRegister(true);}}
        />
      )}
      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)} 
          onLogin={() => {setShowRegister(false); setShowLogin(true);}}
        />
      )}
      {error && !showLogin && !showRegister && (
        <div className="text-center mt-2 text-red-500">
          Error: {error}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
