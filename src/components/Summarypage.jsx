import React, { useState } from 'react';
import PatientDetails from './PatientDetails';
import Chat from './Chat';
import Reports from './Reports';
import ConfirmationPopup from './ConfirmationPopup';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearMedicalRecord } from '../store/medicalRecordSlice';
import apiService from '../services/api/apiService';

const SummaryPage = () => {
  const [scheduledData, setScheduledData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const consultation_id = useSelector(state => state.medicalRecord.consultation_id);

  // Redirect to home/error page if consultation_id is missing
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-swing-in-left relative max-w-[440px] mx-auto">
      <PatientDetails onClose={handleClose} />

      {/* Main Content - Scrollable Area */}
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        <Reports 
          onFollowupScheduled={handleFollowupScheduled}
          onCloseCaseClick={handleCloseCaseClick}
          consultation_id={consultation_id}
        />
      </div>

      <Chat consultation_id={consultation_id} />

      {showConfirmation && (
        <ConfirmationPopup 
          onConfirm={handleConfirmClose}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default SummaryPage;
