import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/loginpage';
import Feedback from './components/Feedback';

// Test Components
const HomePage = () => (
  <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
    <h1>Home Page</h1>
    {/* Your existing HomePage content */}
  </div>
);

const DashboardPage = () => (
  <div style={{ padding: '20px', background: '#e0e0e0', minHeight: '100vh' }}>
    <h1>Dashboard Page</h1>
    {/* Your existing DashboardMain content */}
  </div>
);

const ProfilePage = () => (
  <div style={{ padding: '20px', background: '#d0d0d0', minHeight: '100vh' }}>
    <h1>Profile Page</h1>
    {/* Your existing ProfilePage content */}
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;