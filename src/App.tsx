import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { Territory } from './types';
import { findTerritoryByCity } from './data';
import { SplineSceneBasic } from './components/SplineSceneBasic';
import { AppList } from './components/AppList';
import { StreamingContent } from './components/StreamingContent';
import { Condominiums } from './components/Condominiums';
import { PlansDetailModal } from './components/PlansDetailModal';
import { CpfConsult } from './components/CpfConsult';
import { FAQ } from './components/FAQ';
import { TvContent } from './components/TvContent';
import { PaymentWarningModal } from './components/PaymentWarningModal';
import { Home, Building2, Search, Smartphone, HelpCircle, Mail, Lock, UserPlus, Tv, LogOut, User } from 'lucide-react';
import { useSearch } from './contexts/SearchContext';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showPlansModal, setShowPlansModal] = useState(false);
  const { getTopSearchedCities, incrementSearchCount } = useSearch();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const { user, profile, signOut, loading } = useAuth();

  const handleCitySelect = (city: string) => {
    incrementSearchCount(city);
    setSelectedCity(city);
    const territory = findTerritoryByCity(city);
    if (territory) {
      setSelectedTerritory(territory);
      setShowPlansModal(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Mostrar tela de loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-dark via-background to-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl relative glow mx-auto mb-4 animate-pulse">
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold gradient-text">G</span>
          </div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Mostrar tela de login se não estiver autenticado
  if (!user) {
    return <LoginScreen />;
  }

  const topCities = getTopSearchedCities();

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
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold gradient-text">Consulte a disponibilidade na cidade</h2>
            <p className="text-primary-light text-lg">Digite o nome da cidade para verificar os planos disponíveis</p>
            <div className="max-w-xl mx-auto">
              <SearchBar onCitySelect={handleCitySelect} />
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {topCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-300 transition-all group"
                  >
                    <span>{city.name}</span>
                    <span className="text-xs text-blue-400 group-hover:text-blue-300">({city.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'streaming':
        return <StreamingContent />;
      case 'condominiums':
        return <Condominiums />;
      case 'channels':
        return <TvContent />;
      case 'faq':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold gradient-text mb-6">Dúvidas Frequentes</h2>
            <div className="glass-card p-6 mb-6 hover-card">
              <h3 className="text-xl font-bold text-white mb-4">Link Dedicado e IP Fixo</h3>
              <p className="text-gray-300">
                Para informações sobre Link Dedicado e IP Fixo, acesse nosso portal empresarial:
              </p>
              <a 
                href="https://beacons.ai/gigamaisempresas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary inline-block mt-4"
              >
                Portal Empresarial
              </a>
            </div>
            <FAQ />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark via-background to-background-dark relative">
      {/* Modal de aviso de pagamento */}
      <PaymentWarningModal />

      {/* Background Art */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-[20%] opacity-20 floating-element">
            <div className="w-64 h-64 border-4 border-primary/20 rounded-full transform rotate-45"></div>
            <div className="absolute inset-0 w-64 h-64 border-4 border-secondary/10 rounded-full transform -rotate-45"></div>
          </div>

          <div className="absolute bottom-40 left-[15%] opacity-15 floating-element" style={{ animationDelay: '-2s' }}>
            <div className="w-80 h-80 border-4 border-primary/20 transform rotate-12">
              <div className="absolute inset-0 border-4 border-secondary/10 transform -rotate-6"></div>
            </div>
          </div>

          <div className="absolute top-1/3 left-[75%] opacity-10 floating-element" style={{ animationDelay: '-4s' }}>
            <div className="w-48 h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-dark to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background-dark to-transparent"></div>
      </div>

      <nav className="fixed left-0 top-0 h-full w-48 glass-effect border-r border-primary/10 p-4 z-50">
        <div className="logo-name mb-8">
          <div className="logo-image flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl relative glow">
            <span className="text-2xl font-bold gradient-text">G</span>
          </div>
          <span className="text-sm text-primary-light mt-2 block">Giga+ Fibra</span>
          {profile && (
            <div className="mt-2">
              <p className="text-xs text-gray-400">Olá, {profile.full_name || profile.email}</p>
              <span className="text-xs text-green-400 capitalize">{profile.role}</span>
            </div>
          )}
        </div>

        <div className="menu-items flex-1">
          <ul className="nav-links space-y-2">
            {[
              { id: 'home', label: 'Início', icon: Home },
              { id: 'plans', label: 'Planos', icon: Search },
              { id: 'streaming', label: 'Apps', icon: Smartphone },
              { id: 'channels', label: 'Canais', icon: Tv },
              { id: 'condominiums', label: 'Condomínios', icon: Building2 },
              { id: 'faq', label: 'Dúvidas', icon: HelpCircle }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* User menu at bottom */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-gray-300 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      <main className="ml-48 p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

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