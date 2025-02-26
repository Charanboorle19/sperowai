import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import profileImage from '../assets/doctor.jpg';
import SummaryPage from './Tablet-SummaryPage';
import TabletAIpagemain from './Tablet-aipagemain';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TabletAnalysisPage = ({ onCancel }) => {
  const [showSummary, setShowSummary] = useState(false);
  const [showAIMain, setShowAIMain] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isLoading } = useSelector(state => state.medicalRecord);
  const medicalRecord = useSelector(state => state.medicalRecord);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/analysis') {
      navigate('/analysis');
    }
  }, [location, navigate]);

  useEffect(() => {
    let progressInterval;
    let completionTimer;

    const startProgress = () => {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 1;
        });
      }, 100);
    };

    const checkCompletion = () => {
      // Check if we have medical record data
      const savedData = localStorage.getItem('medicalRecord');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.consultation_id) {
          setProgress(100);
          completionTimer = setTimeout(() => {
            navigate('/summary');
          }, 500);
        }
      }
    };

    if (isLoading) {
      startProgress();
      // Check completion after a reasonable time
      setTimeout(checkCompletion, 3000);
    }

    // Cleanup
    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (completionTimer) clearTimeout(completionTimer);
    };
  }, [isLoading, navigate, medicalRecord]);

  const handleCrossClick = () => {
    navigate('/ai');
  };

  if (showAIMain) {
    return <TabletAIpagemain />;
  }

  if (showSummary) {
    return <SummaryPage />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6">
      <div className="max-w-[800px] w-full bg-white rounded-2xl p-8 shadow-lg relative">
        {/* Header */}
        <div className="absolute top-6 right-6">
          <button
            onClick={handleCrossClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <img
            src={profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">AI Analysis in Progress</h2>
            <p className="text-sm text-gray-500">Processing your medical reports</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="max-w-[600px] mx-auto text-center space-y-8">
          <div className="w-[200px] h-[200px] mx-auto">
            <DotLottieReact
              src="https://lottie.host/ff16e477-249b-4761-a4cc-07b67c56f2a8/UOH3ByVGzS.lottie"
              loop
              autoplay
            />
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
            <p className="text-gray-500 max-w-md mx-auto">
              Our AI is processing your medical reports to provide comprehensive insights and analysis
            </p>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleCrossClick}
            className="px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabletAnalysisPage;
