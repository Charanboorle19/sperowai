import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import MobileHeader from './Header';
import TabletHeader from './Tablet-header';
import Performance from './Performance';
import Search from './Search';
import AiButton from './AIbutton';


const HomePage = () => {
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-[#F7F8F9]">
      {/* Headers */}
      {isTabletOrDesktop ? (
        <TabletHeader />
      ) : (
        <div className="w-full min-w-[320px] max-w-[500px] mx-auto">
          <MobileHeader />
        </div>
      )}
      
      {/* Homepage specific content */}
      <div className={`${isTabletOrDesktop ? 'ml-[80px]' : ''}`}>
        <div className="w-full min-w-[320px] max-w-[500px] mx-auto pb-24">
          <div className="w-full mt-4 px-4">
            <Search />
          </div>
          <div className="w-full mb-4">
            <Performance />
          </div>
        </div>
      </div>

      {/* AI Button */}
      {!isTabletOrDesktop && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[130px] z-[9999]" onClick={() => navigate('/ai')}>
          <AiButton />
        </div>
      )}
    </div>
  );
};

export default HomePage;