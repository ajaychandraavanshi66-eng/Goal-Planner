
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Redirect to landing if not authenticated and not on public routes
const token = localStorage.getItem('token');
const currentPath = window.location.pathname;
const publicPaths = ['/landing', '/signup', '/signin'];

if (!token && !publicPaths.includes(currentPath) && currentPath !== '/') {
  // Will be handled by ProtectedRoute component
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
