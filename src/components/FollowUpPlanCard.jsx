import React from 'react';

const FollowUpPlanCard = ({ data, isCollapsed, CardHeader }) => {
  return (
    <div className="mb-6">
      <CardHeader title="Follow-up Plan" section="followup" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            {/* Appointments */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Appointments</h4>
              <div className="space-y-4">
                {data.appointments.map((appointment, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-800 mb-1">{appointment.specialist}</p>
                    <p className="text-gray-700 mb-2">Purpose: {appointment.purpose}</p>
                    <p className="text-sm text-gray-600">Timeframe: {appointment.timeframe}</p>
                    {appointment.preparation[0] !== "Not Available" && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Preparation:</p>
                        <ul className="list-disc pl-4 text-sm text-gray-600">
                          {appointment.preparation.map((prep, i) => (
                            <li key={i}>{prep}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Care Coordination */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Care Coordination</h4>
              <div className="space-y-2">
                {data.care_coordination.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monitoring */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Monitoring</h4>
              <div className="space-y-2">
                {data.monitoring.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Signs */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Warning Signs</h4>
              <div className="space-y-2">
                {data.warning_signs.map((sign, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <p className="text-gray-700">{sign}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpPlanCard;