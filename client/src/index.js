// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Chỉ import AuthProvider, không cần AuthContext

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Sử dụng AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);