import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { Line } from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { apiService } from '../services/api/apiService';
import format from 'date-fns/format';
import { getWeek, getYear, getMonth } from 'date-fns';

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

  const [viewType, setViewType] = useState('daily'); // 'daily', 'weekly', 'monthly', or 'yearly'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);

  const { currentAverage, progressPercentage, fastestTime, longestTime } = useMetrics();
  const [dailyData, setDailyData] = useState(null);

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

  // Initialize chart data with default values
  const defaultChartData = {
    labels: [],
    datasets: [{
      label: 'Cases',
      data: [],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const fetchData = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let data;
      switch (viewType) {
        case 'daily':
          data = await apiService.getDailyPerformance(format(selectedDate, 'yyyy-MM-dd'));
          setDailyData(data);
          console.log(data);
          break;
        case 'weekly':
          data = await apiService.getWeeklyPerformance(
            getYear(selectedDate),
            getMonth(selectedDate) + 1,
            getWeek(selectedDate)
          );
          console.log(data);
          break;
        case 'monthly':
          data = await apiService.getMonthlyPerformance(
            getYear(selectedDate),
            getMonth(selectedDate) + 1
          );
          console.log(data);
          break;
        case 'yearly':
          data = await apiService.getYearlyPerformance(getYear(selectedDate));
          console.log(data);
          break;
      }
      setPerformanceData(data);
    } catch (err) {
      console.error(`Error fetching ${viewType} performance:`, err);
      setError(err.message || `Failed to fetch ${viewType} performance data`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data initially and when date/view type changes
  useEffect(() => {
    fetchData();
  }, [selectedDate, viewType]);

  // Auto-refresh data every 2 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, [selectedDate, viewType]);

  // Create chart data based on view type
  const getChartData = () => {
    switch (viewType) {
      case 'daily':
        if (!dailyData?.hourly_metrics) return defaultChartData;
        return {
          labels: dailyData.hourly_metrics.map(metric => metric.time_range),
          datasets: [{
            label: 'Cases',
            data: dailyData.hourly_metrics.map(metric => metric.completed_cases),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };

      case 'weekly':
        if (!performanceData?.daily_metrics) return defaultChartData;
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return {
          labels: weekDays,
          datasets: [{
            label: 'Cases',
            data: weekDays.map(day => performanceData.daily_metrics[day]),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };

      case 'monthly':
        if (!performanceData?.weekly_metrics) return defaultChartData;
        return {
          labels: Object.keys(performanceData.weekly_metrics),
          datasets: [{
            label: 'Cases',
            data: Object.values(performanceData.weekly_metrics),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };

      case 'yearly':
        if (!performanceData?.monthly_metrics) return defaultChartData;
        const monthOrder = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return {
          labels: monthOrder,
          datasets: [{
            label: 'Cases',
            data: monthOrder.map(month => performanceData.monthly_metrics[month] || 0),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };

      default:
        return defaultChartData;
    }
  };

  // Chart options

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  // Update DatePicker configuration based on viewType
  const getDatePickerConfig = () => {
    switch (viewType) {
      case 'daily':
        return {
          showMonthYearPicker: false,
          showYearPicker: false,
          dateFormat: "MMMM d, yyyy"
        };
      case 'weekly':
        return {
          showWeekNumbers: false,
          dateFormat: "'Week' w, MMM yyyy",
          showMonthYearPicker: false,
          formatWeek: (date) => {
            const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const weekNumber = Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
            return `Week ${weekNumber}`;
          }
        };
      case 'monthly':
        return {
          showMonthYearPicker: true,
          showYearPicker: false,
          dateFormat: "MMMM yyyy"
        };
      case 'yearly':
        return {
          showYearPicker: true,
          dateFormat: "yyyy"
        };
      default:
        return {};
    }
  };

  // Update the format function to handle both daily and weekly data
  const formatChartData = (data) => {
    if (!data) return null;

    if (data.hourly_metrics) {
      // Format daily data
      return {
        labels: data.hourly_metrics.map(metric => metric.time_range),
        datasets: [{
          label: 'Completed Cases',
          data: data.hourly_metrics.map(metric => metric.completed_cases),
          fill: false,
          borderColor: '#22c55e',
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      };
    } else if (data.daily_metrics) {
      // Format weekly data
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return {
        labels: days,
        datasets: [{
          label: 'Completed Cases',
          data: days.map(day => data.daily_metrics[day]),
          fill: false,
          borderColor: '#22c55e',
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      };
    }
    return null;
  };

  return (
    <div className="bg-[#F8FAFC] p-6">
      <div className="grid grid-cols-2 max-lg:gap-3 gap-6">
        {/* Efficiency Metrics */}
        <div className="bg-white max-lg:p-3 p-6 rounded-2xl shadow-lg">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Time Range Options */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewType === type
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Date Picker */}
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                {...getDatePickerConfig()}
                className="bg-white border border-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                calendarClassName="shadow-lg rounded-lg border-0"
                showPopperArrow={false}
                maxDate={new Date()}
                customInput={
                  <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm hover:border-gray-300 transition-all duration-200">
                    <span>
                      {viewType === 'weekly' ? (
                        (() => {
                          const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                          const weekNumber = Math.ceil((selectedDate.getDate() + firstDayOfMonth.getDay()) / 7);
                          return `Week ${weekNumber}, ${format(selectedDate, 'MMM yyyy')}`;
                        })()
                      ) : (
                        format(selectedDate, getDatePickerConfig().dateFormat)
                      )}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                }
              />
            </div>
          </div>
          
          {/* Performance Graph */}
          {((viewType === 'daily' && dailyData) || 
            (viewType === 'weekly' && performanceData?.daily_metrics) || 
            (viewType === 'monthly' && performanceData?.weekly_metrics) ||
            (viewType === 'yearly' && performanceData?.monthly_metrics)) && (
            <div className="mt-6">
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[500px]">
                  <div className="h-[200px]">
                    <Line 
                      data={getChartData()} 
                      options={options} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Indicators */}
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

        {/* Treatment Time Block */}
        <div className="bg-white max-lg:p-3 p-6 rounded-2xl shadow-lg max-lg:h-[220px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="max-lg:text-xs text-lg font-semibold text-gray-800">
                {viewType === 'daily' ? 'Daily' : viewType === 'weekly' ? 'Weekly' : viewType === 'monthly' ? 'Monthly' : 'Yearly'} Average Treatment Time
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
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {((viewType === 'daily' && dailyData) || 
        (viewType === 'weekly' && performanceData) || 
        (viewType === 'monthly' && performanceData) ||
        (viewType === 'yearly' && performanceData)) && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-lg font-semibold text-[#1662cc]">
              {(() => {
                switch(viewType) {
                  case 'daily':
                    return (dailyData?.hourly_metrics?.reduce((sum, metric) => sum + metric.completed_cases, 0) || 0);
                  case 'weekly':
                    return (performanceData?.daily_metrics ? Object.values(performanceData.daily_metrics).reduce((sum, count) => sum + count, 0) : 0);
                  case 'monthly':
                    return (performanceData?.weekly_metrics ? Object.values(performanceData.weekly_metrics).reduce((sum, count) => sum + count, 0) : 0);
                  case 'yearly':
                    return (performanceData?.monthly_metrics ? Object.values(performanceData.monthly_metrics).reduce((sum, count) => sum + count, 0) : 0);
                  default:
                    return 0;
                }
              })()}
            </div>
            <div className="text-xs text-gray-500">Total Cases</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-lg font-semibold text-[#1662cc]">
              {(() => {
                switch(viewType) {
                  case 'daily':
                    return Math.max(...(dailyData?.hourly_metrics?.map(metric => metric.completed_cases) || [0]));
                  case 'weekly':
                    return Math.max(...(performanceData?.daily_metrics ? Object.values(performanceData.daily_metrics) : [0]));
                  case 'monthly':
                    return Math.max(...(performanceData?.weekly_metrics ? Object.values(performanceData.weekly_metrics) : [0]));
                  case 'yearly':
                    return Math.max(...(performanceData?.monthly_metrics ? Object.values(performanceData.monthly_metrics) : [0]));
                  default:
                    return 0;
                }
              })()}
            </div>
            <div className="text-xs text-gray-500">
              {viewType === 'daily' ? 'Peak Cases/Hour' 
                : viewType === 'weekly' ? 'Peak Cases/Day' 
                : viewType === 'monthly' ? 'Peak Cases/Week'
                : 'Peak Cases/Month'}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-lg font-semibold text-[#1662cc]">
              {(() => {
                switch(viewType) {
                  case 'daily':
                    return ((dailyData?.hourly_metrics?.reduce((sum, metric) => sum + metric.completed_cases, 0) || 0) / 24).toFixed(1);
                  case 'weekly':
                    return ((performanceData?.daily_metrics ? Object.values(performanceData.daily_metrics).reduce((sum, count) => sum + count, 0) : 0) / 7).toFixed(1);
                  case 'monthly':
                    const weeksInMonth = performanceData?.weekly_metrics ? Object.keys(performanceData.weekly_metrics).length : 1;
                    return ((performanceData?.weekly_metrics ? Object.values(performanceData.weekly_metrics).reduce((sum, count) => sum + count, 0) : 0) / weeksInMonth).toFixed(1);
                  case 'yearly':
                    const monthsInYear = performanceData?.monthly_metrics ? Object.keys(performanceData.monthly_metrics).length : 1;
                    return ((performanceData?.monthly_metrics ? Object.values(performanceData.monthly_metrics).reduce((sum, count) => sum + count, 0) : 0) / monthsInYear).toFixed(1);
                  default:
                    return '0.0';
                }
              })()}
            </div>
            <div className="text-xs text-gray-500">
              {viewType === 'daily' ? 'Avg Cases/Hour' 
                : viewType === 'weekly' ? 'Avg Cases/Day' 
                : viewType === 'monthly' ? 'Avg Cases/Week'
                : 'Avg Cases/Month'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabletPerformance;