import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);

reportWebVitals();
