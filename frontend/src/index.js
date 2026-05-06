import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from 'axios';

// ==============================================
// 🚀 PRODUCTION DEPLOYMENT SETUP
// Automatically route all "localhost" API calls to 
// the production server if deployed.
// ==============================================
const API_URL = process.env.REACT_APP_API_URL || "https://waste2decor-backend-kmqa.onrender.com";



axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("http://localhost:5001")) {
    config.url = config.url.replace("http://localhost:5001", API_URL);
  }
  return config;
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
