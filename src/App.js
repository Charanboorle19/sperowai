import React, { useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import apiService from './services/api/apiService';

function App() {
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token exists and hasn't expired
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token has expired
            localStorage.removeItem('jwt_token');
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Invalid token
          localStorage.removeItem('jwt_token'); 
          setIsAuthenticated(false);
        }

      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('jwt_token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
          element={
            <ProtectedRoute>
              {isTabletOrDesktop ? <TabletHomepage /> : <HomePage />}
            </ProtectedRoute>
          }
            
          
        />
      </Routes>
    </div>
  );
}

export default App;