import React from 'react';
import { FaChartLine, FaClock } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import PerformanceGraph from './PerformanceGraph';

const PerformanceGrowth = ({ onNavigate }) => {
  const handleBack = () => {
    onNavigate('dashboard');
  };

  const recentConsultations = [
    {
      name: "Sarah Johnson",
      date: "Today",
      time: "10:30 AM",
      status: "Completed"
    },
    {
      name: "Michael Chen",
      date: "Today",
      time: "9:15 AM",
      status: "Completed"
    },
    {
      name: "Emily Davis",
      date: "Yesterday",
      time: "4:45 PM",
      status: "Completed"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[440px] mx-auto p-4">
        {/* Back Button */}
        

        {/* Growth Card */}
        <div className="flex justify-center w-full">
          <div className="bg-[#F1F2E8] p-6 rounded-2xl shadow-sm mb-6 w-full">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                    <FaChartLine className="text-[#3973EB] text-lg" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">Consultation Growth</h3>
                    <p className="text-sm text-gray-600">Compared to Last Month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-3xl font-bold text-gray-800">+20%</span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex items-center text-green-600 text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                          <path fill="currentColor" d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
                        </svg>
                        <span className="font-medium">5%</span>
                      </div>
                      <span className="text-sm text-gray-600">vs last period</span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-end h-full">
                    {/* Mini Graph */}
                    <div className="flex items-end gap-1 h-[40px]">
                      {[30, 45, 35, 50, 40, 60].map((height, index) => (
                        <div
                          key={index}
                          style={{ height: `${height}%` }}
                          className={`w-1 rounded-full ${
                            index === 5 ? 'bg-[#3973EB]' : 'bg-[#3973EB]/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Graph */}
        <div className="flex justify-center w-full">
          <div className="w-full">
            <PerformanceGraph />
          </div>
        </div>

        {/* Recent Consultations */}
        
      </div>
    </div>
  );
};

export default PerformanceGrowth; 