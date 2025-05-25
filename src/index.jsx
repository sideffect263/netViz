import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import axios from 'axios';

// Set default base URL for API requests
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 