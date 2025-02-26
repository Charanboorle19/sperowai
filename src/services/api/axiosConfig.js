import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'https://sperowai.onrender.com',
    timeout: 15000,
    withCredentials: false,  // Using token-based auth
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('user_email');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden - user doesn't have necessary permissions
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Server error
                    console.error('Server error');
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
        } else {
            // Error in request configuration
            console.error('Request error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
