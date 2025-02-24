import React, { useState } from 'react';
import { IoMoon, IoLogOut } from 'react-icons/io5';
import { FaUserCircle, FaBell, FaChevronRight, FaUser, FaEnvelope } from 'react-icons/fa';
import Profile from '../assets/doctor.jpg';
import { profileData, clearProfileData } from '../data/profileData';
import { useNavigate } from 'react-router-dom';
import Landpage from './Landpage';
import TabletHeader from './Tablet-header';
import apiService from '../services/api/apiService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const TabletProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const email = localStorage.getItem('user_email');

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log("Logging out...");
      await apiService.logout();
      console.log("Logout successful.");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local storage and navigate, even if API call fails
      localStorage.removeItem('jwt_token');
      navigate('/landpage');
    }
  };

  return (
    <div className="flex">
      <TabletHeader />
      <div className="flex-1 ml-[80px]">
        <div className="min-h-screen bg-[#F8FAFC] p-8 animate-swing-in-top">
          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Header with Profile Info */}
          <div className="bg-[#3973EB] text-white">
            <div className="max-w-[1200px] mx-auto px-8 py-10 ">
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <img 
                    src={Profile} 
                    alt={username} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold mb-2">{username}</h1>
                  <p className="text-white/80 text-lg mb-1">@{username}</p>
                  <p className="text-white/80 mb-4">{profileData.role}</p>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-[1200px] mx-auto px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'theme',
                  icon: <IoMoon className="text-gray-600 text-xl" />,
                  label: 'Theme',
                  value: 'Light',
                  hasChevron: true
                },
                
                {
                  id: 'cases',
                  icon: <FaUserCircle className="text-gray-600 text-xl" />,
                  label: 'Completed cases',
                  value: '24',
                  hasChevron: true
                },
              ].map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="text-lg font-semibold text-gray-700">{item.label}</span>
                    </div>
                    {item.hasChevron && (
                      <FaChevronRight className="text-gray-400" />
                    )}
                  </div>
                  <div className="pl-16">
                    <span className="text-2xl font-bold text-gray-800">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Logout Button */}
            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => {
                  handleLogout();
                }}
                className="flex items-center gap-2 px-8 py-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
              >
                <IoLogOut className="text-xl" />
                <span>Logout</span>
              </button>
            </div>

            {/* Version Info */}
            <div className="mt-10 text-center text-gray-400">
              <p>Version 1.0.0</p>
              <p> 2024 Sperow. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center">
            <DotLottieReact
              src="https://lottie.host/07ae7588-f68b-4d0f-ab7f-bf62071bf857/HN3niWc2Jx.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
            <p className="mt-4 text-xl text-gray-600 font-medium">Logging out...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabletProfile; 