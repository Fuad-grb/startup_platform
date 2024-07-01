import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.dispatchEvent(new CustomEvent('unauthorized'));
          break;
        case 404:
          console.error('404 Error: Resource not found', error.config.url);
          break;
        default:
          console.error('API error:', error.response.status, error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export const login = (username, password) => {
  return apiService.post('token/', { username, password });
};

export const register = (username, email, password, user_type) => {
  return apiService.post('users/register/', { username, email, password, user_type });
};

export const getUserProfile = () => {
  console.log('Sending request to:', `${API_URL}api/users/me/`);
  return apiService.get('users/me/').then(response => {
    console.log('Response:', response);
    return response;
  }).catch(error => {
    console.error('Error:', error.response || error);
    throw error;
  });
};

export const getStartups = () => {
  return apiService.get('startups/');
};

export default apiService;