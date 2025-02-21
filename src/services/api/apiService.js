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
        const token = localStorage.getItem('jwt_token');
        const response = await api.get('/api/performance/stats/yearly', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    chatWithAI: async (question) => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('https://sperowai.onrender.com/api/chat-with-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get AI response');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error in chatWithAI:', error);
            throw error;
        }
    }
};

export default apiService;
