import axios from 'axios';

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.lingoarena.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiService.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global API errors (e.g. 401 Unauthorized)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Logic to clear auth and redirect
    }
    return Promise.reject(error);
  }
);

export default apiService;
