import React, { useState, useRef } from 'react';
import { Search, X, AlertCircle, Copy, Check, ChevronLeft, ChevronRight, Tv2, Film, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { findTVTerritoryByCity } from '../../data/tvPlans';
import { TVTerritory } from '../../types';
import { SearchBar } from '../SearchBar';

export function TvContent() {
  const [selectedTerritory, setSelectedTerritory] = useState<TVTerritory | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsScrollPosition, setTabsScrollPosition] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'left'
        ? Math.max(0, tabsScrollPosition - scrollAmount)
        : Math.min(
            tabsRef.current.scrollWidth - tabsRef.current.clientWidth,
            tabsScrollPosition + scrollAmount
          );
      
      setTabsScrollPosition(newPosition);
      tabsRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const handleCitySelect = (city: string) => {
    const territory = findTVTerritoryByCity(city);
    if (territory) {
      setSelectedTerritory(territory);
      setShowError(false);
    } else {
      setSelectedTerritory(null);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const getPlansText = () => {
    if (!selectedTerritory) return '';
    
    const currentPlan = selectedTerritory.plans.find(p => 
      activeTab === 'basic' ? p.name === "TV Básico" :
      activeTab === 'family' ? p.name === "TV Família" :
      activeTab === 'cinema' ? p.name === "TV Cinema" :
      activeTab === 'paramount' ? p.name === "TV + Paramount" :
      p.name === "TV + Paramount + MAX"
    );

    if (!currentPlan) return '';

    return `➕ ${currentPlan.channels}\n\n` +
           `Melhores Ofertas:\n` +
           currentPlan.plans.map(speed => 
             `➕${speed.speed} por R$ ${speed.price}/mês\n` +
             `por 3 meses, após ${speed.priceAfter}`
           ).join('\n\n') +
           `\n\n(${currentPlan.description}) 📽️\n\n` +
           `Instalação Gratuita\n` +
           `📝 Fidelidade de 12 meses\n` +
           `⚙️ Roteador fornecido em comodato`;
  };

  const handleCopy = async () => {
    const text = getPlansText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Consulte a disponibilidade na sua cidade</h2>
          <p className="text-gray-300">Digite o nome da sua cidade para verificar os planos disponíveis</p>
          <div className="max-w-xl mx-auto">
            <SearchBar onCitySelect={handleCitySelect} customCities={true} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 flex items-center gap-3"
          >
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-100">Desculpe, não atendemos com TV nesta localidade.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTerritory && (
        <div className="bg-[#1D1E2C] rounded-lg w-full overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-gray-400">≡</span> Detalhes
            </h2>
            <button 
              onClick={() => setSelectedTerritory(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative border-b border-white/10">
            <button 
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#1D1E2C] to-transparent px-2 h-full z-10"
            >
              <ChevronLeft className="text-gray-400" />
            </button>

            <div 
              ref={tabsRef}
              className="flex overflow-x-auto scrollbar-hide px-12 py-2 gap-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {[
                { id: 'basic', label: 'TV Básico', icon: Tv2 },
                { id: 'family', label: 'TV Família', icon: Tv2 },
                { id: 'cinema', label: 'TV Cinema', icon: Film },
                { id: 'paramount', label: 'TV + Paramount', icon: Film },
                { id: 'max', label: 'TV + MAX + Paramount', icon: Trophy }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-[#1D1E2C] to-transparent px-2 h-full z-10"
            >
              <ChevronRight className="text-gray-400" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={selectedTerritory?.name || ''}
                  disabled
                  placeholder="Estado"
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
                />
                <input
                  type="text"
                  value={selectedTerritory?.cities[0] || ''}
                  disabled
                  placeholder="Ciss"
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={selectedTerritory?.id || ''}
                  disabled
                  placeholder="Empresa"
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
                />
                <input
                  type="text"
                  value="marca empresa"
                  disabled
                  placeholder="marca empresa"
                  className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
                />
              </div>

              <div className="bg-gradient-to-r from-[rgba(31,56,77,0.4)] to-[rgba(41,50,60,0.5)] p-4 rounded-lg">
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Não permitido uso de comprovantes terceiros
                </p>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={getPlansText()}
                readOnly
                className="w-full h-[400px] bg-white/5 border border-white/10 rounded-lg p-4 text-gray-300 resize-none font-mono"
              />
              <div className="absolute top-4 right-4 bg-white/10 px-2 py-1 rounded text-xs text-gray-400">
                {activeTab.toUpperCase()}
              </div>
              <button
                onClick={handleCopy}
                className="absolute bottom-4 right-4 p-2 rounded bg-white/10 hover:bg-white/20 transition-colors text-gray-400"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}