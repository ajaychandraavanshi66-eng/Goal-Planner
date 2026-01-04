// Runtime API configuration
// This file is loaded before the app to set the API URL
window.API_CONFIG = {
  baseUrl: window.location.hostname.includes('onrender.com') 
    ? 'https://goal-planner-backend-pm5i.onrender.com/api'
    : 'http://localhost:5000/api'
};

