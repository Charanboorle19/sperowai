import React from 'react';

const BloodTestsCard = ({ data, isCollapsed, CardHeader }) => {
  if (!data || typeof data !== 'object') return null;

  // Each component handles its own data mapping
  const renderTests = () => {
    try {
      return Object.entries(data).map(([testName, testData], index) => (
        <div key={index} className="border-b border-gray-100 last:border-0 py-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">{testName}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{testData?.value || testData}</span>
              {testData?.unit && <span className="text-gray-500 text-sm">{testData.unit}</span>}
            </div>
          </div>
          {testData?.reference && (
            <div className="text-sm text-gray-500 mt-1">
              Reference: {testData.reference}
            </div>
          )}
        </div>
      ));
    } catch (error) {
      console.error('Error rendering blood tests:', error);
      return <p className="text-gray-500 text-center">Unable to display blood test results</p>;
    }
  };

  return (
    <div className="mb-6">
      <CardHeader title="Blood Tests" section="bloodTests" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            {renderTests()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodTestsCard;