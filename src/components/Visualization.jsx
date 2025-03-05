import React from 'react';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
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
  const visualizations = useSelector((state) => state.medicalRecord.visualizations || []);

  const formatChartData = (visualization) => {
    if (!visualization) return null;

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

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <CardHeader 
        title="Visualizations"
        section="visualization"
      />
      
      {!isCollapsed && (
        <div className="p-4">
          <div className="bg-gray-50 rounded-xl p-4">
            {visualizations.length > 0 ? (
              <div className="space-y-6">
                {visualizations.map((visualization, index) => {
                  const chartConfig = formatChartData(visualization);
                  return (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                      <div style={{ height: '400px', position: 'relative' }}>
                        {chartConfig && React.createElement(chartComponentMap[chartConfig.type] || Line, {
                          data: chartConfig.data,
                          options: chartConfig.options
                        })}
                      </div>
                      {visualization.clinical_significance && (
                        <div className="mt-4 text-sm text-gray-600">
                          <strong>Clinical Significance:</strong> {visualization.clinical_significance}
                        </div>
                      )}
                    </div>
                  );
                })}
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