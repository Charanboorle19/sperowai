import React from 'react';

const ChiefComplaintCard = ({ data, isCollapsed, CardHeader }) => {
  return (
    <div className="mb-6">
      <CardHeader title="Chief Complaint" section="complaint" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-600 font-medium mb-2">Primary Complaint</h4>
              <p className="text-gray-800">{data.primary}</p>
            </div>

            {data.secondary && data.secondary.length > 0 && (
              <div>
                <h4 className="text-gray-600 font-medium mb-2">Secondary Complaints</h4>
                <ul className="list-disc list-inside text-gray-800">
                  {data.secondary.map((complaint, index) => (
                    <li key={index}>{complaint}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-gray-600 text-sm">Onset:</span>
                <p className="text-gray-800">{data.onset}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Severity:</span>
                <p className="text-gray-800">{data.severity}</p>
              </div>
            </div>

            {data.progression && (
              <div>
                <span className="text-gray-600 text-sm">Progression:</span>
                <p className="text-gray-800">{data.progression}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChiefComplaintCard;