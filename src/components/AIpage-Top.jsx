import React, { useRef, useState } from 'react';
import profileImage from '../assets/doctor.jpg'; // Replace with your actual image path
import { FaTimes, FaCamera } from 'react-icons/fa'; // Import the cross icon and camera icon from react-icons
import AIpageB from './AIpage-Middle'; // Import the AIAnalysisPrompt component
import UploadCard from './upload';
import { useNavigate } from 'react-router-dom';

const AIpage = ({ uploadedFiles, setUploadedFiles, onFileRemove, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsCapturing(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCapturing(false);
    }
  };

  const takePicture = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageUrl);
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-start px-4 py-6 relative">
      {/* Profile at top-left corner */}
      <div className="absolute top-4 left-4">
        <img
          className="w-[54px] h-[54px] rounded-full"
          src={profileImage}
          alt="Profile"
        />
      </div>

      {/* Cross Icon at top-right corner */}
      <div 
        className="absolute top-4 right-4 mt-4 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <FaTimes className="text-[#3973eb] text-xl" />
      </div>

      {/* AI Now Section at top middle */}
      <div className="w-32 h-[47px] px-[27px] py-3.5 bg-white rounded-[60px] shadow-[0px_4px_25.1px_rgba(217,225,243,1)] flex justify-center items-center mt-">
        <div className="text-[#3973eb] text-base font-semibold ">
          AI Now
        </div>
      </div>

      {/* Add the AI Analysis Prompt Section */}
      <AIpageB />

      {/* Display uploaded files - Below AIpageB with horizontal scroll */}
      <div className="w-full max-w-md mt-8">
        {uploadedFiles.length > 0 && (
          <div className="bg-[#E8E8E8] p-3 rounded-[10px] overflow-x-auto">
            <div className="flex gap-2 min-w-min">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative flex-shrink-0">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-[52px] h-[52px] object-cover rounded-md shadow-sm"
                  />
                  <button
                    onClick={() => onFileRemove(file)}
                    className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                  >
                    <FaTimes className="text-gray-500 text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Card Section */}
      <UploadCard />
    </div>
  );
};

export default AIpage;
