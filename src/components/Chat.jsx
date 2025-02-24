import React, { useState, useRef, useCallback, useEffect } from 'react';
import { IoClose, IoSend } from 'react-icons/io5';
import { BsArrowRightCircleFill } from 'react-icons/bs';
import { FaImage, FaFile, FaTimes } from 'react-icons/fa';
import ImageViewer from './ImageViewer';
import { apiService } from '../services/api/apiService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Storage keys
const CHAT_HISTORY_KEY = 'chat_history';

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
  const [messages, setMessages] = useState(() => {
    // Initialize messages from localStorage
    try {
      const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  });
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const clearChatHistory = useCallback(() => {
    setMessages([]);
    setUploadedFiles([]);
    setMessage('');
    try {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }, []);

  // Clear chat history when consultation is closed
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'consultation_id' && !e.newValue) {
        clearChatHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clearChatHistory]);

  const handleSendMessage = async () => {
    if (message.trim() || uploadedFiles.length > 0) {
      // Add user message
      const userMessage = {
        text: message,
        files: [...uploadedFiles],
        isUser: true,
        timestamp: new Date().toISOString() // Use ISO string for better storage
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setMessage('');
      setUploadedFiles([]);
      setIsLoading(true);

      try {
        // Get AI response
        const aiResponse = await apiService.chatWithAI(message);
        
        // Add AI response
        setMessages(prevMessages => [
          ...prevMessages,
          {
            text: aiResponse,
            files: [],
            isUser: false,
            timestamp: new Date().toISOString()
          }
        ]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        // Add error message
        setMessages(prevMessages => [
          ...prevMessages,
          {
            text: "Sorry, I couldn't process your message at this time. Please try again.",
            files: [],
            isUser: false,
            timestamp: new Date().toISOString()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
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
      setUploadedFiles([]); // Only clear uploaded files
      setMessage(''); // Only clear current message
      // Don't clear messages here as we want to persist them
    }, 300);
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
          <div key={`${index}-${message.timestamp}`} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
           
          </div>
        ))}
        <div ref={messagesEndRef} />
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
              className={`fixed inset-x-0 bottom-0 ${window.innerWidth > 700 ? 'w-full right-0' : 'w-[calc(100vw-32px)] right-4'} max-w-[1000px] bg-white rounded-t-2xl shadow-lg overflow-hidden ${
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
                <div className="flex items-center gap-2">
                  <button 
                    className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={clearChatHistory}
                  >
                    Clear All
                  </button>
                  <button 
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    onClick={handleClose}
                  >
                    <IoClose className="text-gray-500 text-xl" />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="h-[400px] sm:h-[450px] overflow-y-auto p-6 space-y-6">
                {messages.map((msg, msgIndex) => (
                  <div 
                    key={`${msgIndex}-${msg.timestamp}`}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.files && msg.files.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {msg.files.map((file, fileIndex) => (
                          <div key={`${msgIndex}-${fileIndex}-${file.name}`} className="relative">
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
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {/* Loading Animation */}
                {isLoading && (
                  <div className="w-14 h-14">
                    <DotLottieReact
                      src="https://lottie.host/933b7f18-54a3-418a-97fe-20ffd9eb7511/B4UuhcVBw0.lottie"
                      loop
                      autoplay
                    />
                  </div>
                )}
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
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      disabled={isLoading}
                    />
                    <button 
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                      }`}
                      onClick={handleSendMessage}
                      disabled={isLoading}
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

      {/* Image Viewer */}
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
