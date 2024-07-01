import React, { useState, useEffect } from 'react';
import api from '../services/apiService';
import Button from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    bio: '',
    interests: [],
    profile_picture: '',
    user_type: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/me/');
      const userData = response.data;
      userData.interests = userData.interests.map(interest => interest.name).join(', ');
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response && error.response.status === 401) {
        logout();
      } else {
        setError('An error occurred while fetching user data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = async () => {
    try {
      console.log('Updated fields:', updatedFields);
      if (updatedFields.interests) {
        const interestsArray = updatedFields.interests.split(',').map(name => name.trim());
        updatedFields.interests = interestsArray;
      }
      await api.patch('/users/me/', updatedFields); 
      setUpdatedFields({});
      fetchUserData();
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('An error occurred while saving user data. Please try again.');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      saveUserData(); 
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields({ ...updatedFields, [name]: value });
    if (name === 'interests') {
      const interestsArray = value.split(',').map(id => parseInt(id.trim(), 10));
      setUpdatedFields({ ...updatedFields, interests: interestsArray });
      setUser({ ...user, interests: interestsArray });
    } else {
      setUpdatedFields({ ...updatedFields, [name]: value });
      setUser({ ...user, [name]: value });
    }
  };

  if (loading) return <div className="text-center mt-10">Loading user data...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!user) return <div className="text-center mt-10">No user data available. Please log in.</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img 
          src={user.profile_picture || '/default-avatar.png'} 
          alt={user.username} 
          className="profile-avatar"
        />
        <div className="profile-info">
          {isEditing ? (
            <input 
              type="text" 
              name="username" 
              value={user.username} 
              onChange={handleInputChange} 
              className="edit-input"
            />
          ) : (
            <h1>{user.username}</h1>
          )}
          <p className="user-type">{user.user_type}</p>
        </div>
        <Button className="edit-profile-btn" onClick={handleEditToggle}>
          {isEditing ? 'Save' : 'Edit Profile'}
        </Button>
      </div>
      <div className="profile-body">
        <div className="info-section">
          <h2>Email</h2>
          {isEditing ? (
            <input 
              type="email" 
              name="email" 
              value={user.email} 
              onChange={handleInputChange} 
              className="edit-input"
            />
          ) : (
            <p>{user.email}</p>
          )}
        </div>
        <div className="info-section">
          <h2>Bio</h2>
          {isEditing ? (
            <textarea 
              name="bio" 
              value={user.bio} 
              onChange={handleInputChange} 
              className="edit-input"
            />
          ) : (
            <p>{user.bio || 'No bio provided'}</p>
          )}
        </div>
        <div className="info-section">
          <h2>Interests</h2>
          {isEditing ? (
            <input 
              type="text" 
              name="interests" 
              value={Array.isArray(user.interests) ? user.interests.join(', ') : user.interests} 
              onChange={handleInputChange} 
              className="edit-input"
            />
          ) : (
            <ul className="interests-list">
              {Array.isArray(user.interests) && user.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <li key={index} className="interest-tag">{interest}</li>
                ))
              ) : (
                <p>No interests specified</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
