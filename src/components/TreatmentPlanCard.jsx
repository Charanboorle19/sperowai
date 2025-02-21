import React from 'react';

const TreatmentPlanCard = ({ data, isCollapsed, CardHeader }) => {
  return (
    <div className="mb-6">
      <CardHeader title="Treatment Plan" section="treatment" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            {/* Immediate Actions */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Immediate Actions</h4>
              <div className="space-y-2">
                {data.immediate_actions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    <p className="text-gray-700">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interventions */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Interventions</h4>
              <div className="space-y-4">
                {data.interventions.map((intervention, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-800 mb-2">{intervention.type}</p>
                    <p className="text-gray-700 mb-1">{intervention.details}</p>
                    <p className="text-sm text-gray-600">Frequency: {intervention.frequency}</p>
                    <p className="text-sm text-gray-600">Expected Outcome: {intervention.expected_outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Goals</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-gray-600 text-sm mb-2">Short Term</h5>
                  <div className="space-y-2">
                    {data.short_term_goals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">•</span>
                        <p className="text-gray-700">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-gray-600 text-sm mb-2">Long Term</h5>
                  <div className="space-y-2">
                    {data.long_term_goals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">•</span>
                        <p className="text-gray-700">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoring Requirements */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Monitoring Requirements</h4>
              <div className="space-y-2">
                {data.monitoring_requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    <p className="text-gray-700">{requirement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifestyle Modifications */}
            <div>
              <h4 className="text-gray-700 font-medium mb-3">Lifestyle Modifications</h4>
              <div className="space-y-2">
                {data.lifestyle_modifications.map((modification, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    <p className="text-gray-700">{modification}</p>
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

export default TreatmentPlanCard;