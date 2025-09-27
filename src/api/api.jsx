import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'https://dev.tallaam.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor لإضافة توكن JWT إلى كل طلب مصادق عليه
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (accessToken) {
            // تأكد من أن هذا الهيدر يتطابق مع ما يتوقعه الـ Backend (authJwt.js)
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- وظائف Auth ---
export const login = (phone, password) => api.post('/auth/login', { phone, password });