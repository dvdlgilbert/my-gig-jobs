import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Fix module resolution error by removing file extension.
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <react.strictmode>
    <app/>
  </React.StrictMode>,
);


