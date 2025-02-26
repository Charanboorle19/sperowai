import React, { useState, useEffect } from 'react';
import PatientDetails from './PatientDetails';
import Chat from './Chat';
import Reports from './Reports';
import ConfirmationPopup from './ConfirmationPopup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearMedicalRecord } from '../store/medicalRecordSlice';
import apiService from '../services/api/apiService';
import { IoClose } from 'react-icons/io5';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const TabletSummaryPage = ({ patientId = 1 }) => {
  const [scheduledData, setScheduledData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Move useSelector to component level
  const consultation_id = useSelector(state => state.medicalRecord.consultation_id) || 
    localStorage.getItem('consultation_id');

  const handleCloseConsultation = async (isAutoClose = false) => {
    if (!consultation_id) {
      console.error('No consultation ID found');
      navigate('/ai');
      return;
    }

    try {
      if (!isAutoClose) {
        setShowCloseDialog(true);
        return;
      }

      await apiService.closeConsultation(consultation_id);
      
      // Clear Redux state
      dispatch(clearMedicalRecord());
      
      // Clear localStorage
      localStorage.removeItem('chat_history');
      localStorage.removeItem('medicalRecord');
      
      navigate('/closecase');
    } catch (error) {
      console.error('Error closing consultation:', error);
      if (!isAutoClose) {
        navigate('/ai');
      }
    }
  };

  const handleConfirmCloseConsultation = async () => {
    setShowCloseDialog(false);
    setIsClosing(true);
    try {
      await apiService.closeConsultation(consultation_id);
      dispatch(clearMedicalRecord());
      localStorage.removeItem('chat_history');
      localStorage.removeItem('medicalRecord');
    } catch (error) {
      console.error('Error closing consultation:', error);
      navigate('/ai');
    } finally {
      setIsClosing(false);
    }
  };

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

  const handleConfirmClose = () => {
    console.log('Close confirmed');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Main Container with max-width for larger screens */}
      <div className={`max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 ${isChatActive ? 'blur-sm' : ''}`}>
        <div className="grid md:grid-cols-[1fr,2fr] lg:grid-cols-[1fr,3fr] gap-6">
          {/* Left Column - Patient Details */}
          <div className="md:sticky md:top-0 md:h-screen md:pt-6">
            <PatientDetails 
              patientId={patientId} 
              onClose={handleClose}
              className="md:max-h-[calc(100vh-2rem)] md:overflow-auto"
            />
            
            {/* Close Consultation Button - Moved here */}
            <div className="mt-6 mb-6">
              <div className="flex gap-2 sm:gap-4">
                <button 
                  data-close-consultation
                  className="flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-xl border-2 border-gray-200 text-gray-600 text-sm sm:text-base font-medium hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200 ease-in-out"
                  onClick={() => handleCloseConsultation(false)}
                >
                  Close Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Reports */}
          <div className="space-y-6">
            {/* Reports Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Reports 
                onFollowupScheduled={handleFollowupScheduled}
                onCloseCaseClick={handleCloseCaseClick}
                patientId={patientId}
                isChatActive={isChatActive}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section - Fixed at bottom on tablet/desktop */}
      <div className="fixed bottom-0 right-0 w-full md:w-[60%] md:max-w-[1800px] md:mx-4 lg:mx-8 z-50">
        <Chat patientId={patientId} onChatOpen={() => setIsChatActive(true)} onChatClose={() => setIsChatActive(false)} />
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <ConfirmationPopup 
            onConfirm={handleConfirmClose}
            onCancel={() => setShowConfirmation(false)}
            className="max-w-md w-full"
          />
        </div>
      )}

      {/* Loading Animation Overlay */}
      {isClosing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="flex flex-col items-center">
            <DotLottieReact
              src="https://lottie.host/8ec6217f-6134-4270-87c7-f9c1d7791ad6/0UUi8AV9NM.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
            <p className="mt-4 text-gray-600 text-lg">Closing consultation...</p>
          </div>
        </div>
      )}

      {/* Close Consultation Dialog */}
      {showCloseDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Close Consultation</h3>
              <button 
                onClick={() => setShowCloseDialog(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to close this consultation? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCloseDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCloseConsultation}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Close Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabletSummaryPage;