import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BsArrowRightCircleFill } from 'react-icons/bs';
import { FaImage, FaFile, FaTimes } from 'react-icons/fa';
import ImageViewer from './ImageViewer';

const ChatIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={24} 
    height={24} 
    viewBox="0 0 24 24"
    className="text-white"
  >
    <path 
      fill="currentColor" 
      d="m19.713 8.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M15 21.538l-6-14L6.66 13H1v-2h4.34L9 2.461l6 14L17.34 11H23v2h-4.34z"
    />
  </svg>
);

const Chat = () => {
  const [showChat, setShowChat] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSendMessage = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      setMessages([...messages, {
        text: message,
        files: [...uploadedFiles],
        isUser: true,
        timestamp: new Date()
      }]);
      setMessage('');
      setUploadedFiles([]);
    }
  };

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        type: type,
        name: file.name,
        url: URL.createObjectURL(file),
        file: file
      }));
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      setShowUploadOptions(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowChat(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Function to handle image click
  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  // Function to render message content
  const renderMessageContent = (message) => {
    if (message.type === 'image') {
      return (
        <div 
          onClick={() => handleImageClick(message.content)}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img 
            src={message.content} 
            alt="Chat attachment" 
            className="max-w-[200px] rounded-lg"
          />
        </div>
      );
    } else if (message.type === 'file') {
      return (
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <span className="text-blue-500 text-sm font-medium">
              {message.content.split('.').pop().toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              {message.content}
            </p>
          </div>
        </div>
      );
    }
    return message.content;
  };

  return (
    <div className="relative">
      {/* Chat messages */}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-l-xl rounded-tr-xl' 
                : 'bg-gray-100 text-gray-800 rounded-r-xl rounded-tl-xl'
            } p-3`}>
              {renderMessageContent(message)}
            </div>
          </div>
        ))}
      </div>

      {/* Chat component */}
      <div className="fixed bottom-1 right-6 z-[9999]">
        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            className="w-14 h-14 bg-[#3973EB] rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
          >
            <ChatIcon />
          </button>
        )}

        {showChat && (
          <>
            <div 
              className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
                isClosing ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ zIndex: 9999 }}
              onClick={handleClose}
            />
            
            <div 
              className={`fixed inset-x-0 bottom-0 mx-auto w-full max-w-[400px] sm:w-[400px] bg-white rounded-2xl shadow-xl sm:right-6 sm:left-auto sm:mx-0 ${
                isClosing ? 'animate-slideDown' : 'animate-slideUp'
              }`}
              style={{ zIndex: 10000 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#3973EB] rounded-full"></div>
                  <span className="text-base font-medium text-gray-500">AI Assistant</span>
                </div>
                <button 
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  onClick={handleClose}
                >
                  <IoClose className="text-gray-500 text-xl" />
                </button>
              </div>

              {/* Messages Container */}
              <div className="h-[400px] sm:h-[450px] overflow-y-auto p-6 space-y-6">
                {messages.map((msg, msgIndex) => (
                  <div 
                    key={msgIndex}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.files && msg.files.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {msg.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="relative">
                            {file.type === 'image' ? (
                              <div 
                                onClick={() => handleImageClick(file.url)}
                                className="cursor-pointer transition-transform hover:scale-[1.02]"
                              >
                                <img 
                                  src={file.url} 
                                  alt={file.name} 
                                  className="w-48 h-48 object-cover rounded-lg"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 rounded-lg p-2 border border-gray-100">
                                <FaFile className="text-gray-400" />
                                <span className="text-sm truncate max-w-[120px]">
                                  {file.name}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.isUser 
                          ? 'bg-gray-100 text-blue-800 rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        <p className="text-base leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                {/* File Preview Area */}
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        {file.type === 'image' ? (
                          <img 
                            src={file.url} 
                            alt={file.name} 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg border border-gray-100 flex items-center justify-center">
                            <FaFile className="text-gray-400 text-xl" />
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button 
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                      onClick={() => setShowUploadOptions(!showUploadOptions)}
                    >
                      <FaImage className="text-gray-400 text-lg" />
                    </button>

                    {/* Upload Options Dropdown */}
                    {showUploadOptions && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <label className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer">
                          <FaImage className="text-gray-400" />
                          <span className="text-sm text-gray-600">Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'image')}
                          />
                        </label>
                        <label className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer border-t border-gray-100">
                          <FaFile className="text-gray-400" />
                          <span className="text-sm text-gray-600">Upload Document</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'document')}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full py-3 px-4 pr-12 bg-gray-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-gray-400/20"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      onClick={handleSendMessage}
                    >
                      <BsArrowRightCircleFill className="text-gray-700 text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Image Viewer - Now with highest z-index */}
      {selectedImage && (
        <div className="z-[100000]">
          <ImageViewer 
            imageUrl={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default Chat; 