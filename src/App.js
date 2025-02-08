import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/loginpage';
import { jwtDecode } from 'jwt-decode';
import { useMediaQuery } from 'react-responsive';
import TabletHomepage from './components/Tablet-homepage';
import TabletDashboard from './components/Tablet-dashboard';
import TabletProfile from './components/Tablet-profile';
import TabletAIpagemain from './components/Tablet-aipagemain';
import TabletAnalysisPage from './components/Tablet-AnalysisPage';
import TabletSummaryPage from './components/Tablet-SummaryPage';
import TabletCloseCase from './components/Tablet-closecase';
import TabletPerformance from './components/Tablet-performancepage';
import HomePage from './components/Homepage';
import DashboardMain from './components/DashboardMain';
import ProfilePage from './components/profilepage';
import AIpagemain from './components/AIpagemain';
import AnalysisPage from './components/Analysispage';
import SummaryPage from './components/Summarypage';
import CloseCase from './components/closecase';
import PerformancePage from './components/Performancepage';
import TreatmentTimeRange from './components/Treatmenttimepage';
import Landpage from './components/Landpage';

function App() {
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

  // Function to check if user is logged in
  const isAuthenticated = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F9]">
      
      <Routes>
        {/* Public routes */}
        <Route path='/landpage' element={<Landpage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {isTabletOrDesktop ? <TabletDashboard /> : <DashboardMain />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              {isTabletOrDesktop ? <TabletProfile /> : <ProfilePage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              {isTabletOrDesktop ? <TabletAIpagemain /> : <AIpagemain />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              {isTabletOrDesktop ? <TabletAnalysisPage /> : <AnalysisPage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              {isTabletOrDesktop ? <TabletSummaryPage /> : <SummaryPage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/closecase"
          element={
            <ProtectedRoute>
              {isTabletOrDesktop ? <TabletCloseCase /> : <CloseCase />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <ProtectedRoute>
              {isTabletOrDesktop ? <TabletPerformance /> : <PerformancePage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/Treatment Time Range"
          element={
            <ProtectedRoute>
              <TreatmentTimeRange />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route
          path="/"
          element={isAuthenticated() ? (
            isTabletOrDesktop ? <TabletHomepage /> : <HomePage />
          ) : (
            <Navigate to="/landpage" replace />
          )}
        />
      </Routes>
    </div>
  );
}

export default App;