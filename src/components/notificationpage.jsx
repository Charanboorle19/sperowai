import React from 'react';
import { IoArrowBack } from 'react-icons/io5';

const NotificationPage = () => {
  const handleBack = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-swing-in-top">
      <div className="max-w-[440px] mx-auto">
        {/* Header */}
        <div className="bg-[#3973EB] text-white rounded-b-[15px] shadow-lg">
          <div className="px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <IoArrowBack className="text-white text-xl" />
              </button>
              <h1 className="text-xl font-semibold">Notifications</h1>
              <div className="w-10"></div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-4">
          {/* Add your notification items here */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-800">No new notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
