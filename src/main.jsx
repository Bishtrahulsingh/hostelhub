import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';

// Set base URL for axios requests
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);