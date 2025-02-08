import React from 'react';
import { FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const PerformanceCard = ({ onNavigate, className = '' }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleClick = () => {
    if (isMobile) {
      navigate('/performance');
    } else {
      onNavigate('performance');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-white rounded-[20px] p-6 hover:shadow-md transition-all duration-300 relative cursor-pointer ${className}`}
    >
      <div className="flex items-center justify-between mb-8 ">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <FaChartLine className="text-green-500 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Efficiency Metrics</h2>
            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="space-y-2">
          <span className="text-sm text-gray-500">Patient Growth</span>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-800">+20</span>
            <span className="text-sm text-gray-500 ml-1">patients</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm text-gray-500">From Last Month</span>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-green-600">+12.5</span>
            <span className="text-sm text-gray-500 ml-1">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;