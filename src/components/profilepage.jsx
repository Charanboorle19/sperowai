import React, { useState } from 'react';
import { IoMoon, IoLogOut, IoArrowBack } from 'react-icons/io5';
import { FaUserCircle, FaChevronRight } from 'react-icons/fa';
import Profile from '../assets/doctor.jpg';
import { profileData, clearProfileData } from '../data/profileData';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api/apiService';
import { useSelector, useDispatch } from 'react-redux';
import { clearMedicalRecord } from '../store/medicalRecordSlice';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = localStorage.getItem('username') || 'User';
  const email = localStorage.getItem('user_email');
  const [requestSent, setRequestSent] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('username');
      localStorage.removeItem('user_email');
      localStorage.removeItem('chat_history');
      localStorage.removeItem('medicalRecord');
      dispatch(clearMedicalRecord());
      navigate('/landpage');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setIsRequestLoading(true);
    try {
      // Replace with actual implementation to send request
      setRequestSent(true);
    } catch (error) {
      console.error('Request access error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <DotLottieReact
          src="https://lottie.host/ad9c421b-201a-4d0b-bdcd-d9521635e796/6cDY3LRDr4.lottie"
          loop
          autoplay
          style={{ width: '200px', height: '200px' }}
        />
        <p className="mt-4 text-xl text-gray-600 font-medium">Logging out...</p>
      </div>
    );
  }

  const profileInfo = {
    name: profileData.name,
    username: profileData.username,
    image: Profile,
    role: profileData.role
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-swing-in-left">
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
            <h2 className="text-xl font-semibold mb-1">{username}</h2>
            <p className="text-white/80 text-sm mb-1">{email}</p>
            <p className="text-white/80 text-sm mb-3">{profileInfo.role}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[440px] mx-auto px-4 py-6">
        {/* Request Access Block */}
        <div className="bg-white p-6 rounded-xl text-gray-800 mb-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3">
            Request Profile Changes
          </h2>
          <p className="text-gray-600 mb-6">
            To update your profile information, email, or password, please submit a request.
          </p>

          {requestSent ? (
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-gray-800 text-lg mb-4">Request has been sent please wait to confirm</p>
              <DotLottieReact
                src="https://lottie.host/ad9c421b-201a-4d0b-bdcd-d9521635e796/6cDY3LRDr4.lottie"
                loop
                autoplay
                style={{ width: '150px', height: '150px', margin: '0 auto' }}
              />
            </div>
          ) : (
            <form onSubmit={handleRequestAccess} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What changes do you need?
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 outline-none transition-all"
                  placeholder="Describe the changes you need (e.g., update email, change password, modify profile info)"
                  rows="3"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#3973EB] text-white py-3 rounded-xl font-medium hover:bg-[#2960d8] transition-colors"
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
