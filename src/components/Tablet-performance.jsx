import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useMetrics } from './Performance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TabletPerformance = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [metrics, setMetrics] = useState({
    avg_minutes: 0,
    max_minutes: 0,
    min_minutes: 0,
    total_consultations: 0
  });
  const { currentAverage, progressPercentage, fastestTime, longestTime } = useMetrics();

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

  // Format minutes to a more readable format
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}h ${mins}m`;
    }
  };

  // Calculate progress percentage based on average time
  const calculateProgress = () => {
    const maxExpectedTime = 240; // 4 hours as maximum expected time
    const progress = (metrics.avg_minutes / maxExpectedTime) * 100;
    return Math.min(progress, 100); // Cap at 100%
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'white',
        titleColor: '#334155',
        bodyColor: '#334155',
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          title: () => 'Patients',
          label: (context) => `${context.parsed.y} patients`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          padding: 10,
          color: '#94a3b8'
        }
      },
      y: {
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        ticks: {
          stepSize: 20,
          padding: 10,
          color: '#94a3b8'
        }
      }
    }
  };

  const getData = () => {
    switch(timeRange) {
      case 'month':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            data: [25, 35, 45, 30, 40, 50, 35],
            borderColor: '#84CC16',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 200);
              gradient.addColorStop(0, 'rgba(132, 204, 22, 0.2)');
              gradient.addColorStop(1, 'rgba(132, 204, 22, 0)');
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#84CC16',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        };
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [20, 30, 40, 35, 45, 40, 30],
            borderColor: '#84CC16',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 200);
              gradient.addColorStop(0, 'rgba(132, 204, 22, 0.2)');
              gradient.addColorStop(1, 'rgba(132, 204, 22, 0)');
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#84CC16',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        };
      default:
        return {
          labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'],
          datasets: [{
            data: timeRange === 'today' ? [25, 35, 45, 30, 40, 50, 35] : [20, 30, 40, 35, 45, 40, 30],
            borderColor: '#84CC16',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 200);
              gradient.addColorStop(0, 'rgba(132, 204, 22, 0.2)');
              gradient.addColorStop(1, 'rgba(132, 204, 22, 0)');
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#84CC16',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        };
    }
  };

  return (
    <div className="bg-[#ebeeff] p-4 lg:p-6 rounded-2xl">
      <div className="grid grid-cols-2 max-lg:gap-3 gap-6">
        {/* Efficiency Metrics */}
        <div className="bg-white max-lg:p-3 p-6 rounded-2xl shadow-lg max-lg:h-[220px]">
          <div className="flex justify-between items-center max-lg:mb-2 mb-4">
            <h2 className="max-lg:text-xs text-lg font-semibold text-black">Efficiency Metrics</h2>
            <select 
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-white focus:outline-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          
          <div className="w-full h-[200px]">
            <Line options={options} data={getData()} />
          </div>
        </div>

        {/* Treatment Time Block */}
        <div className="bg-white max-lg:p-3 p-6 rounded-2xl shadow-lg max-lg:h-[220px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="max-lg:text-xs text-lg font-semibold text-gray-800">
                Average Treatment Time
              </span>
              <FaClock className="text-[#84CC16] max-lg:text-base text-xl" />
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="text-3xl font-bold text-[#1662cc]">
                {formatTime(metrics.avg_minutes)}
              </div>
              <div className="text-sm text-gray-500">
                Current Average ({metrics.total_consultations} consultations)
              </div>
              
              <div className="w-full h-2 bg-gray-100 rounded-full mt-4">
                <div 
                  className="h-full bg-[#1662cc] rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-[#24844e]">
                  {formatTime(metrics.min_minutes)}
                </div>
                <div className="text-xs text-gray-600">Fastest</div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-red-600">
                  {formatTime(metrics.max_minutes)}
                </div>
                <div className="text-xs text-gray-600">Longest</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 px-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">On Track</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Delayed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletPerformance; 