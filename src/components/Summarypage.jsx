import React, { useState } from 'react';
import PatientDetails from './PatientDetails';
import Chat from './Chat';
import Reports from './Reports';
import ConfirmationPopup from './ConfirmationPopup';
import { useParams, Navigate } from 'react-router-dom';

const SummaryPage = () => {
  const [scheduledData, setScheduledData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { consultation_id } = useParams();

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

  const handleConfirmClose = () => {
    console.log('Close confirmed');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative max-w-[440px] mx-auto">
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
