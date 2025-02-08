import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

  const fullText = "Search medical topics, reports, articles and more";
  const typingSpeed = 100; // Slower, more stable speed

  useEffect(() => {
    if (inputValue) {
      setPlaceholder('');
      return;
    }

    let timeoutId;
    let currentIndex = 0;

    const typeLetter = () => {
      if (currentIndex <= fullText.length) {
        setPlaceholder(fullText.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeLetter, typingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          currentIndex = 0;
          setPlaceholder('');
          timeoutId = setTimeout(typeLetter, typingSpeed);
        }, 2000);
      }
    };

    timeoutId = setTimeout(typeLetter, typingSpeed);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, fullText]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (showResult) setShowResult(false);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      setShowResult(true);
      // Add to recent searches if not already present
      if (!recentSearches.includes(inputValue.trim())) {
        setRecentSearches(prev => [inputValue.trim(), ...prev]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const removeSearch = (searchToRemove) => {
    setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
    if (recentSearches.length <= 1) {
      setShowResult(false);
    }
  };

  return (
    <div className={`
      bg-[#d6d9fdb4] rounded-[15px] p-4 md:p-5 mt-4 mb-4 
    `}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <FaSearch className="text-purple-500 text-base md:text-lg" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Quick Search</h2>
          <p className="text-xs md:text-sm text-gray-500">Find what you need</p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="
            w-full h-[40px] md:h-[50px] 
            pl-10 md:pl-12 pr-12 
            rounded-[20px] md:rounded-[25px] 
            bg-white/80 
            text-sm md:text-base text-gray-800 
            placeholder-gray-400 
            focus:outline-none focus:ring-2 
            focus:ring-purple-500/20 
            transition-all
          "
        />
        <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <FaSearch className="text-base md:text-lg" />
        </div>

        {/* Send Arrow - Appears when typing */}
        {inputValue && (
          <button 
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
          >
            <FaArrowRight className="text-purple-500 text-sm" />
          </button>
        )}

        {!inputValue && !placeholder && (
          <div className="absolute left-10 md:left-12 top-1/2 -translate-y-1/2">
            <span className="inline-block w-0.5 h-5 bg-gray-400 animate-blink"></span>
          </div>
        )}
      </div>

      {/* Result Block */}
      {showResult && (
        <div className="mt-4 bg-white rounded-xl p-4 animate-fadeScale max-h-[200px] overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-800">Recent Search</h3>
            <button 
              onClick={() => setShowResult(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <FaTimes className="text-gray-500 text-sm" />
            </button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <div key={index} className="flex items-center justify-between group">
                <p className="text-sm text-gray-600 break-words">"{search}"</p>
                <button 
                  onClick={() => removeSearch(search)}
                  className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes className="text-gray-400 text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search; 