import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const PatientDetails = ({ onClose }) => {
  const medicalRecord = useSelector(state => state.medicalRecord);
  const patient = medicalRecord?.summary?.patient_demographics;

  if (!patient) return null;

  return (
    <div className="w-full">
      {/* Header Block */}
      <div className="sticky top-0 bg-gradient-to-b from-[#F8FAFC] to-[#F8FAFC]/95 backdrop-blur-sm z-10 py-3">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 text-lg" />
          </button>
          
          <div className="bg-[#3973EB] text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-sm">
            AI Report
          </div>
          
          <div className="w-8"></div>
        </div>
      </div>

      {/* Patient Card */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col">
            <div className="border-b pb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {patient.name || 'N/A'}
              </h2>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-3">
                <span className="text-sm text-gray-500">
                  Age: {patient.age || 'N/A'}
                </span>
                <span className="text-sm text-gray-500">
                  Sex: {patient.gender || 'N/A'}
                </span>
                <span className="text-sm text-gray-500">
                  UHID: {patient.uhid || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails; 