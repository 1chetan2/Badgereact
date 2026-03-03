import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5202/api',
    // Set modern clean defaults if necessary (not UI related but good practice)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token to the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear localStorage and redirect to login page
            localStorage.removeItem('token');
            // Assuming modern and clean UX: user logic can handle redirection,
            // but for a global catch, window location redirect is robust.
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
