import { useState, useEffect } from 'react';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState({
    avg_minutes: 0,
    max_minutes: 0,
    min_minutes: 0,
    total_consultations: 0
  });

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}h ${mins}m`;
    }
  };

  const calculateProgress = () => {
    const maxExpectedTime = 240; // 4 hours as maximum expected time
    const progress = (metrics.avg_minutes / maxExpectedTime) * 100;
    return Math.min(progress, 100); // Cap at 100%
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('https://sperowai.onrender.com/api/metrics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return {
    metrics,
    formatTime,
    calculateProgress
  };
};
