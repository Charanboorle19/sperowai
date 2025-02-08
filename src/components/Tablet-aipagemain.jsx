import React, { useState, useEffect } from 'react';
import AIpage from './Tablet-Aitop';
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
        <div className="max-w-[1400px] mx-auto p-8 lg:p-12">
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left Column - Upload Section */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <AIpage 
                  uploadedFiles={uploadedFiles} 
                  setUploadedFiles={setUploadedFiles}
                  onFileRemove={handleFileRemove}
                  onUploadComplete={handleUploadComplete}
                />
              </div>
            </div>

            {/* Right Column - Preview Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-sm h-full">
                {uploadedFiles.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-800">Uploaded Files</h2>
                      <span className="text-sm text-gray-500">{uploadedFiles.length} files</span>
                    </div>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {uploadedFiles.map((file) => (
                        <div 
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {file.name.split('.').pop().toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 mb-1">{file.name}</p>
                              <p className="text-xs text-gray-500">Ready for analysis</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleFileRemove(file)}
                            className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IoClose className="text-gray-400 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={handleUploadComplete}
                      className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                        transition-colors font-medium text-lg shadow-sm hover:shadow-md"
                    >
                      Start Analysis
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <span className="text-blue-500 text-2xl">AI</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No Files Uploaded</h3>
                    <p className="text-gray-500 max-w-md text-base">
                      Upload your medical reports to get started with the AI analysis
                    </p>
                  </div>
                )}
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