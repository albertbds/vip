import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { allCities } from '../data';
import { allTVCities } from '../data/tvPlans';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onCitySelect: (city: string) => void;
  customCities?: boolean;
}

export function SearchBar({ onCitySelect, customCities = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 1) {
      const cities = customCities ? allTVCities : allCities;
      const normalizedQuery = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtered = cities.filter(city => 
        city.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(normalizedQuery)
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (city: string) => {
    setQuery(city);
    setIsOpen(false);
    onCitySelect(city);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Digite o nome da cidade..."
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500 pl-12 text-violet-100 placeholder-violet-300"
        />
        <Search className="absolute left-4 top-3.5 text-violet-400" size={20} />
      </div>
      
      <AnimatePresence mode="wait">
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-1 bg-indigo-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-violet-500/20 max-h-60 overflow-y-auto z-50"
          >
            {suggestions.map((city, index) => (
              <motion.button
                key={city}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-2 hover:bg-violet-500/20 focus:outline-none focus:bg-violet-500/20 text-violet-100"
              >
                {city}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}