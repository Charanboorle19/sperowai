import React, { useRef, useState } from 'react';
import { FaUpload, FaFileAlt, FaTimes, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AIpage = ({ uploadedFiles, setUploadedFiles, onFileRemove, onUploadComplete }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 
          hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50"
      >
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mx-auto mb-4 
            flex items-center justify-center">
            <FaUpload className="text-3xl text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Drop your files here</h3>
          <p className="text-sm text-gray-500 mb-3">or click to browse</p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-white/50 px-3 py-1.5 rounded-full">
            <FaFileAlt className="text-blue-500" />
            Supported: PDF, JPG, PNG
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {uploadedFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Selected Files
            </h3>
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
              {uploadedFiles.length} files
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="relative group">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(file);
                  }}
                  className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-white 
                    text-gray-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <FaTimes className="text-xs" />
                </button>
                
                <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onUploadComplete}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg 
              font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 
              flex items-center justify-center gap-2"
          >
            <FaUpload className="text-lg" />
            Upload and Process Files
          </button>
        </div>
      )}
    </div>
  );
};

export default AIpage;
