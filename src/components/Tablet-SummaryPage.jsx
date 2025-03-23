import React, { useState, useEffect, useRef } from 'react';
import PatientDetails from './PatientDetails';
import Chat from './Chat';
import Reports from './Reports';
import ConfirmationPopup from './ConfirmationPopup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearMedicalRecord } from '../store/medicalRecordSlice';
import apiService from '../services/api/apiService';
import { IoClose } from 'react-icons/io5';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import Feedback from './Feedback';

const TabletSummaryPage = ({ patientId = 1 }) => {
  const [scheduledData, setScheduledData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Move useSelector to component level
  const consultation_id = useSelector(state => state.medicalRecord.consultation_id) || 
    localStorage.getItem('consultation_id');

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // First capture all chart images before any DOM manipulation
      const reportsSection = contentRef.current.querySelector('.bg-white.rounded-xl.shadow-lg.overflow-hidden');
      if (!reportsSection) {
        throw new Error('Reports section not found');
      }

      // Wait for charts to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capture all canvas images first
      const canvases = reportsSection.querySelectorAll('canvas');
      const chartImages = await Promise.all(
        Array.from(canvases).map(async (canvas) => {
          try {
            const chartContainer = canvas.closest('.aspect-square') || canvas.parentElement;
            const chartHeight = chartContainer ? chartContainer.offsetHeight : 400;
            
            // Get the computed styles
            const computedStyle = window.getComputedStyle(canvas);
            const width = parseInt(computedStyle.width);
            const height = parseInt(computedStyle.height);

            // Create a temporary canvas for high-quality capture
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width * 2;
            tempCanvas.height = height * 2;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.scale(2, 2);
            tempCtx.drawImage(canvas, 0, 0, width, height);
            
            return {
              dataUrl: tempCanvas.toDataURL('image/png', 1.0),
              height: chartHeight
            };
          } catch (e) {
            console.error('Error capturing canvas:', e);
            return null;
          }
        })
      );

      // Create container for PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.width = '800px';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.backgroundColor = 'white';
      
      // Clone the reports section
      const clonedReports = reportsSection.cloneNode(true);
      
      // Remove any buttons or interactive elements
      const elementsToRemove = clonedReports.querySelectorAll('button, [role="button"], .chat-section');
      elementsToRemove.forEach(el => el.remove());

      // Replace canvas elements with captured images
      const clonedCanvases = clonedReports.querySelectorAll('canvas');
      clonedCanvases.forEach((canvas, index) => {
        const chartImage = chartImages[index];
        if (chartImage) {
          const chartWrapper = document.createElement('div');
          chartWrapper.className = 'chart-container';
          chartWrapper.style.width = '100%';
          chartWrapper.style.maxWidth = '700px';
          chartWrapper.style.height = `${chartImage.height}px`;
          chartWrapper.style.margin = '20px auto';
          chartWrapper.style.position = 'relative';
          chartWrapper.style.backgroundColor = 'white';

          const img = new Image();
          img.src = chartImage.dataUrl;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          img.style.display = 'block';

          chartWrapper.appendChild(img);
          
          const container = canvas.closest('.aspect-square') || canvas.parentElement;
          if (container) {
            container.replaceWith(chartWrapper);
          } else {
            canvas.replaceWith(chartWrapper);
          }
        }
      });

      pdfContainer.appendChild(clonedReports);

      // Configure PDF options
      const opt = {
        margin: [15, 15],
        filename: 'medical-summary.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 800,
          windowWidth: 800,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            const style = clonedDoc.createElement('style');
            style.textContent = `
              body {
                margin: 0;
                padding: 0;
                background: white;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              div {
                page-break-inside: avoid;
                margin-bottom: 20px;
              }
              h2, h3, h4 {
                margin-top: 20px;
                margin-bottom: 10px;
                color: #1f2937 !important;
              }
              p {
                margin-bottom: 10px;
                color: #374151 !important;
              }
              .chart-container {
                width: 100% !important;
                max-width: 700px !important;
                margin: 20px auto !important;
                page-break-inside: avoid !important;
                background-color: white !important;
              }
              .chart-container img {
                max-width: 100% !important;
                height: auto !important;
                display: block !important;
                margin: 0 auto !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        jsPDF: { 
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
          hotfixes: ['px_scaling']
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['.chart-container', 'img']
        }
      };

      // Add the container to the document temporarily
      document.body.appendChild(pdfContainer);
      
      // Generate PDF
      try {
        await html2pdf().set(opt).from(pdfContainer).save();
      } finally {
        // Clean up
        document.body.removeChild(pdfContainer);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCloseConsultation = async (isAutoClose = false) => {
    if (!consultation_id) {
      console.error('No consultation ID found');
      navigate('/ai');
      return;
    }

    try {
      if (!isAutoClose) {
        setShowCloseDialog(true);
        return;
      }

      await apiService.closeConsultation(consultation_id);
      
      // Clear Redux state
      dispatch(clearMedicalRecord());
      
      // Clear localStorage
      localStorage.removeItem('chat_history');
      localStorage.removeItem('medicalRecord');
      
      navigate('/closecase');
    } catch (error) {
      console.error('Error closing consultation:', error);
      if (!isAutoClose) {
        navigate('/ai');
      }
    }
  };

  const handleConfirmCloseConsultation = async () => {
    setShowCloseDialog(false);
    setIsClosing(true);
    try {
      await apiService.closeConsultation(consultation_id);
      dispatch(clearMedicalRecord());
      localStorage.removeItem('chat_history');
      localStorage.removeItem('medicalRecord');
    } catch (error) {
      console.error('Error closing consultation:', error);
      navigate('/ai');
    } finally {
      setIsClosing(false);
    }
  };

  const handleFollowupScheduled = (data) => {
    setScheduledData(data);
    console.log('Followup scheduled:', data);
  };

  const handleCloseCaseClick = () => {
    console.log('Close case clicked');
  };

  const handleClose = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    console.log('Close confirmed');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Main Container with max-width for larger screens */}
      <div ref={contentRef} className={`max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 ${isChatActive ? 'blur-sm' : ''}`}>
        <div className="grid md:grid-cols-[2fr,1fr] lg:grid-cols-[3fr,1fr] gap-6">
          {/* Left Column - Reports and Visualizations */}
          <div className="space-y-6">
            {/* Reports Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Reports 
                onFollowupScheduled={handleFollowupScheduled}
                onCloseCaseClick={handleCloseCaseClick}
                patientId={patientId}
                isChatActive={isChatActive}
                layout="vertical"
              />
            </div>
          </div>

          {/* Right Column - Patient Details */}
          <div className="md:sticky md:top-0 md:h-screen md:pt-6">
            <PatientDetails 
              patientId={patientId} 
              onClose={handleClose}
              className="md:max-h-[calc(100vh-2rem)] md:overflow-auto"
            />
            
            {/* Action Buttons */}
            <div className="mt-6 mb-6 space-y-3">
              {/* Download PDF Button */}
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl bg-blue-500 text-white text-sm sm:text-base font-medium hover:bg-blue-600 transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
              >
                <FaDownload className={isDownloading ? 'animate-bounce' : ''} />
                {isDownloading ? 'Generating PDF...' : 'Download Summary'}
              </button>

              {/* Close Consultation Button */}
              <button 
                data-close-consultation
                className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl border-2 border-gray-200 text-gray-600 text-sm sm:text-base font-medium hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200 ease-in-out"
                onClick={() => handleCloseConsultation(false)}
              >
                Close Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section - Fixed at bottom on tablet/desktop */}
      <div className="fixed bottom-0 right-0 w-full md:w-[60%] md:max-w-[1800px] md:mx-4 lg:mx-8 z-50">
        <Chat patientId={patientId} onChatOpen={() => setIsChatActive(true)} onChatClose={() => setIsChatActive(false)} />
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <ConfirmationPopup 
            onConfirm={handleConfirmClose}
            onCancel={() => setShowConfirmation(false)}
            className="max-w-md w-full"
          />
        </div>
      )}

      {/* Loading Animation Overlay */}
      {isClosing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="flex flex-col items-center">
            <DotLottieReact
              src="https://lottie.host/8ec6217f-6134-4270-87c7-f9c1d7791ad6/0UUi8AV9NM.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
            <p className="mt-4 text-gray-600 text-lg">Closing consultation...</p>
          </div>
        </div>
      )}

      {/* Close Consultation Dialog */}
      {showCloseDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Close Consultation</h3>
              <button 
                onClick={() => setShowCloseDialog(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to close this consultation? This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmCloseConsultation}
                className="w-full px-4 py-2 bg-[#3973EB] text-white rounded-xl font-medium hover:bg-[#2960d8] transition-colors"
              >
                Close Consultation
              </button>
              
              {/* Feedback Button with Animation */}
              <button
                onClick={() => setShowFeedback(true)}
                className="w-full px-4 py-2 bg-white text-[#3973EB] border-2 border-[#3973EB] rounded-xl font-medium 
                         hover:bg-blue-50 transition-colors relative animate-pulse hover:animate-none"
              >
                Share Your Feedback
              </button>

              <button
                onClick={() => setShowCloseDialog(false)}
                className="w-full px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
              <button 
                onClick={() => setShowFeedback(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="p-6">
              <Feedback onClose={() => setShowFeedback(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabletSummaryPage;