import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import axios from 'axios';

// Set default base URL for API requests based on environment
axios.defaults.baseURL = import.meta.env.DEV 
  ? 'http://localhost:5000'
  : 'https://netviz-backend.onrender.com';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 