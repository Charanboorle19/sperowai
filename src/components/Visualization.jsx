import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { store } from '../store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Map visualization types to Chart components
const chartComponentMap = {
  'Line Chart': Line,
  'Bar Chart': Bar,
  'Pie Chart': Pie,
  'Scatter Chart': Scatter,
  'Column Chart': Bar
};

const Visualization = ({ isCollapsed, CardHeader }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visualizations = useSelector((state) => {
    console.log('Full Redux State:', store.getState());
    console.log('Medical Record State:', state.medicalRecord);
    console.log('Visualizations from Redux:', state.medicalRecord.visualizations);
    return state.medicalRecord.visualizations || [];
  });

  // Debug logs
  useEffect(() => {
    console.log('Component mounted or visualizations updated');
    console.log('Current visualizations:', visualizations);
    console.log('Visualizations length:', visualizations.length);
    
    if (visualizations.length > 0) {
      console.log('First visualization:', visualizations[0]);
      console.log('Current visualization:', visualizations[currentIndex]);
    }
  }, [visualizations, currentIndex]);

  // Reset currentIndex when visualizations change
  useEffect(() => {
    if (currentIndex >= visualizations.length) {
      setCurrentIndex(0);
    }
  }, [visualizations, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < visualizations.length - 1 ? prev + 1 : prev));
  };

  const formatChartData = (visualization) => {
    if (!visualization) return null;
    console.log('Formatting visualization:', visualization);

    const { data, type, title } = visualization;
    const { x_axis, y_axis } = data;

    // Get reference range if it exists
    let referenceRange = null;
    if (y_axis.reference_ranges && y_axis.reference_ranges.length > 0) {
      const rangeStr = y_axis.reference_ranges[0];
      if (rangeStr && rangeStr.includes('-')) {
        const [min, max] = rangeStr.split('-').map(Number);
        referenceRange = { min, max };
      }
    }

    // Format data for Chart.js
    const chartData = {
      labels: x_axis.values,
      datasets: [
        {
          label: y_axis.label,
          data: y_axis.values.map(Number),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4,
          tension: 0.4
        }
      ]
    };

    // If reference range exists, add it as additional datasets
    if (referenceRange) {
      chartData.datasets.push(
        {
          label: 'Upper Limit',
          data: Array(x_axis.values.length).fill(referenceRange.max),
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderDash: [5, 5],
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Lower Limit',
          data: Array(x_axis.values.length).fill(referenceRange.min),
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderDash: [5, 5],
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        }
      );
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: x_axis.label
          },
          grid: {
            color: '#f3f4f6'
          }
        },
        y: {
          title: {
            display: true,
            text: y_axis.label
          },
          grid: {
            color: '#f3f4f6'
          }
        }
      }
    };

    return {
      type,
      data: chartData,
      options
    };
  };

  const currentVisualization = visualizations.length > 0 ? visualizations[currentIndex] : null;
  console.log('Current visualization:', currentVisualization);
  
  const chartConfig = currentVisualization ? formatChartData(currentVisualization) : null;
  console.log('Chart config:', chartConfig);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <CardHeader 
        title="Visualization"
        section="visualization"
      />
      
      {!isCollapsed && (
        <div className="p-4">
          <div className="bg-gray-50 rounded-xl p-4">
            {visualizations.length > 0 && currentVisualization ? (
              <div className="relative">
                <div className="aspect-square w-full bg-white rounded-lg shadow-sm p-4">
                  {chartConfig && (
                    <>
                      <div style={{ height: '400px', position: 'relative' }}>
                        {React.createElement(chartComponentMap[chartConfig.type] || Line, {
                          data: chartConfig.data,
                          options: chartConfig.options
                        })}
                      </div>
                      {currentVisualization.clinical_significance && (
                        <div className="mt-4 text-sm text-gray-600">
                          <strong>Clinical Significance:</strong> {currentVisualization.clinical_significance}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {visualizations.length > 1 && (
                  <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2">
                    <button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="p-2 rounded-full bg-white shadow-md disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentIndex === visualizations.length - 1}
                      className="p-2 rounded-full bg-white shadow-md disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-blue-500 text-3xl">📊</span>
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-1">No Visualizations Available</h3>
                <p className="text-xs text-gray-500">Process a medical record to view visualizations</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualization; 