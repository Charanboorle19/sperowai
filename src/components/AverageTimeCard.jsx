import React from 'react';
import { useNavigate } from 'react-router-dom';

const AverageTimeCard = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  return (

    <div 
      onClick={() => navigate('/Treatment Time Range')}
      className={`bg-white rounded-[20px] p-6  hover:shadow-md transition-all duration-300 relative cursor-pointer ${className}`}
    >

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FFF4E5] rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-orange-500">
              <path fill="currentColor" d="M12 20A8 8 0 0 0 20 12A8 8 0 0 0 12 4A8 8 0 0 0 4 12A8 8 0 0 0 12 20M12 2A10 10 0 0 1 22 12A10 10 0 0 1 12 22C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Treatment Time Range</h2>
            <p className="text-sm text-gray-500">Time spent per patient</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="space-y-2">
          <span className="text-sm text-gray-500">Average Time</span>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-800">18</span>
            <span className="text-sm text-gray-500 ml-1">min</span>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default AverageTimeCard; 