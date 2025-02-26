import React, { useState, useEffect } from 'react';
import TabletPerformance from './Tablet-performance';
import Search from './Search';
import TabletAiButton from './Tablet-aibutton';
import TabletAIPage from './Tablet-AIpage';
import TabletDashboard from './Tablet-dashboard';
import NotificationPage from './notificationpage';
import TabletProfile from './Tablet-profile';
import TabletAIpagemain from './Tablet-aipagemain';
import TabletHeader from './Tablet-header';
import { profileData } from '../data/profileData';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api/apiService';

const TabletHomepage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAIPage, setShowAIPage] = useState(false);
  const username = localStorage.getItem('username') || 'User';
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = (event) => {
      setCurrentPage(event.detail);
    };

    window.addEventListener('navigationChange', handleNavigation);

    return () => {
      window.removeEventListener('navigationChange', handleNavigation);
    };
  }, []);

  const handleAIButtonClick = () => {
    setShowAIPage(true);
  };

  // Render different pages based on currentPage state
  switch(currentPage) {
    case 'dashboard':
      return <TabletDashboard />;
    case 'profile':
      return <TabletProfile />;
    case 'notifications':
      return <NotificationPage onBack={() => setCurrentPage('home')} />;
    default:
      if (showAIPage) {
        return <TabletAIpagemain />;
      }
      return (
        <div className="flex">
          <TabletHeader />
          <div className="flex-1 ml-[80px]">
            <div className="min-h-screen bg-[#F8FAFC] p-8 animate-swing-in-top">
              {/* Greeting Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Hello {username}!
                </h1>
                <p className="text-gray-600 text-sm">
                  Let's start treating
                </p>
              </div>

              {/* Performance Section */}
              <div className="mb-6 md:mb-8 lg:mb-10">
                <TabletPerformance />
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="w-full">
                  <Search />
                </div>

                {/* AI Button Section */}
                <div className="hidden md:block w-full">
                  <TabletAiButton onClick={handleAIButtonClick} />
                </div>
              </div>

              {/* Mobile AI Button */}
              <div className="md:hidden fixed bottom-6 right-6">
                <button
                  onClick={handleAIButtonClick}
                  className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                  AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default TabletHomepage;