// src/api/axiosConfig.js
import axios from 'axios';

// Read from runtime system environment if available, fallback to Vite env
let API_URL;
if (import.meta.env.DEV) {
  API_URL = import.meta.env.VITE_API_URL;
} else {
  API_URL =window.env.API_URL
}

 

// Use API_URL to create axios instance...

console.log('API_URL being used:', API_URL);

// Create axios instance with selected base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { API_URL };
export default axiosInstance;
