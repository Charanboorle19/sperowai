import React from 'react';
import { FaRobot, FaFileUpload, FaChartLine, FaClipboardList, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DashboardMain = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <FaFileUpload className="text-blue-500 text-2xl" />,
      title: "Upload Medical Documents",
      description: "Simply upload your medical reports, prescriptions, or any health-related documents."
    },
    {
      icon: <FaRobot className="text-green-500 text-2xl" />,
      title: "AI Analysis",
      description: "Our AI system analyzes your documents and provides comprehensive medical insights."
    },
    {
      icon: <FaChartLine className="text-purple-500 text-2xl" />,
      title: "Get Insights",
      description: "Receive detailed analysis including key findings, recommendations, and health trends."
    },
    {
      icon: <FaClipboardList className="text-red-500 text-2xl" />,
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
    <div className="min-h-screen bg-[#F8FAFC] animate-swing-in-left">
      <div className="p-6">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <FaArrowLeft className="text-lg" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* How It Works Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            How to Use AI Medical Assistant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors duration-300"
          >
            Try AI Assistant Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain; 