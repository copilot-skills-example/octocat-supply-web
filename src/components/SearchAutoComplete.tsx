import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { SearchMatch, SearchBoxConfig, OctoCATRecordType } from '../types/search';
import { api } from '../api/config';
import { TypingDelayManager, FocusTracker } from '../utils/searchHelpers';

// Fetch data from API
const loadSearchData = async (term: string): Promise<SearchMatch[]> => {
  const url = `${api.baseURL}/api/search/suggestions?q=${encodeURIComponent(term)}&limit=10`;
  const response = await axios.get(url);
  
  const rawItems = response.data.suggestions || response.data.results || [];
  return rawItems.map((raw: Record<string, unknown>) => ({
    recordType: raw.type || raw.category || raw.entityType || raw.kind,
    recordId: raw.id || raw.entityId || raw.recordId || raw.uid,
    mainText: raw.text || raw.primaryLabel || raw.displayName || raw.label,
    detailText: raw.subtext || raw.secondaryLabel || raw.additionalInfo || raw.sublabel,
    metaInfo: raw.metadata || raw.extraData || raw.rawData || raw.extra,
  }));
};

// Icon selector based on record type
const pickRecordIcon = (type: OctoCATRecordType): string => {
  if (type === 'product') {
    return '🏷️';
  }
  if (type === 'supplier') {
    return '🏢';
  }
  if (type === 'order') {
    return '📦';
  }
  return '📄';
};

export default function SearchAutoComplete({
  inputHint = 'Search across the supply chain...',
  matchHandler,
  containerStyle = '',
}: SearchBoxConfig) {
  const [rawInput, setRawInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  
  const textBox = useRef<HTMLInputElement>(null);
  const resultsBox = useRef<HTMLDivElement>(null);
  const delayMgr = useMemo(() => new TypingDelayManager(), []);
  const focusMgr = useMemo(() => new FocusTracker(), []);
  const router = useNavigate();
  const theme = useTheme();

  // Handle typing delay
  useEffect(() => {
    delayMgr.scheduleUpdate(() => {
      setSearchTerm(rawInput);
    }, 300);
    
    return () => delayMgr.cancelPending();
  }, [rawInput, delayMgr]);

  const meetsMinChars = searchTerm.trim().length >= 3;

  const { data: matchData, isLoading: loadingData } = useQuery(
    ['octo-search', searchTerm],
    () => loadSearchData(searchTerm),
    {
      enabled: meetsMinChars,
      staleTime: 300000,
      keepPreviousData: true,
    }
  );

  const matchList = matchData || [];
  const hasData = matchList.length > 0;

  // Close on outside click
  useEffect(() => {
    const clickChecker = (evt: MouseEvent) => {
      const target = evt.target as Node;
      const inBox = textBox.current?.contains(target);
      const inResults = resultsBox.current?.contains(target);
      
      if (!inBox && !inResults) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', clickChecker);
    return () => document.removeEventListener('mousedown', clickChecker);
  }, []);

  // Control results visibility
  useEffect(() => {
    if (meetsMinChars && (hasData || loadingData)) {
      setShowResults(true);
    } else if (!meetsMinChars) {
      setShowResults(false);
    }
  }, [meetsMinChars, hasData, loadingData]);

  // Reset selection on new results
  useEffect(() => {
    focusMgr.reset();
    setSelectedIdx(-1);
  }, [matchList.length, focusMgr]);

  const goToRecord = (match: SearchMatch) => {
    const routes: Record<OctoCATRecordType, string> = {
      product: `/products/${match.recordId}`,
      supplier: `/suppliers/${match.recordId}`,
      order: `/orders/${match.recordId}`,
    };
    router(routes[match.recordType]);
  };

  const selectMatch = (match: SearchMatch) => {
    matchHandler?.(match);
    goToRecord(match);
    setRawInput('');
    setShowResults(false);
    textBox.current?.blur();
  };

  const handleKeys = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || !hasData) {
      return;
    }

    const keyName = evt.key;

    if (keyName === 'ArrowDown') {
      evt.preventDefault();
      const nextIdx = focusMgr.moveNext(matchList.length);
      setSelectedIdx(nextIdx);
    } else if (keyName === 'ArrowUp') {
      evt.preventDefault();
      const prevIdx = focusMgr.movePrevious(matchList.length);
      setSelectedIdx(prevIdx);
    } else if (keyName === 'Enter') {
      evt.preventDefault();
      const curr = focusMgr.getCurrent();
      if (curr >= 0 && curr < matchList.length) {
        selectMatch(matchList[curr]);
      }
    } else if (keyName === 'Escape') {
      evt.preventDefault();
      setShowResults(false);
      setRawInput('');
      textBox.current?.blur();
    }
  };

  const highlightedId = selectedIdx >= 0 ? `result-item-${selectedIdx}` : undefined;

  // Styling helpers
  const boxBg = theme.darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300';
  const hintColor = theme.darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const iconColor = theme.darkMode ? 'text-gray-400' : 'text-gray-500';
  const dropdownBg = theme.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const mutedText = theme.darkMode ? 'text-gray-400' : 'text-gray-600';
  const hoverBg = theme.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const activeBg = theme.darkMode ? 'bg-gray-700' : 'bg-gray-100';
  const lineBorder = theme.darkMode ? 'border-gray-700' : 'border-gray-100';
  const badgeStyle = theme.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-200 text-gray-700';

  return (
    <div className={`relative ${containerStyle}`}>
      <div className="relative">
        <input
          ref={textBox}
          type="text"
          role="combobox"
          aria-label="Search input field"
          aria-expanded={showResults}
          aria-controls="results-dropdown"
          aria-activedescendant={highlightedId}
          aria-autocomplete="list"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          onKeyDown={handleKeys}
          placeholder={inputHint}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${boxBg} ${hintColor}`}
        />
        
        <svg
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${iconColor}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {loadingData && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div
              className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
              role="status"
              aria-label="Searching"
            />
          </div>
        )}
      </div>

      {showResults && meetsMinChars && (
        <div
          ref={resultsBox}
          id="results-dropdown"
          role="listbox"
          aria-label="Search results"
          className={`absolute z-50 w-full mt-2 rounded-lg shadow-lg overflow-hidden border ${dropdownBg}`}
          style={{ animation: 'slideFromTop 0.2s ease-out' }}
        >
          {loadingData && !hasData && (
            <div className={`px-4 py-8 text-center ${mutedText}`}>
              <div className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p>Searching...</p>
            </div>
          )}

          {!loadingData && !hasData && (
            <div className={`px-4 py-8 text-center ${mutedText}`} role="status">
              <svg
                className={`mx-auto h-12 w-12 mb-2 ${theme.darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">No matches found</p>
              <p className="text-sm mt-1">Try different keywords</p>
            </div>
          )}

          {hasData && (
            <div className="max-h-96 overflow-y-auto">
              {matchList.map((item, position) => {
                const isActive = position === selectedIdx;
                return (
                  <div
                    key={`${item.recordType}-${item.recordId}`}
                    id={`result-item-${position}`}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => selectMatch(item)}
                    onMouseEnter={() => {
                      focusMgr.reset();
                      setSelectedIdx(-1);
                    }}
                    className={`px-4 py-3 cursor-pointer transition-all duration-150 border-b last:border-b-0 ${lineBorder} ${
                      isActive ? activeBg : hoverBg
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0" aria-hidden="true">
                        {pickRecordIcon(item.recordType)}
                      </span>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className={`font-semibold truncate ${theme.darkMode ? 'text-light' : 'text-gray-900'}`}>
                          {item.mainText}
                        </p>
                        {item.detailText && (
                          <p className={`text-sm truncate mt-1 ${mutedText}`}>
                            {item.detailText}
                          </p>
                        )}
                      </div>

                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${badgeStyle}`}>
                        {item.recordType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasData && (
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {matchList.length} result{matchList.length > 1 ? 's' : ''} available
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideFromTop {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
