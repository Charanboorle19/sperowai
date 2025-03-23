import React from 'react';

const DiagnosesCard = ({ data, isCollapsed, CardHeader }) => {
  if (!data) return null;

  return (
    <div className="mb-6">
      <CardHeader title="Diagnoses" section="diagnoses" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            {/* Primary Diagnosis */}
            {data.primary && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="text-blue-700 font-medium mb-3">Primary Diagnosis</h4>
                <div className="space-y-2">
                  <p className="text-gray-800 font-medium">{data.primary.condition}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Certainty: {data.primary.certainty}
                    </span>
                    {data.primary.stage && data.primary.stage !== "Not Applicable" && (
                      <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Stage: {data.primary.stage}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Based on:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {Array.isArray(data.primary.basis) && data.primary.basis.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Diagnoses */}
            {Array.isArray(data.secondary) && data.secondary.length > 0 && (
              <div>
                <h4 className="text-gray-700 font-medium mb-3">Secondary Diagnoses</h4>
                <div className="space-y-3">
                  {data.secondary.map((diagnosis, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 rounded-xl p-4"
                    >
                      <p className="text-gray-800 font-medium mb-2">{diagnosis.condition}</p>
                      <p className="text-sm text-gray-600">Impact: {diagnosis.impact}</p>
                      <p className="text-sm text-gray-600">Relationship: {diagnosis.relationship}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Differential Diagnoses */}
            {Array.isArray(data.differential_diagnoses) && data.differential_diagnoses.length > 0 && 
             data.differential_diagnoses[0] !== "Not Available" && (
              <div>
                <h4 className="text-gray-700 font-medium mb-3">Differential Diagnoses</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {data.differential_diagnoses.map((diagnosis, index) => (
                    <li key={index}>{diagnosis}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ruled Out Diagnoses */}
            {Array.isArray(data.ruled_out) && data.ruled_out.length > 0 && 
             data.ruled_out[0] !== "Not Available" && (
              <div>
                <h4 className="text-gray-700 font-medium mb-3">Ruled Out</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {data.ruled_out.map((diagnosis, index) => (
                    <li key={index}>{diagnosis}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosesCard;