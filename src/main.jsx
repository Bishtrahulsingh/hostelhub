import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';

// Set base URL for axios requests
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);