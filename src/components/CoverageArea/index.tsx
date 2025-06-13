import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, CheckCircle, XCircle, Navigation } from 'lucide-react';
import { SearchBar } from '../SearchBar';
import { allCities } from '../../data';

export function CoverageArea() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [coverageStatus, setCoverageStatus] = useState<'covered' | 'not-covered' | null>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);

  // Simulated coverage check - in a real app, this would check against actual coverage data
  const checkCoverage = (city: string) => {
    // Check if city is in our coverage list
    const isCovered = allCities.some(c => 
      c.toLowerCase().includes(city.toLowerCase()) || 
      city.toLowerCase().includes(c.toLowerCase())
    );
    
    setCoverageStatus(isCovered ? 'covered' : 'not-covered');
    return isCovered;
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const isCovered = checkCoverage(city);
    
    // Update the map to show the selected city
    if (mapRef.current) {
      // In a real implementation, you would update the map center based on city coordinates
      console.log(`Showing coverage for ${city}: ${isCovered ? 'Covered' : 'Not covered'}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleCitySelect(searchQuery.trim());
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto text-white">
      {/* Header Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold gradient-text">Área de Cobertura</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Verifique se sua cidade está na nossa área de cobertura. Digite o nome da cidade ou navegue pelo mapa interativo.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite o nome da cidade..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all flex items-center gap-2"
            >
              <Navigation size={18} />
              Verificar
            </button>
          </form>

          {/* Alternative search using existing SearchBar */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400 mb-2">Ou use a busca inteligente:</p>
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
        </div>

        {/* Coverage Status */}
        {selectedCity && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className={`p-4 rounded-lg border ${
              coverageStatus === 'covered' 
                ? 'bg-green-500/20 border-green-500/50' 
                : 'bg-red-500/20 border-red-500/50'
            }`}>
              <div className="flex items-center gap-3">
                {coverageStatus === 'covered' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedCity}
                  </h3>
                  <p className={coverageStatus === 'covered' ? 'text-green-300' : 'text-red-300'}>
                    {coverageStatus === 'covered' 
                      ? '✅ Área com cobertura disponível!' 
                      : '❌ Área sem cobertura no momento'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-2">Mapa de Cobertura</h2>
          <p className="text-gray-300 text-sm">
            Visualize nossa área de cobertura no mapa interativo. As áreas em destaque mostram onde nossos serviços estão disponíveis.
          </p>
        </div>

        {/* Google Maps Embed */}
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-white/10">
          <iframe
            ref={mapRef}
            src="https://www.google.com/maps/d/u/0/embed?mid=1Olbycigvyfe3XWD4MVmXtHs8IYz1YMg&ehbc=2E312F&ll=-21.08888146629214%2C-45.56034629213484&z=14"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Cobertura"
          />
        </div>

        {/* Map Legend */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="font-semibold">Área Coberta</span>
            </div>
            <p className="text-sm text-gray-400">
              Regiões onde nossos serviços estão disponíveis
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="font-semibold">Em Expansão</span>
            </div>
            <p className="text-sm text-gray-400">
              Áreas com previsão de cobertura em breve
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="font-semibold">Pontos de Interesse</span>
            </div>
            <p className="text-sm text-gray-400">
              Locais importantes e referências
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
          <h3 className="font-semibold text-blue-400 mb-2">Informações Importantes</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• O mapa é atualizado regularmente com novas áreas de cobertura</li>
            <li>• Para verificar disponibilidade específica, entre em contato conosco</li>
            <li>• Áreas em expansão podem ter disponibilidade limitada</li>
            <li>• Clique no mapa para mais detalhes sobre cada região</li>
          </ul>
        </div>
      </div>
    </div>
  );
}