import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/doctor.jpg';

const Analysispage = ({ onCancel }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/summary');
    }, 5000);


    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-start px-4 py-6 relative">
      {/* Profile at top-left corner */}
      <div className="absolute top-4 left-4">
        <img
          className="w-[54px] h-[54px] rounded-full"
          src={profileImage}
          alt="Profile"
        />
      </div>

      {/* Cross Icon at top-right corner */}
      <div 
        className="absolute top-4 right-4 mt-4 cursor-pointer"
        onClick={onCancel}
      >
        <FaTimes className="text-[#3973eb] text-xl" />
      </div>

      {/* AI Now Section at top middle */}
      <div className="w-32 h-[47px] px-[27px] py-3.5 bg-white rounded-[60px] shadow-[0px_4px_25.1px_rgba(217,225,243,1)] flex justify-center items-center mt-">
        <div className="text-[#3973eb] text-base font-semibold ">
          AI Now
        </div>
      </div>

      {/* Middle Section with Updated Text */}
      <div className="w-[335px] h-[162px] mt-14 relative">
        <div className="w-[298px] h-[92px] px-3.5 py-[23px] left-[16px] top-0 absolute bg-white rounded-[30px] justify-center items-center gap-2.5 inline-flex">
          <div className="w-[269px] text-center text-[#3973eb] text-xl font-semibold ">
            Preparing Your Reports for Analysis
          </div>
        </div>

        <div className="w-[335px] left-0 top-[114px] absolute text-center text-[#928484] text-sm font-semibold ">
          Our AI will analyze the reports and provide a comprehensive summary, saving your time and improving accuracy
        </div>
      </div>

      {/* Loading Animation */}
      <div className="w-[200px] h-[200px] mt-8">
        <DotLottieReact
          src="https://lottie.host/ff16e477-249b-4761-a4cc-07b67c56f2a8/UOH3ByVGzS.lottie"
          loop
          autoplay
        />
      </div>

      {/* Cancel Button */}
      <button 
        className="fixed bottom-8 w-[260px] h-[51px] bg-white border-2 border-gray-400 rounded-[60px] text-gray-500 text-xl font-semibold  shadow-md hover:bg-gray-400 hover:text-white transition-colors duration-200"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default Analysispage;
