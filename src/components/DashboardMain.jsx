import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaClock, FaCalendarCheck } from 'react-icons/fa';
import DashboardHeader from './Dashboard-header';
import PerformanceCard from './PerformanceCard';
import AverageTimeCard from './AverageTimeCard';

const DashboardMain = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: FaUserMd, title: "Total Patients", value: "1,234", trend: "+12.5%" },
    { icon: FaClock, title: "Avg Treatment Time", value: "18 min", trend: "-5.2%" },
    { icon: FaCalendarCheck, title: "Completed Cases", value: "892", trend: "+8.1%" }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="px-4 w-full min-w-[320px] max-w-[750px] mx-auto mt-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-[20px] p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <stat.icon className="text-blue-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                      <span className={`text-xs px-2 py-2 rounded-full ${
                        stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <PerformanceCard />
          <AverageTimeCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardMain; 