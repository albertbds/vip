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
import { CepGeral } from './components/CepGeral';
import { SalesManagement } from './components/SalesManagement';
import { 
  Home, Building2, Search, Smartphone, HelpCircle, Tv, LogOut, MapPin, 
  ShoppingCart, Calculator, FileText, Users, Settings, Bell
} from 'lucide-react';
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
  const [notifications] = useState(3); // Simulando notificações

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
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Mostrar tela de loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl relative glow mx-auto mb-6">
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">G</span>
          </div>
          <div className="space-y-3">
            <div className="w-32 h-2 bg-white/10 rounded-full mx-auto">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-gray-400">Carregando sistema...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar tela de login se não estiver autenticado
  if (!user) {
    return <LoginScreen />;
  }

  const topCities = getTopSearchedCities();

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home, color: 'from-green-500 to-emerald-500' },
    { id: 'plans', label: 'Planos', icon: Search, color: 'from-purple-500 to-pink-500' },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart, color: 'from-orange-500 to-red-500' },
    { id: 'streaming', label: 'Apps', icon: Smartphone, color: 'from-indigo-500 to-blue-500' },
    { id: 'channels', label: 'Canais', icon: Tv, color: 'from-pink-500 to-rose-500' },
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
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Consulte a disponibilidade na cidade
              </h2>
              <p className="text-gray-300 text-lg mb-6">Digite o nome da cidade para verificar os planos disponíveis</p>
              <div className="max-w-xl mx-auto">
                <SearchBar onCitySelect={handleCitySelect} />
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {topCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-300 transition-all group border border-white/10 hover:border-blue-500/50"
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
      case 'sales':
        return <SalesManagement />;
      case 'streaming':
        return <StreamingContent />;
      case 'condominiums':
        return <Condominiums />;
      case 'channels':
        return <TvContent />;
      case 'cep-geral':
        return <CepGeral />;
      case 'faq':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10 mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Dúvidas Frequentes
              </h2>
              <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Link Dedicado e IP Fixo</h3>
                <p className="text-gray-300 mb-4">
                  Para informações sobre Link Dedicado e IP Fixo, acesse nosso portal empresarial:
                </p>
                <a 
                  href="https://beacons.ai/gigamaisempresas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
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
      {/* Modal de aviso de pagamento */}
      <PaymentWarningModal />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-72 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6 z-50 overflow-y-auto">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl relative glow">
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Giga+ Fibra</h1>
              <p className="text-sm text-gray-400">Sistema Interno</p>
            </div>
          </div>
          
          {profile && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {profile.full_name?.charAt(0) || profile.email.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {profile.full_name || profile.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      profile.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      profile.role === 'moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {profile.role}
                    </span>
                    {notifications > 0 && (
                      <div className="flex items-center gap-1">
                        <Bell size={12} className="text-blue-400" />
                        <span className="text-xs text-blue-400">{notifications}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 group ${
                currentPage === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                currentPage === item.id 
                  ? 'bg-white/20' 
                  : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <item.icon size={18} />
              </div>
              <span className="font-medium">{item.label}</span>
              {item.id === 'sales' && (
                <span className="ml-auto text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                  Novo
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-gray-300 hover:bg-white/5 hover:text-white">
            <div className="p-2 rounded-lg bg-white/5">
              <Settings size={18} />
            </div>
            <span className="font-medium">Configurações</span>
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-gray-300 hover:bg-red-500/20 hover:text-red-300"
          >
            <div className="p-2 rounded-lg bg-red-500/10">
              <LogOut size={18} />
            </div>
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-72 min-h-screen">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {menuItems.find(item => item.id === currentPage)?.label || 'Início'}
              </h1>
              <p className="text-gray-400">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {notifications > 0 && (
                <button className="relative p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <Bell size={20} className="text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                </button>
              )}
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
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