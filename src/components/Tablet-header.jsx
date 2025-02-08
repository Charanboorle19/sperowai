import React from 'react';
import { FaUserCircle, FaHome, FaBell } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const TabletHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (page) => {
    switch(page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[80px] bg-white shadow-lg flex flex-col items-center py-4">
      {/* Sperow Title - Vertical */}
      <div className="mb-8 font-bold text-lg text-blue-600 writing-mode-vertical">
        {['S', 'P', 'E', 'R', 'O', 'W'].map((letter, index) => (
          <span 
            key={index}
            className="block transform transition-all duration-200"
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              letterSpacing: '0.2em'
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Navigation Icons */}
      <div className="flex-1 flex flex-col items-center space-y-6">
        {/* Home Icon */}
        <button 
          onClick={() => handleNavigation('home')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 
            ${location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
        >
          <FaHome className="text-2xl" />
          <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
            Home
          </span>
        </button>

        {/* Dashboard Icon */}
        <button 
          onClick={() => handleNavigation('dashboard')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 
            ${location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={24} 
            height={24} 
            viewBox="0 0 24 24"
            className="transition-all duration-200"
          >
            <path 
              fill="currentColor" 
              d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6z"
            />
          </svg>
          <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
            Dashboard
          </span>
        </button>

        {/* Notification Icon */}
        
      </div>

      {/* Profile Section */}
      <div className="mt-auto mb-4">
        <button 
          onClick={() => handleNavigation('profile')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 
            ${location.pathname === '/profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
        >
          <FaUserCircle className="text-2xl" />
          <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
            Profile
          </span>
        </button>
      </div>
    </div>
  );
};

export default TabletHeader;