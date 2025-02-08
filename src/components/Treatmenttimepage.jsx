import React from 'react';
import { FaClock, FaUserClock, FaChartLine, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TreatmentTimePage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const timeDistribution = [
    { range: 'Quick Visit', duration: '0-15 min', count: 450, percentage: '35%', color: 'bg-green-100 text-green-600' },
    { range: 'Standard', duration: '15-30 min', count: 580, percentage: '45%', color: 'bg-blue-100 text-blue-600' },
    { range: 'Extended', duration: '30+ min', count: 258, percentage: '20%', color: 'bg-orange-100 text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[440px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-50 to-white shadow-sm border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors sm:hidden"
              >
                <FaArrowLeft className="text-gray-700 text-xl" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Treatment Time Analysis</h1>
              <div className="w-10"></div>
            </div>

            {/* Time Overview */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-[#3973eb]">18 min</div>
                  <div className="text-sm text-gray-500">Average Time</div>
                </div>
                <FaClock className="text-4xl text-[#3973eb] opacity-20" />
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                
                <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#3973eb] rounded-full transition-all duration-500"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Time Distribution Cards */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Time Distribution</h2>
            <div className="grid grid-cols-3 gap-3">
              {timeDistribution.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-3">
                  <div className={`${item.color} w-10 h-10 rounded-full flex items-center justify-center mb-2`}>
                    <FaUserClock className="text-lg" />
                  </div>
                  <div className="text-lg font-semibold">{item.count}</div>
                  <div className="text-xs text-gray-500">{item.duration}</div>
                  <div className="text-sm font-medium mt-1">{item.percentage}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Time Analysis</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FaChartLine className="text-purple-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600">Peak Hours</h3>
                </div>
                <div className="text-2xl font-bold text-[#3973eb]">10 AM - 2 PM</div>
                <div className="text-xs text-gray-500">Highest patient flow</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaClock className="text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600">Fastest Time</h3>
                </div>
                <div className="text-2xl font-bold text-[#3973eb]">8 min</div>
                <div className="text-xs text-gray-500">Regular checkups</div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 col-span-2">
                <div className="flex items-center justify-between">
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Total Cases</div>
                    <div className="text-2xl font-bold text-gray-800">124</div>
                    <div className="text-xs text-green-500">+12% from yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentTimePage; 