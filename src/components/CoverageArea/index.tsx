import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, CheckCircle, XCircle, Navigation, Loader } from 'lucide-react';
import { SearchBar } from '../SearchBar';
import { allCities } from '../../data';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export function CoverageArea() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [coverageStatus, setCoverageStatus] = useState<'covered' | 'not-covered' | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/d/u/0/embed?mid=1Olbycigvyfe3XWD4MVmXtHs8IYz1YMg&ehbc=2E312F&ll=-21.08888146629214%2C-45.56034629213484&z=14");
  const mapRef = useRef<HTMLIFrameElement>(null);

  // Geocoding function to get coordinates from address/city
  const geocodeAddress = async (address: string): Promise<LocationData | null> => {
    try {
      // Using a public geocoding service (in production, use Google Geocoding API with your key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=br`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Check coverage based on city name
  const checkCoverage = (city: string) => {
    const normalizedCity = city.toLowerCase().trim();
    const isCovered = allCities.some(c => {
      const normalizedCityFromList = c.toLowerCase().trim();
      return normalizedCityFromList.includes(normalizedCity) || 
             normalizedCity.includes(normalizedCityFromList) ||
             normalizedCity === normalizedCityFromList;
    });
    
    setCoverageStatus(isCovered ? 'covered' : 'not-covered');
    return isCovered;
  };

  // Update map with new location
  const updateMapLocation = (lat: number, lng: number, zoom: number = 14) => {
    const newMapUrl = `https://www.google.com/maps/d/u/0/embed?mid=1Olbycigvyfe3XWD4MVmXtHs8IYz1YMg&ehbc=2E312F&ll=${lat}%2C${lng}&z=${zoom}`;
    setMapUrl(newMapUrl);
  };

  const handleCitySelect = async (city: string) => {
    setSelectedCity(city);
    setIsSearching(true);
    
    try {
      // Check coverage
      const isCovered = checkCoverage(city);
      
      // Get coordinates and update map
      const locationData = await geocodeAddress(city + ', Brasil');
      if (locationData) {
        updateMapLocation(locationData.lat, locationData.lng);
      }
    } catch (error) {
      console.error('Error processing city selection:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await handleCitySelect(searchQuery.trim());
    }
  };

  const handleAddressSearch = async (address: string) => {
    setIsSearching(true);
    setSelectedCity(address);
    
    try {
      // Get coordinates for the address
      const locationData = await geocodeAddress(address);
      if (locationData) {
        updateMapLocation(locationData.lat, locationData.lng, 16);
        
        // Extract city name from address for coverage check
        const addressParts = locationData.address.split(',');
        let cityName = address;
        
        // Try to find a city name in the address parts
        for (const part of addressParts) {
          const trimmedPart = part.trim();
          if (allCities.some(c => c.toLowerCase().includes(trimmedPart.toLowerCase()))) {
            cityName = trimmedPart;
            break;
          }
        }
        
        checkCoverage(cityName);
      } else {
        setCoverageStatus('not-covered');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setCoverageStatus('not-covered');
    } finally {
      setIsSearching(false);
    }
  };

  // Predefined locations for quick access
  const quickLocations = [
    { name: 'São Paulo - SP', lat: -23.5505, lng: -46.6333 },
    { name: 'Rio de Janeiro - RJ', lat: -22.9068, lng: -43.1729 },
    { name: 'Belo Horizonte - MG', lat: -19.9167, lng: -43.9345 },
    { name: 'Fortaleza - CE', lat: -3.7319, lng: -38.5267 },
    { name: 'Brasília - DF', lat: -15.8267, lng: -47.9218 }
  ];

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
            Verifique se sua cidade está na nossa área de cobertura. Digite o CEP, nome da rua ou cidade para localizar no mapa.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <div className="max-w-2xl mx-auto">
          {/* Main Search */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite CEP, endereço ou cidade (ex: 01310-100, Av. Paulista, São Paulo)"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-all flex items-center gap-2"
            >
              {isSearching ? <Loader className="animate-spin" size={18} /> : <Navigation size={18} />}
              {isSearching ? 'Buscando...' : 'Localizar'}
            </button>
          </form>

          {/* Quick Search Buttons */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">Acesso rápido às principais cidades:</p>
            <div className="flex flex-wrap gap-2">
              {quickLocations.map((location) => (
                <button
                  key={location.name}
                  onClick={() => {
                    updateMapLocation(location.lat, location.lng);
                    handleCitySelect(location.name.split(' - ')[0]);
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-all"
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          {/* Alternative search using existing SearchBar */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400 mb-2">Ou use a busca por cidade:</p>
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
                {isSearching ? (
                  <Loader className="w-6 h-6 text-blue-400 animate-spin" />
                ) : coverageStatus === 'covered' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedCity}
                  </h3>
                  <p className={
                    isSearching ? 'text-blue-300' :
                    coverageStatus === 'covered' ? 'text-green-300' : 'text-red-300'
                  }>
                    {isSearching ? '🔍 Verificando cobertura...' :
                     coverageStatus === 'covered' 
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
          <h2 className="text-xl font-bold text-white mb-2">Mapa de Cobertura Interativo</h2>
          <p className="text-gray-300 text-sm">
            Visualize nossa área de cobertura no mapa. Use a busca acima para navegar para localizações específicas.
          </p>
        </div>

        {/* Google Maps Embed */}
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-white/10">
          <iframe
            ref={mapRef}
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Cobertura Interativo"
          />
          
          {/* Loading overlay */}
          {isSearching && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
                <Loader className="w-6 h-6 text-blue-400 animate-spin" />
                <span className="text-white">Atualizando mapa...</span>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => updateMapLocation(-21.08888146629214, -45.56034629213484, 14)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
          >
            🏠 Visão Geral
          </button>
          <button
            onClick={() => handleAddressSearch('São Paulo, SP')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
          >
            🏙️ São Paulo
          </button>
          <button
            onClick={() => handleAddressSearch('Rio de Janeiro, RJ')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
          >
            🏖️ Rio de Janeiro
          </button>
        </div>

        {/* Map Legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Search Tips */}
        <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
          <h3 className="font-semibold text-blue-400 mb-2">Dicas de Pesquisa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-1">Formatos aceitos:</h4>
              <ul className="space-y-1">
                <li>• CEP: 01310-100</li>
                <li>• Endereço: Av. Paulista, 1000</li>
                <li>• Cidade: São Paulo, SP</li>
                <li>• Bairro: Vila Madalena</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Funcionalidades:</h4>
              <ul className="space-y-1">
                <li>• Busca automática no mapa</li>
                <li>• Verificação de cobertura</li>
                <li>• Navegação interativa</li>
                <li>• Acesso rápido às principais cidades</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}