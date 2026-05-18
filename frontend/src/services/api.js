// src/services/api.js
// Centralized Axios instance for all API calls

import axios from 'axios';

// Base URL: uses Vite proxy in dev, environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backchodi-925l.onrender.com';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (unauthorized) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---- Auth Services ----
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// ---- Employee Services ----
export const employeeService = {
  addEmployee: (data) => api.post('/employees', data),
  getEmployees: () => api.get('/employees'),
  searchEmployees: (params) => api.get('/employees/search', { params }),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
};

// ---- AI Services ----
export const aiService = {
  getRecommendation: (data) => api.post('/ai/recommend', data),
  getRankedEmployees: (data) => api.post('/ai/rank', data),
};

export default api;
