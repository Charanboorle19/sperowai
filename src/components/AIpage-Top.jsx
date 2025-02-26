import React, { useRef, useState, useEffect } from 'react';
import { FaUpload, FaFileAlt, FaTimes, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMedicalRecord, setLoading } from '../store/medicalRecordSlice';

const AIpage = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const medicalRecord = useSelector(state => state.medicalRecord);

  useEffect(() => {
    // If there's existing consultation data, redirect to summary
    if (medicalRecord?.consultation_id && medicalRecord?.summary) {
      navigate('/summary');
    }
  }, [medicalRecord, navigate]);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      dispatch(setLoading(true));
      navigate('/analysis'); // Navigate to analysis page for loading animation

      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://sperowai.onrender.com/api/process-medical-record', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      console.log('Processing complete! Response:', data);

      // Store the response in Redux
      dispatch(setMedicalRecord(data));

      // Check if consultation_id exists and navigate
      if (data.consultation_id) {
        navigate('/summary');
      } else {
        console.error('No consultation_id in response:', data);
        throw new Error('No consultation ID received');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      navigate('/ai');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 
          ${file ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
          }`}
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
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {file && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Selected Files
            </h3>
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full">
              1 file
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="absolute -top-1 -right-1 z-10 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 
                  text-white rounded-full flex items-center justify-center shadow-lg opacity-0 
                  group-hover:opacity-100 transition-opacity duration-200"
              >
                <FaTimes className="text-xs" />
              </button>
              
              <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 
                group-hover:border-blue-300 transition-all duration-300 group-hover:shadow-lg">
                {file.type.startsWith('image/') ? (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg 
                      flex items-center justify-center mb-2">
                      <FaFileAlt className="text-xl text-indigo-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {file.name.split('.').pop().toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
            </div>
          </div>

          <button
            onClick={handleUpload}
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
