import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Fix module resolution error by adding file extension.
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
