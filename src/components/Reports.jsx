import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaFilter, FaChevronUp, FaChevronDown, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
// import Filter from './Filter';  // Commented out Filter import
import FollowupCard from './Followupcard';
import FollowupPage from './followuppage';

// Import renamed/updated components
import PatientSummaryCard from './PatientSummaryCard';
import VitalSignsCard from './VitalSignsCard';
import ChiefComplaintCard from './ChiefComplaintCard';
import MedicalHistoryCard from './MedicalHistoryCard';
import SymptomsTimelineCard from './SymptomsTimelineCard';
import LabResultsCard from './LabResultsCard';
import DiagnosesCard from './DiagnosesCard';
import MedicationsCard from './MedicationsCard';
import TreatmentPlanCard from './TreatmentPlanCard';
import FollowUpPlanCard from './FollowUpPlanCard';
import Visualization from './Visualization';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import apiService from '../services/api/apiService';
import { clearMedicalRecord } from '../store/medicalRecordSlice';

const Reports = ({ onCloseCaseClick, onFollowupScheduled, isChatActive }) => {
  // Define sections first, before any hooks or state
  const sections = [
    { id: 'summary', label: 'Patient Summary' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'vitals', label: 'Vital Signs' },
    { id: 'complaint', label: 'Chief Complaint' },
    { id: 'history', label: 'Medical History' },
    { id: 'symptoms', label: 'Symptoms Timeline' },
    { id: 'labs', label: 'Lab Results' },
    { id: 'diagnoses', label: 'Diagnoses' },
    { id: 'medications', label: 'Medications' },
    { id: 'treatment', label: 'Treatment Plan' },
    { id: 'followup', label: 'Follow-up Plan' }
  ];

  // State declarations
  const [activeTab, setActiveTab] = useState('summary');
  const [showFilter, setShowFilter] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [availableSections, setAvailableSections] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get consultation data from Redux or localStorage
  const consultation_id = useSelector(state => state.medicalRecord.consultation_id) || 
    localStorage.getItem('consultation_id');
  const medicalRecord = useSelector(state => state.medicalRecord);
  const { summary } = medicalRecord || JSON.parse(localStorage.getItem('medicalRecord') || '{}');

  const dispatch = useDispatch();

  // Save consultation data to localStorage whenever it changes
  useEffect(() => {
    if (consultation_id) {
      localStorage.setItem('consultation_id', consultation_id);
    }
    if (medicalRecord) {
      localStorage.setItem('medicalRecord', JSON.stringify(medicalRecord));
    }
  }, [consultation_id, medicalRecord]);

  // Create refs object at component level
  const sectionRefs = useRef({});
  const observerRef = useRef(null);
  const buttonsContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Add timeout tracking
  const [lastActivity, setLastActivity] = useState(Date.now());
  const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds

  // Track user activity
  const updateLastActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // 1. First, group ALL useEffect hooks together at the top
  // Check for consultation access
  useEffect(() => {
    if (location.pathname === '/summary' && !consultation_id) {
      console.error('No consultation ID found');
      navigate('/ai');
      return;
    }

    if (consultation_id && !summary) {
      console.error('No medical record data found for consultation:', consultation_id);
      navigate('/ai');
      return;
    }
  }, [location.pathname, consultation_id, summary, navigate]);

  // Handle inactivity timeout
  useEffect(() => {
    const inactivityCheck = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        console.log('User inactive for 20 minutes, auto-closing consultation');
        handleCloseConsultation(true);
      }
    }, 60000);

    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('click', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);

    return () => {
      clearInterval(inactivityCheck);
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('scroll', updateLastActivity);
    };
  }, [lastActivity, updateLastActivity]);

  // Initialize available sections
  useEffect(() => {
    if (summary) {
      const availableSectionsData = sections.filter(section => {
        switch (section.id) {
          case 'summary':
            return !!summary?.patient_demographics;
          case 'visualization':
            return !!summary?.visualizations?.length;
          case 'vitals':
            return !!summary?.vital_signs?.measurements?.length;
          case 'complaint':
            return !!summary?.chief_complaints;
          case 'symptoms':
            return !!summary?.symptoms_timeline?.length;
          case 'labs':
            return !!summary?.lab_results;
          case 'diagnoses':
            return !!summary?.diagnosis;
          case 'medications':
            return !!summary?.medications?.length;
          case 'treatment':
            return !!summary?.treatment_plan;
          case 'followup':
            return !!summary?.follow_up_plan;
          default:
            return false;
        }
      });
      setAvailableSections(availableSectionsData);
    }
  }, [summary]);

  // Initialize section refs
  useEffect(() => {
    setAvailableSections(sections);
    sectionRefs.current = sections.reduce((acc, section) => {
      acc[section.id] = React.createRef();
      return acc;
    }, {});
  }, []);

  // Initialize intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            requestAnimationFrame(() => {
              setActiveTab(sectionId);
              const button = document.querySelector(`[data-button="${sectionId}"]`);
              if (button) {
                button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-10% 0px -85% 0px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Start observing sections
  useEffect(() => {
    const timer = setTimeout(() => {
      sections.forEach(section => {
        const element = sectionRefs.current[section.id]?.current;
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Prevent navigation/reload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Don't prevent reload, just show warning
      e.returnValue = 'Are you sure you want to leave? Please make sure to close the consultation properly.';
      return e.returnValue;
    };

    const handlePopState = (e) => {
      e.preventDefault();
      alert('Please close the consultation before leaving.');
      window.history.pushState(null, '', window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Scroll container effects
  useEffect(() => {
    const container = buttonsContainerRef.current;
    if (container) {
      const checkScroll = () => {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      };
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  // 2. After ALL hooks, we can have our conditional return
  if (!consultation_id || !summary) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-gray-600">Loading medical record...</p>
        </div>
      </div>
    );
  }

  // Improved scroll to section function
  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId); // Update active tab immediately

    const element = sectionRefs.current[sectionId]?.current;
    if (element) {
      // Calculate offset with extra padding to account for header
      const headerOffset = 100; // Increased offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Smooth scroll with better timing
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Ensure section is expanded
      setCollapsedSections(prev => ({
        ...prev,
        [sectionId]: false
      }));
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Card Header Component
  const CardHeader = ({ title, section }) => (
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-gray-800 font-semibold">{title}</h3>
      <button 
        onClick={() => toggleSection(section)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {collapsedSections[section] ? (
          <FaChevronDown className="text-gray-400 text-sm" />
        ) : (
          <FaChevronUp className="text-gray-400 text-sm" />
        )}
      </button>
    </div>
  );

  // Render section with null checks
  const renderSection = (sectionId) => {
    if (!summary) return null;

    switch (sectionId) {
      case 'summary':
        return summary.patient_demographics ? (
          <PatientSummaryCard 
            data={summary.patient_demographics}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        ) : null;
      case 'visualization':
        return summary.visualizations ? (
          <Visualization 
            data={summary.visualizations}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        ) : null;
      case 'vitals':
        return summary.vital_signs ? (
          <VitalSignsCard 
            data={summary.vital_signs}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        ) : null;
      case 'complaint':
        return summary.chief_complaints ? (
          <ChiefComplaintCard 
            data={summary.chief_complaints}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        ) : null;
      case 'history':
        return (
          <MedicalHistoryCard 
            data={summary.medical_history}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'symptoms':
        return (
          <SymptomsTimelineCard 
            data={summary.symptoms_timeline}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'labs':
        return (
          <LabResultsCard 
            data={summary.lab_results}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'diagnoses':
        return (
          <DiagnosesCard 
            data={summary.diagnosis}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'medications':
        return summary.medications ? (
          <MedicationsCard 
            data={summary.medications}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        ) : null;
      case 'treatment':
        return (
          <TreatmentPlanCard 
            data={summary.treatment_plan}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'followup':
        return (
          <FollowUpPlanCard 
            data={summary.follow_up_plan}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      default:
        return null;
    }
  };

  const handleFollowupSubmit = (data) => {
    setShowFollowup(false);
    if (onFollowupScheduled) {
      onFollowupScheduled(data);
    }
  };

  const handleScrollLeft = () => {
    const container = buttonsContainerRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      container.scroll({
        left: currentScroll - 200,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollRight = () => {
    const container = buttonsContainerRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      container.scroll({
        left: currentScroll + 200,
        behavior: 'smooth'
      });
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
        const confirmed = window.confirm('Are you sure you want to close this consultation?');
        if (!confirmed) return;
      }

      await apiService.closeConsultation(consultation_id);
      
      // Clear Redux state
      dispatch(clearMedicalRecord());
      
      // Clear localStorage
      localStorage.removeItem('consultation_id');
      localStorage.removeItem('medicalRecord');
      
      navigate('/closecase');
    } catch (error) {
      console.error('Error closing consultation:', error);
      if (!isAutoClose) {
        navigate('/ai');
      }
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto px-2 sm:px-4 ${isChatActive ? 'blur-sm' : ''}`}>
      {/* Only render sections if we have data */}
      {summary && (
        <>
          {/* Navigation */}
          <div className="z-10 bg-[#F8FAFC] shadow-sm -mx-2 sm:-mx-4">
            <div className="py-4 px-2 sm:px-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex overflow-x-auto hide-scrollbar relative">
                  {/* Left Scroll Button */}
                  {canScrollLeft && (
                    <button
                      onClick={handleScrollLeft}
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-full px-4 bg-gradient-to-r from-[#F8FAFC] to-transparent flex items-center z-10"
                      aria-label="Scroll left"
                    >
                      <FaChevronLeft className="text-gray-400 text-xl" />
                    </button>
                  )}

                  <div 
                    ref={buttonsContainerRef}
                    className="flex gap-3 min-w-0 w-full overflow-x-auto hide-scrollbar px-10"
                  >
                    {availableSections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`
                          px-6 py-2.5 rounded-full text-sm 
                          whitespace-nowrap transition-all flex-shrink-0 font-medium
                          ${activeTab === section.id
                            ? 'bg-[#3973EB] text-white shadow-sm transform duration-200'
                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:scale-105 transform duration-200'
                          }
                        `}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Right Scroll Button */}
                  {canScrollRight && (
                    <button
                      onClick={handleScrollRight}
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-4 bg-gradient-to-l from-[#F8FAFC] to-transparent flex items-center z-10"
                      aria-label="Scroll right"
                    >
                      <FaChevronRight className="text-gray-400 text-xl" />
                    </button>
                  )}
                </div>
                {/* Commented out Filter button
                <div className="flex-shrink-0">
                  <Filter showFilter={showFilter} setShowFilter={setShowFilter} />
                </div>
                */}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="pt-4">
            {availableSections.map(section => (
              <div 
                key={section.id} 
                ref={sectionRefs.current[section.id]}
                data-section={section.id}
                className="scroll-mt-24"
              >
                {renderSection(section.id)}
              </div>
            ))}

            {/* Action Buttons */}
            <div className="mt-6 mb-20">
              <div className="flex gap-2 sm:gap-4">
                <button 
                  data-close-consultation
                  className="flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-xl border-2 border-gray-200 text-gray-600 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => handleCloseConsultation(false)}
                >
                  Close Consultation
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports; 