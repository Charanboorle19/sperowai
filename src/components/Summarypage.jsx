import React, { useState } from 'react';
import PatientDetails from './PatientDetails';
import Chat from './Chat';
import Reports from './Reports';
import ConfirmationPopup from './ConfirmationPopup';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearMedicalRecord } from '../store/medicalRecordSlice';
import apiService from '../services/api/apiService';
import { IoClose } from 'react-icons/io5';

const SummaryPage = () => {
  const [scheduledData, setScheduledData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const consultation_id = useSelector(state => state.medicalRecord.consultation_id);

  if (!consultation_id) {
    return <Navigate to="/" replace />;
  }

  const handleFollowupScheduled = (data) => {
    setScheduledData(data);
    console.log('Followup scheduled:', data);
  };

  const handleCloseCaseClick = () => {
    console.log('Close case clicked');
  };

  const handleClose = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClose = async () => {
    try {
      if (consultation_id) {
        await apiService.closeConsultation(consultation_id);
        dispatch(clearMedicalRecord());
        localStorage.removeItem('chat_history');
        localStorage.removeItem('medicalRecord');
      }
      navigate('/closecase');
    } catch (error) {
      console.error('Error closing consultation:', error);
    }
  };

  const handleChatToggle = (isOpen) => {
    setShowChat(isOpen);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className={showChat ? 'blur-sm' : ''}>
        {/* Fixed Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="max-w-[440px] mx-auto">
            <div className="flex items-center justify-between px-4 py-4">
              {/* Empty navigation for now */}
            </div>
          </div>
        </div>

        {/* Main Content with proper top spacing */}
        <div className="pt-16">
          {/* Scroll Block */}
          <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50 via-gray-50 to-transparent z-10" />

          {/* Content Container */}
          <div className="max-w-[440px] mx-auto">
            {/* Patient Details */}
            <div className="px-4 mb-1">
              <PatientDetails />
            </div>

            {/* Reports and Close Button */}
            <div className="px-4 pt-1">
              <Reports 
                onFollowupScheduled={handleFollowupScheduled}
                onCloseCaseClick={handleCloseCaseClick}
                consultation_id={consultation_id}
              />
              
              {/* Close Button */}
              <div className="mt-8 mb-24 flex justify-center">
                <button
                  onClick={handleClose}
                  className="w-[70%] py-2 sm:py-3 px-4 sm:px-6 rounded-xl border-2 border-gray-200 text-gray-600 text-sm sm:text-base font-medium hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200 ease-in-out flex items-center justify-center"
                >
                  
                  Close Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <div className="fixed bottom-24 right-4 z-30">
        <Chat 
          consultation_id={consultation_id}
          onToggle={handleChatToggle}
        />
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <ConfirmationPopup 
            onConfirm={handleConfirmClose}
            onCancel={() => setShowConfirmation(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
