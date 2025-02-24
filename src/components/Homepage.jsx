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
import apiService from '../services/api/apiService';

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
    <div className="min-h-screen bg-[#F7F8F9] animate-swing-in-left">
      {/* Headers */}
      {isTabletOrDesktop ? (
        <TabletHeader />
      ) : (
        <div className="w-full min-w-[320px] max-w-[500px] mx-auto">
          <MobileHeader />
        </div>
      )}
      
      {/* Homepage specific content */}
      <div className={`${isTabletOrDesktop ? 'ml-[80px]' : ''}`}>
        <div className="w-full min-w-[320px] max-w-[500px] mx-auto pb-24">
          <div className="w-full mt-4 px-4">
            <Search />
          </div>
          <div className="w-full mb-4">
            <Performance />
          </div>
        </div>
      </div>

      {/* AI Button */}
      {!isTabletOrDesktop && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[130px] z-[9999]" 
          style={{ position: 'fixed', bottom: '24px' }}
          onClick={handleAIButtonClick}
        >
          <AiButton />
        </div>
      )}
    </div>
  );
};

export default HomePage;