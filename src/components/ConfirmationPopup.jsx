import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationPopup = ({ onConfirm, onCancel }) => {
  const navigate = useNavigate();

  const openFeedback = () => {
    window.open('/feedback', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-[20px] p-6 w-[90%] max-w-[320px] shadow-lg animate-slideUp">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          Close Consultation
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          Are you sure you want to close this consultation?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-[#3973EB] text-white rounded-xl font-medium hover:bg-[#2960d8] transition-colors"
          >
            Close Consultation
          </button>
          
          {/* Feedback Button with Animation */}
          <button
            onClick={openFeedback}
            className="w-full px-4 py-2 bg-white text-[#3973EB] border-2 border-[#3973EB] rounded-xl font-medium 
                     hover:bg-blue-50 transition-colors relative animate-pulse hover:animate-none"
          >
            Share Your Feedback
          </button>

          <button
            onClick={onCancel}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;