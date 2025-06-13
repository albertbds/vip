import React, { useState, useRef } from 'react';
import { Search, X, AlertCircle, Copy, Check, ChevronLeft, ChevronRight, Tv2, Film, Trophy, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { findTVTerritoryByCity } from '../../data/tvPlans';
import { TVTerritory } from '../../types';
import { SearchBar } from '../SearchBar';
import { ChannelList } from './ChannelList';

export function TvContent() {
  const [selectedTerritory, setSelectedTerritory] = useState<TVTerritory | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showChannels, setShowChannels] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'family' | 'cinema' | null>(null);
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

  const handleShowChannels = (packageType: 'basic' | 'family' | 'cinema') => {
    setSelectedPackage(packageType);
    setShowChannels(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Consulte a disponibilidade na cidade</h2>
          <p className="text-gray-300">Digite o nome da cidade para verificar os planos disponíveis</p>
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

      {/* Modal sobreposto */}
      <AnimatePresence>
        {selectedTerritory && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1D1E2C] rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/10"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <span className="text-gray-400">≡</span> Detalhes dos Planos TV
                </h2>
                <button 
                  onClick={() => setSelectedTerritory(null)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
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
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === 'basic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Tv2 size={16} />
                    TV Básico
                  </button>

                  <button
                    onClick={() => setActiveTab('family')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === 'family'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Tv2 size={16} />
                    TV Família
                  </button>

                  <button
                    onClick={() => setActiveTab('cinema')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === 'cinema'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Film size={16} />
                    TV Cinema
                  </button>
                </div>

                <button 
                  onClick={() => handleScroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-[#1D1E2C] to-transparent px-2 h-full z-10"
                >
                  <ChevronRight className="text-gray-400" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(90vh-180px)] overflow-y-auto">
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
                      placeholder="Cidade"
                      className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleShowChannels('basic')}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-between"
                    >
                      <span>Pacote Básico</span>
                      <List size={16} />
                    </button>

                    <button
                      onClick={() => handleShowChannels('family')}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-between"
                    >
                      <span>Pacote Família</span>
                      <List size={16} />
                    </button>

                    <button
                      onClick={() => handleShowChannels('cinema')}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-between"
                    >
                      <span>Pacote Cinema</span>
                      <List size={16} />
                    </button>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChannelList
        isOpen={showChannels}
        onClose={() => setShowChannels(false)}
        packageType={selectedPackage}
      />
    </div>
  );
}