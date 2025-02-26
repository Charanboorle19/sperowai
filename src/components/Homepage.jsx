import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import MobileHeader from './Header';
import TabletHeader from './Tablet-header';
import Performance from './Performance';
import Search from './Search';
import AiButton from './AIbutton';
import { useSelector, useDispatch } from 'react-redux';
import { clearMedicalRecord } from '../store/medicalRecordSlice';
import { apiService } from '../services/api/apiService'; // Fixed import path

const HomePage = () => {
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const consultation_id = useSelector(state => state.medicalRecord.consultation_id);

  // Handle auto-close of consultation (same as tablet version)
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (consultation_id) {
        try {
          await apiService.closeConsultation(consultation_id);
          dispatch(clearMedicalRecord());
          localStorage.removeItem('chat_history');
          localStorage.removeItem('medicalRecord');
        } catch (error) {
          console.error('Error closing consultation:', error);
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [consultation_id, dispatch]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      navigate('/landpage');
    }
  }, [navigate]);

  // Smart AI button navigation
  const handleAIButtonClick = () => {
    if (consultation_id) {
      navigate('/summary');
    } else {
      navigate('/ai');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <MobileHeader />
      <div className="max-w-[750px] mx-auto px-4">
        <div className="mb-4">
          <Search />
        </div>
        
        <Performance />
      </div>

      <div 
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        style={{ position: 'fixed', bottom: '24px' }}
      >
        <AiButton onClick={handleAIButtonClick} />
      </div>
    </div>
  );
};

export default HomePage;