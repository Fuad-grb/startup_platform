import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import StartupList from './components/StartupList';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import './App.css';


function App() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [navigate]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/startups" element={<StartupList />} />
        <Route path="/profile/*" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/login" element={<Login onRegister={handleRegisterClick} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
