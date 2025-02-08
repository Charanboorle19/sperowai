import React, { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { FaMicrophone } from 'react-icons/fa';
import { BsSend } from 'react-icons/bs';
import { MdOutlineFileUpload } from 'react-icons/md';
import AIpageTop from './AIpage-Top';
import AIpagemain from './AIpagemain';
import Upload from './upload';
import { useNavigate } from 'react-router-dom';

const TabletAIPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#3973EB] text-white">
        {/* Top Section */}
        <div className="py-6 px-8">
          <div className="flex items-center justify-between max-w-[1200px] mx-auto">
            <div className="flex items-center gap-6">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <IoArrowBack className="text-white text-xl" />
              </button>
              <h1 className="text-2xl font-semibold">AI Assistant</h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pb-0">
          <div className="max-w-[1200px] mx-auto flex gap-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'chat' ? 'text-white' : 'text-white/60 hover:text-white/80'
              }`}
            >
              Chat
              {activeTab === 'chat' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'upload' ? 'text-white' : 'text-white/60 hover:text-white/80'
              }`}
            >
              Upload
              {activeTab === 'upload' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-t-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-8 py-6">
        {activeTab === 'chat' ? (
          <div className="flex flex-col gap-6">
            <AIpageTop />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <AIpagemain />
            </div>
          </div>
        ) : (
          <Upload />
        )}
      </div>
    </div>
  );
};

export default TabletAIPage; 