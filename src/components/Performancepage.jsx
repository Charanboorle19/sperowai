import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import PerformanceGrowth from './PerformanceGrowth';
import PerformanceGraph from './PerformanceGraph';
import { useNavigate } from 'react-router-dom';

const PerformancePage = ({ onNavigate, isTabletView = false }) => {
  const navigate = useNavigate();
  let content;

  // If it's tablet/desktop view, show modified layout
  if (isTabletView) {
    content = (
      <div className="space-y-8">
        {/* Performance Growth Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PerformanceGrowth />
          <PerformanceGraph />
        </div>
      </div>
    );
  } else {
    // Mobile view
    content = (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        {/* Back Button - Only for mobile */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600 text-xl" />
        </button>

        <div className="space-y-6">
          <PerformanceGrowth />
        </div>
      </div>
    );
  }

  return content;
};

export default PerformancePage;