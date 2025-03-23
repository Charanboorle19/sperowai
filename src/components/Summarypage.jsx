import React, { useState, useRef } from 'react';
import PatientDetails from './PatientDetails';
import Chat from './Chat';
import Reports from './Reports';
import ConfirmationPopup from './ConfirmationPopup';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearMedicalRecord } from '../store/medicalRecordSlice';
import apiService from '../services/api/apiService';
import { IoClose } from 'react-icons/io5';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import Feedback from './Feedback';

const SummaryPage = () => {
  const [scheduledData, setScheduledData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const consultation_id = useSelector(state => state.medicalRecord.consultation_id);

  if (!consultation_id) {
    return <Navigate to="/" replace />;
  }

  // PDF Download Logic (Copied from Desktop Version)
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);

    try {
      const reportsSection = contentRef.current.querySelector('.bg-white.rounded-xl.shadow-lg.overflow-hidden');
      if (!reportsSection) {
        throw new Error('Reports section not found');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvases = reportsSection.querySelectorAll('canvas');
      const chartImages = await Promise.all(
        Array.from(canvases).map(async (canvas) => {
          try {
            const chartContainer = canvas.closest('.aspect-square') || canvas.parentElement;
            const chartHeight = chartContainer ? chartContainer.offsetHeight : 400;

            const computedStyle = window.getComputedStyle(canvas);
            const width = parseInt(computedStyle.width);
            const height = parseInt(computedStyle.height);

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width * 2;
            tempCanvas.height = height * 2;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.scale(2, 2);
            tempCtx.drawImage(canvas, 0, 0, width, height);

            return {
              dataUrl: tempCanvas.toDataURL('image/png', 1.0),
              height: chartHeight,
            };
          } catch (e) {
            console.error('Error capturing canvas:', e);
            return null;
          }
        })
      );

      const pdfContainer = document.createElement('div');
      pdfContainer.style.width = '800px';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.backgroundColor = 'white';

      const clonedReports = reportsSection.cloneNode(true);
      const elementsToRemove = clonedReports.querySelectorAll('button, [role="button"], .chat-section');
      elementsToRemove.forEach((el) => el.remove());

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
          },
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
          hotfixes: ['px_scaling'],
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['.chart-container', 'img'],
        },
      };

      document.body.appendChild(pdfContainer);

      try {
        await html2pdf().set(opt).from(pdfContainer).save();
      } finally {
        document.body.removeChild(pdfContainer);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
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

  const handleConfirmClose = async () => {
    try {
      if (consultation_id) {
        await apiService.closeConsultation(consultation_id);
        dispatch(clearMedicalRecord());
        localStorage.removeItem('chat_history');
        localStorage.removeItem('medicalRecord');
      }
      navigate('/closecase');
    } catch (error) {
      console.error('Error closing consultation:', error);
    }
  };

  const handleChatToggle = (isOpen) => {
    setShowChat(isOpen);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className={showChat ? 'blur-sm' : ''}>
        {/* Fixed Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="max-w-[440px] mx-auto">
            <div className="flex items-center justify-between px-4 py-4">
              {/* Empty navigation for now */}
            </div>
          </div>
        </div>

        {/* Main Content with proper top spacing */}
        <div className="pt-16">
          {/* Scroll Block */}
          <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50 via-gray-50 to-transparent z-10" />

          {/* Content Container */}
          <div className="max-w-[440px] mx-auto">
            {/* Patient Details */}
            <div className="px-4 mb-1">
              <PatientDetails />
            </div>

            {/* Reports and Action Buttons */}
            <div className="px-4 pt-1">
              <Reports
                onFollowupScheduled={handleFollowupScheduled}
                onCloseCaseClick={handleCloseCaseClick}
                consultation_id={consultation_id}
              />

              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl bg-blue-500 text-white text-sm sm:text-base font-medium hover:bg-blue-600 transition-all duration-200 ease-in-out flex items-center justify-center gap-2 mt-4"
              >
                <FaDownload className={isDownloading ? 'animate-bounce' : ''} />
                {isDownloading ? 'Generating PDF...' : 'Download Summary'}
              </button>

              {/* Close Consultation Button */}
              <button
                onClick={handleClose}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl border-2 border-gray-200 text-gray-600 text-sm sm:text-base font-medium hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200 ease-in-out flex items-center justify-center mt-4"
              >
                Close Consultation
              </button>

              {/* Feedback Button */}
              <button
                onClick={() => setShowFeedback(true)}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl bg-white text-[#3973EB] border-2 border-[#3973EB] text-sm sm:text-base font-medium hover:bg-blue-50 transition-colors flex items-center justify-center mt-4"
              >
                Share Your Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <div className="fixed bottom-24 right-4 z-30">
        <Chat
          consultation_id={consultation_id}
          onToggle={handleChatToggle}
        />
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <ConfirmationPopup
            onConfirm={handleConfirmClose}
            onCancel={() => setShowConfirmation(false)}
          />
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

export default SummaryPage;