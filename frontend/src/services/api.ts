import axios from 'axios';

// IMPORTANT: Django development server only supports HTTP, not HTTPS
// If you're accessing this through https://localhost:3000, your browser will try to use HTTPS for API calls too
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api/';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;