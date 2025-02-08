import React, { useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';


const TabletCloseCase = () => {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/', { replace: true });
      window.location.reload();
    }, 300);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      <div className="flex-1 ">
        <div className={`min-h-screen flex items-center justify-center p-6 ${
          isExiting ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}>
          <div className="max-w-[800px] w-full">
            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                  <IoCheckmarkCircle className="text-green-500 text-6xl" />
                </div>
              </div>

              {/* Text Content */}
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Case Closed Successfully
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-[500px] mx-auto">
                The patient case has been closed and all relevant information has been saved in your records.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-gray-600 text-sm mb-2">Total Time</h3>
                  <p className="text-2xl font-bold text-gray-800">45 mins</p>
                </div>
                
                
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-[#3973EB] text-white rounded-xl hover:bg-blue-600 transition-colors text-lg font-medium"
                >
                  Back to Home
                </button>
                
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletCloseCase; 