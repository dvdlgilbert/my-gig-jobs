import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Fix module resolution error by removing file extension.
import App from './App';
import './index.css';

console.log("APP STARTED");
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

