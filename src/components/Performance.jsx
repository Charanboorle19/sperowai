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
import { apiService } from '../services/api/apiService';
import format from 'date-fns/format';
import { getWeek, getYear, getMonth } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
  const [viewType, setViewType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [performanceData, setPerformanceData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentAverage, progressPercentage, fastestTime, longestTime } = useMetrics();

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
          break;
        case 'weekly':
          data = await apiService.getWeeklyPerformance(
            getYear(selectedDate),
            getMonth(selectedDate) + 1,
            getWeek(selectedDate)
          );
          break;
        case 'monthly':
          data = await apiService.getMonthlyPerformance(
            getYear(selectedDate),
            getMonth(selectedDate) + 1
          );
          break;
        case 'yearly':
          data = await apiService.getYearlyPerformance(getYear(selectedDate));
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#E5E7EB',
          drawBorder: false
        },
        ticks: {
          stepSize: 5,
          precision: 0,
          font: {
            size: 12
          },
          color: '#6B7280'
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#6B7280'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        titleFont: {
          size: 14,
          family: 'Raleway'
        },
        bodyFont: {
          size: 13,
          family: 'Raleway'
        },
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} Patients`;
          }
        },
        displayColors: false
      }
    }
  };

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

  return (
    <div className="bg-[#F8FAFC] p-6">
      <div className="flex flex-col gap-6">
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

          <div className="w-full h-[200px] relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200 max-w-[80%] text-center">
                  <div className="font-semibold mb-1">Error</div>
                  {error}
                </div>
            </div>
            )}
            {!loading && !error && !performanceData && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                <div className="text-gray-500 text-sm">No data available for the selected period</div>
            </div>
            )}
            <Line options={chartOptions} data={getChartData()} />
          </div>

          {/* Statistics Section */}
          {((viewType === 'daily' && dailyData) || 
            (viewType === 'weekly' && performanceData) || 
            (viewType === 'monthly' && performanceData) ||
            (viewType === 'yearly' && performanceData)) && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {/* Total Cases */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-lg font-semibold text-[#1662cc]">
                  {(() => {
                    switch(viewType) {
                      case 'daily':
                        return dailyData?.hourly_metrics?.reduce((sum, metric) => sum + metric.completed_cases, 0) || 0;
                      case 'weekly':
                        return performanceData?.totalCases || 0;
                      case 'monthly':
                        return performanceData?.totalCases || 0;
                      case 'yearly':
                        return performanceData?.totalCases || 0;
                    }
                  })()}
                </div>
                <div className="text-xs text-gray-500">Total Cases</div>
              </div>

              {/* Peak Cases */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-lg font-semibold text-[#1662cc]">
                  {(() => {
                    switch(viewType) {
                      case 'daily':
                        return Math.max(...(dailyData?.hourly_metrics?.map(metric => metric.completed_cases) || [0]));
                      case 'weekly':
                        return Math.max(...(performanceData?.treatmentTimes || []));
                      case 'monthly':
                        return Math.max(...(performanceData?.treatmentTimes || []));
                      case 'yearly':
                        return Math.max(...(performanceData?.treatmentTimes || []));
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

              {/* Average Cases */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-lg font-semibold text-[#1662cc]">
                  {(() => {
                    switch(viewType) {
                      case 'daily':
                        const totalCases = dailyData?.hourly_metrics?.reduce((sum, metric) => sum + metric.completed_cases, 0) || 0;
                        return (totalCases / 24).toFixed(1);
                      case 'weekly':
                        const weeklyTotalCases = performanceData?.treatmentTimes?.reduce((sum, time) => sum + time, 0) || 0;
                        return (weeklyTotalCases / 7).toFixed(1);
                      case 'monthly':
                        const monthlyTotalCases = performanceData?.treatmentTimes?.reduce((sum, time) => sum + time, 0) || 0;
                        return (monthlyTotalCases / 30).toFixed(1);
                      case 'yearly':
                        const yearlyTotalCases = performanceData?.treatmentTimes?.reduce((sum, time) => sum + time, 0) || 0;
                        return (yearlyTotalCases / 365).toFixed(1);
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

        {/* Treatment Time Block */}
        <div className="bg-white max-lg:p-3 p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-800">
                {viewType === 'daily' ? 'Daily' : viewType === 'weekly' ? 'Weekly' : viewType === 'monthly' ? 'Monthly' : 'Yearly'} Average Treatment Time
            </span>
              <FaClock className="text-[#84CC16] text-xl" />
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="text-3xl font-bold text-[#1662cc]">
                {currentAverage} min
              </div>
              <div className="text-sm text-gray-500">
                {viewType === 'daily' ? 'Daily' : viewType === 'weekly' ? 'Weekly' : viewType === 'monthly' ? 'Monthly' : 'Yearly'} Average
              </div>
              
              <div className="w-full h-2 bg-gray-100 rounded-full mt-4">
                <div 
                  className="h-full bg-[#1662cc] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-[#24844e]">
                  {fastestTime} min
                </div>
                <div className="text-xs text-gray-500">Fastest</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-[#1662cc]">
                  {currentAverage} min
                </div>
                <div className="text-xs text-gray-500">Average</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-[#dc2626]">
                  {longestTime} min
                </div>
                <div className="text-xs text-gray-500">Longest</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
