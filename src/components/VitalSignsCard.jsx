import React from 'react';

const VitalSignsCard = ({ data, isCollapsed, CardHeader }) => {
  return (
    <div className="mb-6">
      <CardHeader title="Vital Signs" section="vitals" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h4 className="text-gray-700 font-medium">Current Measurements</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data?.measurements?.map((measurement) => (
                  <div key={measurement.name} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-sm text-gray-500 mb-1">
                      {measurement.name}
                    </p>
                    <p className="font-medium text-gray-800">
                      {measurement.value} {measurement.unit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {measurement.clinical_significance}
                    </p>
                    <p className="text-xs text-gray-400">
                      {measurement.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {data?.overall_stability && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <p className="text-gray-700">
                  Overall Status: <span className="font-medium">{data.overall_stability}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSignsCard;
