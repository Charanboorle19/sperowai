import React, { useState } from 'react';
import PatientDetails from './PatientDetails';
import Chat from './Chat';
import Reports from './Reports';
import ConfirmationPopup from './ConfirmationPopup';

const SummaryPage = ({ patientId = 1 }) => {
  const [scheduledData, setScheduledData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      <PatientDetails patientId={patientId} onClose={handleClose} />

      {/* Main Content - Scrollable Area */}
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        <Reports 
          onFollowupScheduled={handleFollowupScheduled}
          onCloseCaseClick={handleCloseCaseClick}
          patientId={patientId}
        />
      </div>

      <Chat patientId={patientId} />

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
