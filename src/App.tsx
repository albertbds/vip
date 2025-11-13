import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { Territory } from './types';
import { findTerritoryByCity } from './data';
import { SplineSceneBasic } from './components/SplineSceneBasic';
import { AppList } from './components/AppList';
import { StreamingContent } from './components/StreamingContent';
import { Condominiums } from './components/Condominiums';
import { PlansDetailModal } from './components/PlansDetailModal';
import { FAQ } from './components/FAQ';
import { TvContent } from './components/TvContent';
import { CepGeral } from './components/CepGeral';
import {
  Home, Building2, Search, Smartphone, HelpCircle, MapPin
} from 'lucide-react';
import { useSearch } from './contexts/SearchContext';

function App() {
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showPlansModal, setShowPlansModal] = useState(false);
  const { getTopSearchedCities, incrementSearchCount } = useSearch();
  const [selectedCity, setSelectedCity] = useState<string>('');

  const handleCitySelect = (city: string) => {
    incrementSearchCount(city);
    setSelectedCity(city);
    const territory = findTerritoryByCity(city);
    if (territory) {
      setSelectedTerritory(territory);
      setShowPlansModal(true);
    }
  };

  const topCities = getTopSearchedCities();

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home, color: 'from-green-500 to-emerald-500' },
    { id: 'plans', label: 'Planos', icon: Search, color: 'from-purple-500 to-pink-500' },
    { id: 'streaming', label: 'Apps', icon: Smartphone, color: 'from-indigo-500 to-blue-500' },
    { id: 'condominiums', label: 'Condomínios', icon: Building2, color: 'from-teal-500 to-green-500' },
    { id: 'cep-geral', label: 'CEP Geral', icon: MapPin, color: 'from-yellow-500 to-orange-500' },
    { id: 'faq', label: 'Dúvidas', icon: HelpCircle, color: 'from-gray-500 to-slate-500' }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-6">
            <SplineSceneBasic />
          </div>
        );
      case 'plans':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Consulte a disponibilidade na cidade
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-6">Digite o nome da cidade para verificar os planos disponíveis</p>
              <div className="max-w-xl mx-auto">
                <SearchBar onCitySelect={handleCitySelect} />
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {topCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-300 transition-all group border border-white/10 hover:border-blue-500/50"
                    >
                      <span>{city.name}</span>
                      <span className="text-xs text-blue-400 group-hover:text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                        {city.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'streaming':
        return <StreamingContent />;
      case 'condominiums':
        return <Condominiums />;
      case 'cep-geral':
        return <CepGeral />;
      case 'faq':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Dúvidas Frequentes
              </h2>
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 mb-6 border border-white/10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Link Dedicado e IP Fixo</h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Para informações sobre Link Dedicado e IP Fixo, acesse nosso portal empresarial:
                </p>
                <a 
                  href="https://beacons.ai/gigamaisempresas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  Portal Empresarial
                </a>
              </div>
            </div>
            <FAQ />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Simple Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl relative glow">
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Giga+ Fibra</h1>
                <p className="text-sm text-gray-400">Sistema de Consultas</p>
              </div>
            </div>
            
            {/* Simple Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    currentPage === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              >
                {menuItems.map(item => (
                  <option key={item.id} value={item.id} className="bg-slate-800">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* System Shutdown Message */}
      <div className="bg-amber-950/50 border-b border-amber-700/50 px-4 sm:px-6 py-3 text-center">
        <p className="text-amber-200 text-sm sm:text-base font-medium">
          Aviso: Sistema será encerrado em breve. Salve suas informações.
        </p>
      </div>

      {/* Page Content */}
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {selectedTerritory && showPlansModal && (
        <PlansDetailModal
          isOpen={showPlansModal}
          onClose={() => setShowPlansModal(false)}
          territory={selectedTerritory}
        />
      )}
    </div>
  );
}

export default App;