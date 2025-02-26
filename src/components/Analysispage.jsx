import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import profileImage from '../assets/doctor.jpg';
import SummaryPage from './Summarypage';
import AIpagemain from './AIpagemain';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Analysispage = () => {
  const [showSummary, setShowSummary] = useState(false);
  const [showAIMain, setShowAIMain] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isLoading } = useSelector(state => state.medicalRecord);
  const navigate = useNavigate();
  const location = useLocation();

  // Path check effect
  useEffect(() => {
    if (location.pathname !== '/analysis') {
      navigate('/analysis');
    }
  }, [location, navigate]);

  // Progress and navigation effect
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 1;
        });
      }, 300);

      return () => clearInterval(interval);
    } else if (progress >= 95) {
      setProgress(100);
      const timer = setTimeout(() => {
        setShowSummary(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  const handleCrossClick = () => {
    setShowAIMain(true);
  };

  // Component rendering based on state
  if (showAIMain) {
    return <AIpagemain />;
  }

  if (showSummary) {
    return <SummaryPage />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[440px] bg-white rounded-xl p-6 shadow-md relative">
        {/* Header */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleCrossClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <img
            src={profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">AI Analysis in Progress</h2>
            <p className="text-sm text-gray-500">Processing your medical reports</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="text-center space-y-6">
          <div className="w-[180px] h-[180px] mx-auto relative">
            <DotLottieReact
              src="https://lottie.host/ff16e477-249b-4761-a4cc-07b67c56f2a8/UOH3ByVGzS.lottie"
              loop
              autoplay
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold text-[#3973eb]">
                  {progress}%
                </span>
                <div className="text-sm text-gray-500">Processing</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Analysis Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Analyzing Your Reports
            </h3>
            <p className="text-gray-500 text-sm">
              Our AI is processing your medical reports to provide comprehensive insights and analysis
            </p>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCrossClick}
            className="px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm"
          >
            Cancel Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysispage;
