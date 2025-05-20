import React, { createContext, useContext, useState, useEffect } from 'react';

interface SearchContextType {
  searchCounts: { [key: string]: number };
  incrementSearchCount: (city: string) => void;
  getTopSearchedCities: (limit?: number) => Array<{ name: string; count: number }>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchCounts, setSearchCounts] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('citySearchCounts');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('citySearchCounts', JSON.stringify(searchCounts));
  }, [searchCounts]);

  const incrementSearchCount = (city: string) => {
    setSearchCounts(prev => ({
      ...prev,
      [city]: (prev[city] || 0) + 1
    }));
  };

  const getTopSearchedCities = (limit = 7) => {
    return Object.entries(searchCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  return (
    <SearchContext.Provider value={{ searchCounts, incrementSearchCount, getTopSearchedCities }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}