import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

  const fullText = "Search medical topics, reports, articles and more";
  const typingSpeed = 100;

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
    return () => clearTimeout(timeoutId);
  }, [inputValue, fullText]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (showResult) setShowResult(false);
  };

  const handleSearch = async () => {
    if (inputValue.trim()) {
      setIsLoading(true);
      setShowResult(true);
      
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('https://sperowai.onrender.com/gemini/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ query: inputValue.trim() })
        });

        const data = await response.json();
        if (data.success) {
          setSearchResults(data.results);
          if (!recentSearches.includes(inputValue.trim())) {
            setRecentSearches(prev => [inputValue.trim(), ...prev]);
          }
        } else {
          console.error('Search failed:', data.error);
        }
      } catch (error) {
        console.error('Error performing search:', error);
      } finally {
        setIsLoading(false);
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
      setSearchResults(null);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-[#d6d9fdb4] rounded-[15px] p-4 md:p-5 mt-4 mb-4">
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
          className="w-full h-[40px] md:h-[50px] pl-10 md:pl-12 pr-12 rounded-[20px] md:rounded-[25px] bg-white/80 text-sm md:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
        <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <FaSearch className="text-base md:text-lg" />
        </div>

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

      {/* Results Block */}
      {showResult && (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden">
          {/* Header */}
          <div className="h-16 border-b flex items-center px-6 justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FaSearch className="text-purple-500 text-base" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{searchResults?.query || 'Search Results'}</h2>
            </div>
            <button 
              onClick={() => {
                setShowResult(false);
                setSearchResults(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="h-[calc(100vh-4rem)] flex">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : searchResults ? (
              <>
                {/* Left Side - AI Response */}
                <div className="w-1/2 h-full border-r overflow-y-auto">
                  <div className="p-6">
                    <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3">AI Response</div>
                    <div className="bg-gray-50 rounded-lg p-6 text-gray-700 whitespace-pre-wrap font-medium leading-relaxed">
                      {searchResults.ai_response.split('\n').map((paragraph, index) => {
                        // Function to process bold text between stars
                        const processBoldText = (text) => {
                          const parts = text.split(/(\*\*.*?\*\*)/g);
                          return parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <span key={i} className="font-bold text-gray-900">
                                  {part}
                                </span>
                              );
                            }
                            return part;
                          });
                        };

                        if (paragraph.match(/^\d+\./)) {
                          return (
                            <div key={index} className="mb-3">
                              {processBoldText(paragraph)}
                            </div>
                          );
                        } else if (paragraph.match(/^\s*\*/)) {
                          return (
                            <div key={index} className="ml-4 mb-2">
                              {processBoldText(paragraph)}
                            </div>
                          );
                        }
                        return (
                          <p key={index} className="mb-3">
                            {processBoldText(paragraph)}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side - Search Results */}
                <div className="w-1/2 h-full overflow-y-auto">
                  <div className="p-6">
                    <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3">Web Results</div>
                    <div className="space-y-4">
                      {searchResults.search_results.map((result, index) => (
                        <div key={index} className="group">
                          <a 
                            href={result.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-4 rounded-lg hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100"
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="text-blue-600 font-semibold text-base group-hover:underline line-clamp-1">
                                {result.title}
                              </h4>
                              <FaExternalLinkAlt className="text-gray-400 text-xs flex-shrink-0 mt-1 ml-2 group-hover:text-blue-500" />
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                              {result.snippet}
                            </p>
                            <div className="text-xs text-gray-400 mt-2 font-medium">
                              {result.link}
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                No results to display
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search; 