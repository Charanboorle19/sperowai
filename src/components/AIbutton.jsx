import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AiButton = ({ onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Only show the button on homepage
  if (location.pathname !== '/') {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick(); // Call the onClick prop if provided (for Tablet-homepage)
    } else {
      navigate('/ai'); // Default navigation
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="w-[130px] h-[60px] px-[18px] py-2  bg-[#3973eb] 
        rounded-[50px] shadow-[0px_4px_25.100000381469727px_0px_rgba(57,115,235,0.68)] 
        justify-center items-center gap-2 inline-flex cursor-pointer
        transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95"
    >
      <h2 className="text-white text-sm font-semibold md:text-base lg:text-lg">AI Now</h2>
      <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="text-white">
          <path fill="currentColor" d="m19.713 8.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M15 21.538l-6-14L6.66 13H1v-2h4.34L9 2.461l6 14L17.34 11H23v2h-4.34z"></path>
        </svg>
      </div>
    </button>
  );
};

export default AiButton;
