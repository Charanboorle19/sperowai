import React from 'react';

const MedicationsCard = ({ data, isCollapsed, CardHeader }) => {
  // Early return if no data or if section is collapsed
  if (!data || isCollapsed) return null;

  // Ensure data is an array, if not, convert to empty array
  const medications = Array.isArray(data) ? data : [];

  return (
    <div className="mb-6">
      <CardHeader title="Current Medications" section="medications" />
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        {medications.length === 0 ? (
          <p className="text-gray-500 text-center">No medications data available</p>
        ) : (
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{medication.name}</h4>
                    <p className="text-gray-600">Class: {medication.class}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">
                    Indications: {medication.indications?.join(', ') || 'Not specified'}
                  </p>
                  {medication.monitoring_parameters && 
                   medication.monitoring_parameters[0] !== "Not Available" && (
                    <p className="text-sm text-gray-600">
                      Monitoring Parameters: {medication.monitoring_parameters.join(', ')}
                    </p>
                  )}
                  {medication.contraindications && 
                   medication.contraindications[0] !== "Not Available" && (
                    <p className="text-sm text-gray-600">
                      Contraindications: {medication.contraindications.join(', ')}
                    </p>
                  )}
                  {medication.interactions && 
                   medication.interactions[0] !== "Not Available" && (
                    <p className="text-sm text-gray-600">
                      Interactions: {medication.interactions.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsCard;