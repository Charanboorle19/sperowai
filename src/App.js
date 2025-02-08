import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import TabletAIpagemain from './components/Tablet-aipagemain';
import TabletHomepage from './components/Tablet-homepage';
import TabletHeader from './components/Tablet-header';
import TabletSummaryPage from './components/Tablet-SummaryPage';
import TabletDashboard from './components/Tablet-dashboard';
import TabletProfile from './components/Tablet-profile';
import { useMediaQuery } from 'react-responsive';
import DashboardMain from './components/DashboardMain';
import ProfilePage from './components/profilepage';
import AIpagemain from './components/AIpagemain';
import AnalysisPage from './components/Analysispage';
import TabletAnalysisPage from './components/Tablet-AnalysisPage';
import SummaryPage from './components/Summarypage';
import CloseCase from './components/closecase';
import TabletCloseCase from './components/Tablet-closecase';
import Landpage from './components/Landpage';
import LoginPage from './components/loginpage';
import SignupPage from './components/signuppage';
import PerformancePage from './components/Performancepage';
import TreatmentTimeRange from './components/Treatmenttimepage';
import TabletPerformance from './components/Tablet-performancepage';

function App() {
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });
  console.log(isTabletOrDesktop);

  return (
    <div className="min-h-screen bg-[#F7F8F9]">
      <Routes>
        {/* Home Routes */}
        <Route path="/" element={isTabletOrDesktop ? <TabletHomepage /> : <HomePage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={isTabletOrDesktop ? <TabletDashboard /> : <DashboardMain />} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={isTabletOrDesktop ? <TabletProfile /> : <ProfilePage />} />

        {/* AI Routes */}
        <Route path="/ai" element={isTabletOrDesktop ? <TabletAIpagemain /> : <AIpagemain />} />

        {/* Analysis Routes */}
        <Route path="/analysis" element={isTabletOrDesktop ? <TabletAnalysisPage /> : <AnalysisPage />} />
        
        {/* Summary Routes */}
        <Route path="/summary" element={isTabletOrDesktop ? <TabletSummaryPage /> : <SummaryPage />} />

        {/* Close Case Routes */}
        <Route path="/closecase" element={isTabletOrDesktop ? <TabletCloseCase /> : <CloseCase />} />

        {/* Landing Routes */}
        <Route path="/landing" element={<Landpage />} />

        {/* Login Routes */}
        <Route path="/loginpage" element={<LoginPage />} />

        {/* Signup Routes */}
        <Route path="/signuppage" element={<SignupPage />} />

        {/* Performance Routes */}
        <Route path="/performance" element={isTabletOrDesktop ? <TabletPerformance /> : <PerformancePage />} />

        


        {/* Treatment Time Range Routes */}
        <Route path="/Treatment Time Range" element={<TreatmentTimeRange />} />








      </Routes>
    </div>
  );
}

export default App;