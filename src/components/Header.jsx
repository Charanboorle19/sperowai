import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import Profile from '../assets/doctor.jpg';
import { profileData } from '../data/profileData';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  return (
    <header className="w-full min-w-[320px] max-w-[750px] mx-auto">
      <div className="w-full h-44 bg-[#3973eb] rounded-bl-[15px] rounded-br-[15px] shadow-[0px_2px_17.8px_rgba(0,0,0,0.25)] border relative">
        {/* Content Section */}
        <div className="w-[90%] h-[61px] absolute top-[20px] left-[5%] flex items-center">
          {/* Profile Picture */}
          <img
            src={Profile}
            alt="Profile"
            className="w-[48px] h-[48px] rounded-full flex-shrink-0"
          />

          {/* Greeting Text */}
          <div className="ml-4 flex flex-col min-w-0">
            <div className="text-white text-lg sm:text-base font-semibold truncate">
              Hello {username}!
            </div>
            <div className="text-[#f4f4f4] text-xs sm:text-sm font-normal">
              Let's Start Treating...
            </div>
          </div>

          {/* Icons */}
          <div className="ml-auto flex items-center space-x-3 flex-shrink-0">
            {/* Profile Icon */}
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaUserCircle className="text-white text-2xl" />
            </button>
          </div>
        </div>

        {/* Button Section */}
        <div className="w-[90%] h-12 absolute bottom-4 left-[5%] flex justify-center space-x-4">
          {/* Home Button */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-[40%] bg-white px-4 py-2 rounded-[60px] shadow-[0px_4px_25.1px_rgba(57,115,235,0.68)] border border-[#3973eb] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className="text-[#3973eb] mr-2"
            >
              <path
                fill="currentColor"
                d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19"
              />
            </svg>
            <span className="text-[#3973eb] text-sm sm:text-base font-semibold">
              Home
            </span>
          </button>

          {/* Dashboard Button */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-[40%] bg-white px-4 py-2 rounded-[60px] shadow-[0px_4px_25.1px_rgba(57,115,235,0.68)] border border-[#3973eb] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className="text-[#7c7f84] mr-2"
            >
              <path
                fill="currentColor"
                d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6zm2-10h4V5H5zm10 8h4v-6h-4zm0-12h4V5h-4zM5 19h4v-2H5z"
              />
            </svg>
            <span className="text-[#7c7f84] text-sm sm:text-base font-semibold">
              Dashboard
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
