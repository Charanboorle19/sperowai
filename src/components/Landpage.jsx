import React from 'react';
import { FaRobot, FaChartLine, FaStethoscope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const SperowIcon = () => (
   
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={32} 
    height={32} 
    viewBox="0 0 24 24"
    className="text-[#3973EB]"
  >
    <path 
      fill="currentColor" 
      d="m19.713 8.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M15 21.538l-6-14L6.66 13H1v-2h4.34L9 2.461l6 14L17.34 11H23v2h-4.34z"
    />
  </svg>
);

const LandPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SperowIcon className="text-2xl" />,
      title: "AI-Powered Analysis",
      description: "Get a quick and clear overview of patient reports with ease!"
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Efficiency Metrics",
      description: "Monitor and analyze your medical practice metrics"
    },
    {
      icon: <FaStethoscope className="text-2xl" />,
      title: "Patient Care",
      description: "Improve patient outcomes with data-driven decisions"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SperowIcon />
          <span className="text-2xl font-bold text-[#3973EB]">Sperow</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 md:px-5 md:py-2 text-[#3973EB] text-sm md:text-base font-medium border-2 border-[#3973EB] hover:bg-blue-50 rounded-lg transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 md:px-5 md:py-2 bg-[#3973EB] text-white text-sm md:text-base font-medium rounded-lg hover:bg-[#3973EB]/90 transition-colors"
          >
            Contact Us
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Healthcare with
            <span className="text-[#3973EB]"> AI-Powered</span> Solutions
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Enhance diagnosis and patient care with AI-driven report summaries.
          </p>
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-transparent text-[#3973EB] font-semibold rounded-lg border-2 border-[#3973EB] hover:bg-[#3973EB] hover:text-white transition-all duration-300 shadow-sm"
            >
              Contact Us
            </button>
            <div className="border border-gray-200 rounded-xl p-6 max-w-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <p className="text-gray-700 font-medium leading-relaxed">
                Are you a healthcare professional? Verify your medical credentials by contacting us to access our AI-powered platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#3973EB] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandPage;
