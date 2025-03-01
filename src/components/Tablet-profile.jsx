import React, { useState } from 'react';
import { IoMoon, IoLogOut } from 'react-icons/io5';
import { FaUserCircle, FaBell, FaChevronRight, FaUser, FaEnvelope, FaEdit } from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Profile from '../assets/doctor.jpg';
import { profileData, clearProfileData } from '../data/profileData';
import { useNavigate } from 'react-router-dom';
import Landpage from './Landpage';
import TabletHeader from './Tablet-header';
import apiService from '../services/api/apiService';

const TabletProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const email = localStorage.getItem('user_email');
  const [requestSent, setRequestSent] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('jwt_token');
      navigate('/landpage');
    }, 2000);
  };

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setIsRequestLoading(true);
    try {
      // Add your API call here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setRequestSent(true);
    } catch (error) {
      console.error('Request access error:', error);
    } finally {
      setIsRequestLoading(false);
    }
  };

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="w-64 h-64">
          <DotLottieReact
            src="https://lottie.host/07ae7588-f68b-4d0f-ab7f-bf62071bf857/HN3niWc2Jx.lottie"
            loop={false}
            autoplay
          />
        </div>
        <p className="text-xl font-medium text-gray-700 -mt-10">Logging out...</p>
      </div>
    );
  }

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
          <div className="bg-[#3973EB] text-white shadow-sm">
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
                  <h1 className="text-3xl font-semibold mb-2 text-white">{username}</h1>
                  <p className="text-white/80 text-lg mb-1">@{username}</p>
                  <p className="text-white/80 mb-4">{profileData.role}</p>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Request Access Block */}
          <div className="bg-white p-8 rounded-xl text-gray-800 shadow-sm mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Request Profile Changes
                </h2>
                <p className="text-gray-600">
                  To update your profile information, email, or password, please submit a request.
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <FaEdit className="text-gray-600 text-xl" />
              </div>
            </div>

            {requestSent ? (
              <div className="bg-gray-100 p-6 rounded-xl text-center">
                <p className="text-gray-800 text-lg mb-4">Request has been sent please wait to confirm</p>
                <DotLottieReact
                  src="https://lottie.host/ad9c421b-201a-4d0b-bdcd-d9521635e796/6cDY3LRDr4.lottie"
                  loop
                  autoplay
                  style={{ width: '150px', height: '150px', margin: '0 auto' }}
                />
              </div>
            ) : (
              <form onSubmit={handleRequestAccess} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Professional Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 outline-none transition-all"
                    placeholder="Enter your professional email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    What changes do you need?
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 outline-none transition-all"
                    placeholder="Describe the changes you need (e.g., update email, change password, modify profile info)"
                    rows="4"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
                  disabled={isRequestLoading}
                >
                  {isRequestLoading ? (
                    <DotLottieReact
                      src="https://lottie.host/ad9c421b-201a-4d0b-bdcd-d9521635e796/6cDY3LRDr4.lottie"
                      loop
                      autoplay
                      style={{ width: '24px', height: '24px', margin: '0 auto' }}
                    />
                  ) : (
                    'Submit Request'
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  We'll review your request and get back to you shortly
                </p>
              </form>
            )}
          </div>

          {/* Logout Button */}
          <div className="mt-10 flex justify-center">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-8 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
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
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center">
            <DotLottieReact
              src="https://lottie.host/ad9c421b-201a-4d0b-bdcd-d9521635e796/6cDY3LRDr4.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
            <p className="text-gray-800 text-lg font-medium mt-4">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabletProfile; 