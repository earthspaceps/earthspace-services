import axios from 'axios';

// In production (Render/Vercel), VITE_API_URL is set to the backend URL e.g. https://earthspace-api.onrender.com
// In development, '/api' is used with Vite's proxy redirecting to localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('es_access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't redirect if the error is from a login attempt itself
        const isLoginRequest = error.config.url.includes('/auth/login') ||
            error.config.url.includes('/auth/register') ||
            error.config.url.includes('/auth/verify-otp');

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem('es_access_token');
            localStorage.removeItem('es_refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
