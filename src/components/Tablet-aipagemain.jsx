import React, { useState, useEffect } from 'react';
import AIpageTop from './Tablet-Aitop';
import Analysispage from './Tablet-AnalysisPage';
import { IoClose } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';

const TabletAIpagemain = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/ai') {
      navigate('/ai');
    }
  }, [location, navigate]);

  const handleFileUpload = (files, setUploadingState) => {
    const newFiles = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
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
        <div className="max-w-[1400px] mx-auto p-8 lg:p-12 animate-swing-in-top">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Assistant</h1>
              <p className="text-base text-gray-500">Upload and analyze your medical reports</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="text-2xl text-gray-600" />
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-10">
            {/* Upload Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <AIpageTop 
                  uploadedFiles={uploadedFiles} 
                  setUploadedFiles={setUploadedFiles}
                  onFileRemove={handleFileRemove}
                  onUploadComplete={handleUploadComplete}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Analysispage onCancel={handleCancelAnalysis} />
      )}
    </div>
  );
};

export default TabletAIpagemain;