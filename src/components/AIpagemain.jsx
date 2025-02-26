import React, { useState, useEffect } from 'react';
import AIpage from './AIpage-Top';
import Analysispage from './Analysispage';
import { IoClose } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearMedicalRecord } from '../store/medicalRecordSlice';
import apiService from '../services/api/apiService';

const AIpagemain = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const consultation_id = useSelector(state => state.medicalRecord.consultation_id);

  useEffect(() => {
    if (location.pathname !== '/ai') {
      navigate('/ai');
    }
  }, [location, navigate]);

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

  const handleFileUpload = (files, setUploadingState) => {
    const newFiles = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      setUploading: setUploadingState
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (file) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.id !== file.id);
      if (newFiles.length === 0) {
        file.setUploading && file.setUploading(false);
      }
      URL.revokeObjectURL(file.url);
      return newFiles;
    });
  };

  const handleUploadComplete = () => {
    setShowAnalysis(true);
  };

  const handleCancelAnalysis = () => {
    setShowAnalysis(false);
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {!showAnalysis ? (
        <div className="max-w-[440px] mx-auto p-4 animate-swing-in-top">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">AI Assistant</h1>
              <p className="text-sm text-gray-500">Upload and analyze your medical reports</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <AIpage 
                uploadedFiles={uploadedFiles} 
                setUploadedFiles={setUploadedFiles}
                onFileRemove={handleFileRemove}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          </div>
        </div>
      ) : (
        <Analysispage onCancel={handleCancelAnalysis} />
      )}
    </div>
  );
};

export default AIpagemain;
