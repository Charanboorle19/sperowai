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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Export these values so they can be used in Tablet-performance
export const useMetrics = () => {
  const [currentAverage, setCurrentAverage] = useState(10);
  const [progressPercentage, setProgressPercentage] = useState(65);
  const [fastestTime, setFastestTime] = useState(5);
  const [longestTime, setLongestTime] = useState(15);

  useEffect(() => {
    const updateMetrics = () => {
      // Replace with your actual calculations
      setCurrentAverage(Math.floor(Math.random() * 15) + 5);
      setProgressPercentage(Math.floor(Math.random() * 100));
      setFastestTime(Math.floor(Math.random() * 5) + 1);
      setLongestTime(Math.floor(Math.random() * 10) + 15);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 300000);
    return () => clearInterval(interval);
  }, []);

  return { currentAverage, progressPercentage, fastestTime, longestTime };
};

const Performance = () => {
  const [timeRange, setTimeRange] = useState('today');
  const { currentAverage, progressPercentage, fastestTime, longestTime } = useMetrics();

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
      default: // today and yesterday
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
    <div className="w-full min-w-[320px] max-w-[750px] mx-auto px-4">
      {/* Efficiency Metrics */}
      <div className="bg-white p-3 rounded-lg mb-4 shadow-sm animate-swing-in-top">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-black">Efficiency Metrics</h2>
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
        
        <div className="mt-3">
          <div className="w-full h-[200px]">
            <Line options={options} data={getData()} />
          </div>
        </div>
      </div>

      {/* Average Treatment Time Block */}
      <div className="bg-white p-3 rounded-lg shadow-sm animate-swing-in-top">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-800">
              Average Treatment Time
            </span>
            <FaClock className="text-[#84CC16] text-base" />
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="text-3xl font-bold text-[#1662cc]">10 min</div>
            <div className="text-sm text-gray-500">Current Average</div>
            
            <div className="w-full h-2 bg-gray-100 rounded-full mt-4">
              <div 
                className="h-full bg-[#1662cc] rounded-full transition-all duration-500"
                style={{ width: '65%' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-[#24844e]">5 min</div>
              <div className="text-xs text-gray-600">Fastest</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-red-600">15 min</div>
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
  );
};

export default Performance;
