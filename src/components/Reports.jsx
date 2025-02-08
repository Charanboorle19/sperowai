import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';

// Import patient data
import patientData from './patient3.json';

const Reports = ({ onCloseCaseClick, onFollowupScheduled, patientId, isChatActive }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showFilter, setShowFilter] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [availableSections, setAvailableSections] = useState([]);
  const navigate = useNavigate();
  
  // Create refs object at component level
  const sectionRefs = useRef({});
  const observerRef = useRef(null);
  const buttonsContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Define all sections based on patient3.json structure
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

  // Initialize section refs
  useEffect(() => {
    setAvailableSections(sections);

    // Initialize refs
    sectionRefs.current = sections.reduce((acc, section) => {
      acc[section.id] = React.createRef();
      return acc;
    }, {});
  }, []);

  // Initialize intersection observer with adjusted thresholds
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            // Update active tab with a slight delay to be ahead of scroll
            requestAnimationFrame(() => {
              setActiveTab(sectionId);
              
              // Scroll the button into view if needed
              const button = document.querySelector(`[data-button="${sectionId}"]`);
              if (button) {
                button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            });
          }
        });
      },
      {
        threshold: 0.1, // Reduced threshold to trigger earlier
        rootMargin: '-10% 0px -85% 0px' // Adjusted to trigger before the section is fully in view
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Initialize section refs and observers
  useEffect(() => {
    setAvailableSections(sections);

    // Initialize refs
    sectionRefs.current = sections.reduce((acc, section) => {
      acc[section.id] = React.createRef();
      return acc;
    }, {});

    // Start observing sections
    setTimeout(() => {
      sections.forEach(section => {
        const element = sectionRefs.current[section.id]?.current;
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 100);
  }, []);

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

  // Add renderSection function
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return (
          <PatientSummaryCard 
            data={patientData.patient_demographics}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'visualization':
        return (
          <Visualization 
            data={patientData.visualization}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'vitals':
        return (
          <VitalSignsCard 
            data={patientData.vital_signs}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'complaint':
        return (
          <ChiefComplaintCard 
            data={patientData.chief_complaint}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'history':
        return (
          <MedicalHistoryCard 
            data={patientData.medical_history}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'symptoms':
        return (
          <SymptomsTimelineCard 
            data={patientData.current_symptoms}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'labs':
        return (
          <LabResultsCard 
            data={patientData.lab_results}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'diagnoses':
        return (
          <DiagnosesCard 
            data={patientData.diagnoses}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'medications':
        return (
          <MedicationsCard 
            data={patientData.medications}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'treatment':
        return (
          <TreatmentPlanCard 
            data={patientData.treatment_plan}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
      case 'followup':
        return (
          <FollowUpPlanCard 
            data={patientData.follow_up_plan}
            isCollapsed={collapsedSections[sectionId]}
            CardHeader={CardHeader}
          />
        );
    }
  };

  const handleFollowupSubmit = (data) => {
    setShowFollowup(false);
    if (onFollowupScheduled) {
      onFollowupScheduled(data);
    }
  };

  const checkScroll = () => {
    const container = buttonsContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = buttonsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

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

  return (
    <div className={`w-full max-w-2xl mx-auto px-2 sm:px-4 ${isChatActive ? 'blur-sm' : ''}`}>
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

      {/* Content */}
      <div className="pt-4">
        {availableSections.map(section => (
          <div 
            key={section.id} 
            ref={sectionRefs.current[section.id]}
            data-section={section.id}
            className="scroll-mt-24" // Added to improve scroll positioning
          >
            {renderSection(section.id)}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="mt-6 mb-20">
          <div className="flex gap-2 sm:gap-4">
            <button 
              className="flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-xl border-2 border-gray-200 text-gray-600 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/closecase')}
            >
              Close Case
            </button>
            
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Reports; 