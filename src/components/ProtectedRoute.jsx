import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyToken = () => {
            const token = localStorage.getItem('jwt_token');
            
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Convert to seconds

                if (decodedToken.exp && decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);
                } else {
                    // Token has expired
                    localStorage.removeItem('jwt_token');
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                localStorage.removeItem('jwt_token');
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // You can replace this with a proper loading component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
