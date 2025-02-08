import React, { useState, useEffect } from 'react';
import PatientDetails from './PatientDetails';
import Chat from './Chat';
import Reports from './Reports';
import ConfirmationPopup from './ConfirmationPopup';
import { useNavigate, useLocation } from 'react-router-dom';

const TabletSummaryPage = ({ patientId = 1 }) => {
  const [scheduledData, setScheduledData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/summary') {
      navigate('/summary');
    }
  }, [location, navigate]);

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
    <div className="min-h-screen mt-10 bg-[#F8FAFC]">
      {/* Main Container with max-width for larger screens */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-[1fr,2fr] lg:grid-cols-[1fr,3fr] gap-6">
          {/* Left Column - Patient Details */}
          <div className="md:sticky md:top-0 md:h-screen md:pt-6">
            <PatientDetails 
              patientId={patientId} 
              onClose={handleClose}
              className="md:max-h-[calc(100vh-2rem)] md:overflow-auto"
            />
          </div>

          {/* Right Column - Reports and Chat */}
          <div className="space-y-6">
            {/* Reports Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Reports 
                onFollowupScheduled={handleFollowupScheduled}
                onCloseCaseClick={handleCloseCaseClick}
                patientId={patientId}
              />
            </div>

            {/* Chat Section - Fixed at bottom on tablet/desktop */}
            <div className="md:fixed md:bottom-0 md:right-0 md:w-[calc(100%-350px)] lg:w-[calc(100%-400px)] md:max-w-[800px] md:mx-4 lg:mx-8">
              <Chat patientId={patientId} />
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default TabletSummaryPage;