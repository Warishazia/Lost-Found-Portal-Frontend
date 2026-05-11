import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('[API Client] Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Client] Token attached to request');
    }
    return config;
  },
  (error) => {
    console.error('[API Client] Request error:', error.message);
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API Client] Unauthorized (401) - clearing authentication');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.warn('[API Client] Forbidden (403) - access denied');
    }

    if (error.response?.status === 500) {
      console.error('[API Client] Server error (500) - backend issue');
    }

    if (!error.response) {
      console.error('[API Client] Network Error:', {
        message: error.message,
        url: API_BASE_URL,
        hint: 'Backend server might be down or unreachable'
      });
    }

    return Promise.reject(error);
  }
);

export default api;
