import React from 'react';
import TabletHeader from './Tablet-header';
import { FaRobot, FaFileUpload, FaChartLine, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TabletDashboard = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <FaFileUpload className="text-blue-500 text-3xl" />,
      title: "Upload Medical Documents",
      description: "Simply upload your medical reports, prescriptions, or any health-related documents."
    },
    {
      icon: <FaRobot className="text-green-500 text-3xl" />,
      title: "AI Analysis",
      description: "Our AI system analyzes your documents and provides comprehensive medical insights."
    },
    {
      icon: <FaChartLine className="text-purple-500 text-3xl" />,
      title: "Get Insights",
      description: "Receive detailed analysis including key findings, recommendations, and health trends."
    },
    {
      icon: <FaClipboardList className="text-red-500 text-3xl" />,
      title: "Review Summary",
      description: "Access a clear summary of your medical condition and treatment suggestions."
    }
  ];

  const benefits = [
    "Quick and accurate medical document analysis",
    "Easy-to-understand health insights",
    "Secure document handling",
    "24/7 access to your medical information",
    "Time-saving medical report interpretation",
    "Helps in better healthcare decision making"
  ];

  return (
    <div className="flex">
      <TabletHeader />
      <div className="flex-1 ml-[80px] relative">
        <div className="p-8 animate-swing-in-top">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">AI Medical Assistant Guide</h1>
            <p className="text-gray-500 mt-2">Learn how to use our AI-powered medical platform</p>
          </div>

          {/* Content Area */}
          <div className="max-w-7xl">
            {/* How It Works Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                How to Use AI Medical Assistant
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Benefits
              </h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="mt-12 text-center">
              <button 
                onClick={() => navigate('/')}
                className="bg-blue-500 text-white px-10 py-3 rounded-xl text-lg font-medium hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Try AI Assistant Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletDashboard; 