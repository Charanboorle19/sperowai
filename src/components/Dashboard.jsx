import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PerformanceMetricCard from './PerformanceMetricCard';
import TreatmentTimeBlock from './TreatmentTimeBlock';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-swing-in-left">
      <div className="max-w-[440px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-50 to-white shadow-sm border-b animate-swing-in-top">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="text-gray-700 text-xl" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
              <div className="w-10"></div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 animate-swing-in-top delay-100">
          <PerformanceMetricCard />
          <TreatmentTimeBlock />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 