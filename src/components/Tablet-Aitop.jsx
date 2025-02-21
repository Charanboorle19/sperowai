import React, { useRef, useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMedicalRecord, setLoading } from '../store/medicalRecordSlice';
import apiService from '../services/api/apiService';

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
        >
          <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">Click to select a file</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {file && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Selected file: {file.name}</p>
            <button
              onClick={handleUpload}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Upload File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIpage;
