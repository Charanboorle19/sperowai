import React from 'react';
import AIbutton from './AIbutton';


const TabletAiButton = ({ onClick }) => {
  return (
    <div className="h-auto md:h-60 rounded-2xl shadow-lg p-2">
      <div className="bg-[#4475F2] w-full h-full rounded-xl p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#3461E6] transition-colors">
        <div className="text-center">
          <h2 className="text-base md:text-lg lg:text-xl font-medium text-white mb-4 md:mb-6">
            Click to Process and Analyze the Patient's Medical Report Instantly
          </h2>
          
          <div className="w-2/4 mx-auto [&>button]:w-full [&>button]:bg-white [&>button]:border-none [&>button:hover]:bg-gray-50 [&>button_*]:text-[#4475F2] [&>button_span]:!text-[#4475F2] [&>button_svg]:!text-[#4475F2] [&>button_span]:!font-raleway [&>button_span]:!font-semibold [&>button_span]:!text-xs md:[&>button_span]:!text-base [&>button]:!gap-1 md:[&>button]:!gap-2 [&>button]:after:content-['→'] [&>button]:after:ml-1 [&>button]:after:text-[#4475F2] [&>button]:after:text-base md:[&>button]:after:text-lg [&>button]:after:font-bold">
            <AIbutton onClick={onClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletAiButton; 