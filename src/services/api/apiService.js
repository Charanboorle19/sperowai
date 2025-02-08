import api from './axiosConfig';

export const apiService = {
    // Auth endpoints
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });
            if (response.data.token) {
                localStorage.setItem('jwt_token', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            localStorage.removeItem('jwt_token');
            return response.data;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // Example of a protected route
    getProtectedData: async () => {
        const response = await api.get('/protected-route');
        return response.data;
    },

    // Add your other API endpoints here
    processMedicalRecord: async (data) => {
        const response = await api.post('/api/process-medical-record', data);
        return response.data;
    },

    visualize: async (data) => {
        const response = await api.post('/api/visualize', data);
        return response.data;
    },

    searchGemini: async (query) => {
        const response = await api.get(`/gemini/search?q=${query}`);
        return response.data;
    },

    closeConsultation: async (recordId) => {
        const response = await api.post(`/api/close-consultation/${recordId}`);
        return response.data;
    },

    getYearlyPerformanceStats: async () => {
        const response = await api.get('/api/performance/stats/yearly');
        return response.data;
    }
};

export default apiService;
