import api from './axiosConfig';

export const apiService = {
    // Auth endpoints
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
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
            const token = localStorage.getItem('jwt_token');
            const response = await api.post('/auth/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.removeItem('jwt_token');
            return response.data;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // Example of a protected route
    getProtectedData: async () => {
        const token = localStorage.getItem('jwt_token');
        const response = await api.get('/protected-route', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Add your other API endpoints here
    processMedicalRecord: async (file) => {
        try {
            const token = localStorage.getItem('jwt_token');
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post('/api/process-medical-record', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 300000 // 5 minutes timeout
            });
            return response.data;
        } catch (error) {
            console.error('Process medical record error:', error);
            throw error;
        }
    },

    visualize: async (data) => {
        const token = localStorage.getItem('jwt_token');
        const response = await api.post('/api/visualize', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    searchGemini: async (query) => {
        const token = localStorage.getItem('jwt_token');
        const response = await api.get(`/gemini/search?q=${query}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    closeConsultation: async (recordId) => {
        const token = localStorage.getItem('jwt_token');
        const response = await api.post(`/api/close-consultation/${recordId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    getYearlyPerformanceStats: async () => {
        try {
            const response = await api.get('/api/performance/stats/yearly');
            return response.data;
        } catch (error) {
            console.error('Error fetching yearly performance stats:', error);
            throw error;
        }
    },

    getDailyPerformance: async (date) => {
        try {
            const response = await api.get(`/api/performance/daily?date=${date}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching daily performance:', error);
            throw error;
        }
    },

    getWeeklyPerformance: async (year, month, week) => {
        try {
            const response = await api.get(`/api/performance/stats/weekly`, {
                params: { year, month, week }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching weekly performance:', error);
            throw error;
        }
    },

    getMonthlyPerformance: async (year, month) => {
        try {
            const response = await api.get(`/api/performance/stats/monthly`, {
                params: { year, month }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching monthly performance:', error);
            throw error;
        }
    },

    getYearlyPerformance: async (year) => {
        try {
            const response = await api.get(`/api/performance/stats/yearly`, {
                params: { year }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching yearly performance:', error);
            throw error;
        }
    },

    chatWithAI: async (question) => {
        try {
            const response = await api.post('/api/chat-with-ai', { question });
            return response.data.response;
        } catch (error) {
            console.error('Error in chatWithAI:', error);
            throw error;
        }
    }
};

export default apiService;