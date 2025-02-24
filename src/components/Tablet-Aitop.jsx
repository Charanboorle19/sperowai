import React, { useRef, useState, useEffect } from 'react';
import { FaUpload, FaFileAlt, FaImage, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMedicalRecord, setLoading } from '../store/medicalRecordSlice';

const AIpage = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const medicalRecord = useSelector(state => state.medicalRecord);

  useEffect(() => {
    // If there's existing consultation data, redirect to summary
    if (medicalRecord?.consultation_id && medicalRecord?.summary) {
      navigate('/summary');
    }
  }, [medicalRecord, navigate]);

  const handleFileInput = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
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
      if (data.consultation_id){
        navigate(`/summary`);
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
    <div className="flex gap-8">
      {/* Left Side - Upload Area */}
      <div className="flex-1">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-3 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 
            overflow-hidden group
            ${file ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
            }`}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-5 w-20 h-20 rounded-full bg-blue-400 blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-5 right-5 w-20 h-20 rounded-full bg-indigo-400 blur-2xl transform translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-6 
              flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <FaUpload className="text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Drop your files here</h3>
            <p className="text-gray-500 mb-4">or click to browse</p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/50 px-4 py-2 rounded-full">
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

        {file && (
          <button
            onClick={handleUpload}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-xl 
              font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 
              transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3"
          >
            <FaUpload className="text-xl" />
            Upload and Process Files
          </button>
        )}
      </div>

      {/* Right Side - Selected Files */}
      <div className="w-[320px] bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Selected Files
          </h3>
          {file && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm 
              rounded-full font-medium shadow-sm">
              1 file
            </span>
          )}
        </div>
        
        {file ? (
          <div className="grid grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="relative group">
              <button
                onClick={() => setFile(null)}
                className="absolute -top-2 -right-2 z-10 w-7 h-7 bg-gradient-to-br from-red-500 to-pink-500 
                  text-white rounded-full flex items-center justify-center shadow-lg hover:from-red-600 
                  hover:to-pink-600 transition-colors opacity-0 group-hover:opacity-100 transform 
                  hover:scale-110 duration-200"
              >
                <FaTimes className="text-sm" />
              </button>
              
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white 
                border border-gray-200 group-hover:border-blue-300 transition-all duration-300 
                group-hover:shadow-xl group-hover:-translate-y-1">
                {file.type.startsWith('image/') ? (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg 
                      flex items-center justify-center mb-3">
                      <FaFileAlt className="text-2xl text-indigo-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {file.name.split('.').pop().toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2 truncate px-1 font-medium">{file.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl 
              flex items-center justify-center mb-6 transform -rotate-6">
              <FaImage className="text-3xl text-indigo-500 transform rotate-6" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Nothing Selected</h4>
            <p className="text-gray-500">
              Upload files to see them appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIpage;
