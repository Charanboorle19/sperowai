import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App; 