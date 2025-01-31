import React from 'react';

const SymptomsTimelineCard = ({ data, isCollapsed, CardHeader }) => {
  return (
    <div className="mb-6">
      <CardHeader title="Symptoms Timeline" section="symptoms" />
      {!isCollapsed && (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            {data.timeline.map((entry, index) => (
              <div key={index} className="relative pl-4 border-l-2 border-blue-100 last:border-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100">
                  <div className="w-2 h-2 rounded-full bg-blue-500 m-1"></div>
                </div>
                <div className="mb-1">
                  <span className="text-sm font-medium text-blue-600">{entry.date}</span>
                </div>
                <p className="text-gray-700">{entry.symptoms}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomsTimelineCard;
