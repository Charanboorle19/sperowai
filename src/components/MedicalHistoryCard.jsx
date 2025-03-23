import React from 'react';

const MedicalHistoryCard = ({ data, isCollapsed, CardHeader }) => {
  if (!data) return null;

  return (
    <div className="mb-6">
      <CardHeader title="Medical History" section="history" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-gray-800">Allergies</h4>
              <ul className="mt-2 text-gray-600">
                {Array.isArray(data.allergies) && data.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-gray-800">Past Conditions</h4>
              <ul className="mt-2 text-gray-600">
                {Array.isArray(data.past_conditions) && data.past_conditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-gray-800">Family History</h4>
              <ul className="mt-2 text-gray-600">
                {Array.isArray(data.family_history) && data.family_history.map((history, index) => (
                  <li key={index}>{history}</li>
                ))}
              </ul>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-gray-800">Social History</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-gray-500">Environmental Factors:</span>
                  <ul className="text-gray-600">
                    {data.social_history && Array.isArray(data.social_history.environmental_factors) && 
                      data.social_history.environmental_factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))
                    }
                  </ul>
                </div>
                <div>
                  <span className="text-gray-500">Habits:</span>
                  <ul className="text-gray-600">
                    {data.social_history && Array.isArray(data.social_history.habits) && 
                      data.social_history.habits.map((habit, index) => (
                        <li key={index}>{habit}</li>
                      ))
                    }
                  </ul>
                </div>
                <div>
                  <span className="text-gray-500">Lifestyle:</span>
                  <ul className="text-gray-600">
                    {data.social_history && Array.isArray(data.social_history.lifestyle) && 
                      data.social_history.lifestyle.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-100 last:border-0 pb-4">
              <h4 className="font-medium text-gray-800">Surgeries</h4>
              <ul className="mt-2 text-gray-600">
                {Array.isArray(data.surgeries) && data.surgeries.map((surgery, index) => (
                  <li key={index}>{surgery}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryCard;