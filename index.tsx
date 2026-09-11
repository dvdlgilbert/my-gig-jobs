import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker AFTER React mounts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceworker.js')
    .catch(err => console.error('Service worker registration failed:', err));
}


