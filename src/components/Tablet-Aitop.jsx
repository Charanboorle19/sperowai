import React, { useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';

const AIpage = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileInput = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Starting file upload...');
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

      console.log('File uploaded, waiting for processing...');
      const data = await response.json();
      console.log('Processing complete! Response:', data);
      
    } catch (error) {
      console.error('Error uploading file:', error);
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
