import React from 'react';

const LabResultsCard = ({ data, isCollapsed, CardHeader }) => {
  return (
    <div className="mb-6">
      <CardHeader title="Lab Results" section="labs" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-8">
            {/* Critical Values */}
            {data.critical_values.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="text-red-700 font-medium mb-2">Critical Values</h4>
                <ul className="list-disc list-inside text-red-600">
                  {data.critical_values.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Test Results */}
              <div className="space-y-6">
              {data.tests.map((test, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-blue-100">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100">
                      <div className="w-2 h-2 rounded-full bg-blue-500 m-1"></div>
                    </div>
                    <div className="mb-3">
                    <span className="text-sm font-medium text-blue-600">{test.timestamp}</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-800">{test.name}</h5>
                      <span className={`text-sm px-2 py-1 rounded ${
                        test.trend === "Elevated" ? "bg-red-100 text-red-700" :
                        test.trend === "Upper limit of normal" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {test.trend}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700">Value: {test.value} {test.unit}</p>
                      <p className="text-sm text-gray-500">Reference Range: {test.reference_range}</p>
                      <p className="text-sm text-gray-600">{test.clinical_significance}</p>
                      {test.action_needed !== "Not Required" && (
                        <p className="text-sm font-medium text-blue-600">Action: {test.action_needed}</p>
                      )}
                    </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResultsCard;