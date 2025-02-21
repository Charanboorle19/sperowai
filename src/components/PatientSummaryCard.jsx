import React from 'react';

const PatientSummaryCard = ({ data, isCollapsed, CardHeader }) => {
  return (
    <div className="mb-6">
      <CardHeader title="Patient Summary" section="summary" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{data?.age || 'Not Available'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{data?.gender || 'Not Available'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ethnicity</p>
                <p className="font-medium">{data?.ethnicity || 'Not Available'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Occupation</p>
                <p className="font-medium">{data?.occupation || 'Not Available'}</p>
              </div>
            </div>
            {data?.risk_factors && data.risk_factors.length > 0 && (
            <div>
                <p className="text-sm text-gray-500">Risk Factors</p>
                <p className="font-medium">{data.risk_factors.join(', ')}</p>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSummaryCard;