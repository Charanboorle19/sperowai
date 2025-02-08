import React from 'react';
import { IoMoon, IoLogOut, IoArrowBack } from 'react-icons/io5';
import { FaUserCircle, FaChevronRight } from 'react-icons/fa';
import Profile from '../assets/doctor.jpg';
import { profileData, clearProfileData } from '../data/profileData';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api/apiService';

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local storage and navigate, even if API call fails
      localStorage.removeItem('jwt_token');
      navigate('/landing');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const profileInfo = {
    name: profileData.name,
    username: profileData.username,
    image: Profile,
    role: profileData.role
  };

  const menuItems = [
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
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-slideUp">
      {/* Header with Profile Info */}
      <div className="bg-[#3973EB] text-white rounded-b-[15px] shadow-lg">
        <div className="px-4 py-6">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors mb-4"
          >
            <IoArrowBack className="text-white text-xl" />
          </button>

          {/* Profile Info */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img 
                src={profileInfo.image} 
                alt={profileInfo.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold mb-1">{profileInfo.name}</h2>
            <p className="text-white/80 text-sm mb-1">@{profileInfo.username}</p>
            <p className="text-white/80 text-sm mb-3">{profileInfo.role}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[440px] mx-auto px-4 py-6">
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <p className="text-gray-500 text-sm">{item.value}</p>
                  </div>
                </div>
                {item.hasChevron && (
                  <FaChevronRight className="text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <IoLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Version 1.0.0</p>
          <p> 2024 Sperow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
