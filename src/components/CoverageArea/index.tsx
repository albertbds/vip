import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, CheckCircle, XCircle, Navigation, Loader, Target, Home } from 'lucide-react';
import { SearchBar } from '../SearchBar';
import { allCities, findTerritoryByCity } from '../../data';
import { PlansDetailModal } from '../PlansDetailModal';
import { Territory } from '../../types';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  cep: string;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export function CoverageArea() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [coverageStatus, setCoverageStatus] = useState<'covered' | 'not-covered' | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/d/u/0/embed?mid=1Olbycigvyfe3XWD4MVmXtHs8IYz1YMg&ehbc=2E312F&ll=-21.08888146629214%2C-45.56034629213484&z=14");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);

  // Função para buscar CEP via ViaCEP
  const searchCEP = async (cep: string): Promise<ViaCEPResponse | null> => {
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      if (cleanCEP.length !== 8) return null;

      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) return null;
      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  };

  // Função para geocodificar endereço
  const geocodeAddress = async (address: string): Promise<LocationData | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=br&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name,
          city: result.address?.city || result.address?.town || result.address?.municipality || '',
          state: result.address?.state || '',
          cep: ''
        };
      }
      return null;
    } catch (error) {
      console.error('Erro no geocoding:', error);
      return null;
    }
  };

  // Função para verificar cobertura
  const checkCoverage = (city: string) => {
    const normalizedCity = city.toLowerCase().trim();
    const isCovered = allCities.some(c => {
      const normalizedCityFromList = c.toLowerCase().trim();
      return normalizedCityFromList.includes(normalizedCity) || 
             normalizedCity.includes(normalizedCityFromList) ||
             normalizedCity === normalizedCityFromList;
    });
    
    setCoverageStatus(isCovered ? 'covered' : 'not-covered');
    
    if (isCovered) {
      const territory = findTerritoryByCity(city);
      if (territory) {
        setSelectedTerritory(territory);
      }
    }
    
    return isCovered;
  };

  // Função para atualizar o mapa
  const updateMapLocation = (lat: number, lng: number, zoom: number = 16) => {
    const newMapUrl = `https://www.google.com/maps/d/u/0/embed?mid=1Olbycigvyfe3XWD4MVmXtHs8IYz1YMg&ehbc=2E312F&ll=${lat}%2C${lng}&z=${zoom}`;
    setMapUrl(newMapUrl);
  };

  // Função principal de busca
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setLocationData(null);
    setCoverageStatus(null);
    setSelectedTerritory(null);

    try {
      // Verificar se é CEP
      const cepPattern = /^\d{5}-?\d{3}$/;
      if (cepPattern.test(query.replace(/\s/g, ''))) {
        const cepData = await searchCEP(query);
        if (cepData) {
          const fullAddress = `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade}, ${cepData.uf}, Brasil`;
          const geoData = await geocodeAddress(fullAddress);
          
          if (geoData) {
            const locationInfo: LocationData = {
              ...geoData,
              city: cepData.localidade,
              state: cepData.uf,
              cep: cepData.cep,
              address: `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}`
            };
            
            setLocationData(locationInfo);
            setSelectedCity(cepData.localidade);
            updateMapLocation(geoData.lat, geoData.lng, 18);
            checkCoverage(cepData.localidade);
          }
        } else {
          throw new Error('CEP não encontrado');
        }
      } else {
        // Buscar por endereço ou cidade
        const geoData = await geocodeAddress(query + ', Brasil');
        if (geoData) {
          setLocationData(geoData);
          setSelectedCity(geoData.city);
          updateMapLocation(geoData.lat, geoData.lng, 16);
          checkCoverage(geoData.city);
        } else {
          throw new Error('Endereço não encontrado');
        }
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setCoverageStatus('not-covered');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCitySelect = async (city: string) => {
    setSelectedCity(city);
    setIsSearching(true);
    
    try {
      const isCovered = checkCoverage(city);
      const geoData = await geocodeAddress(city + ', Brasil');
      if (geoData) {
        setLocationData(geoData);
        updateMapLocation(geoData.lat, geoData.lng, 12);
      }
    } catch (error) {
      console.error('Erro ao processar cidade:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Se parecer com CEP, formatar automaticamente
    if (/^\d{5,8}$/.test(value.replace(/\D/g, ''))) {
      setSearchQuery(formatCEP(value));
    } else {
      setSearchQuery(value);
    }
  };

  // Localizações rápidas para demonstração
  const quickLocations = [
    { name: 'São Paulo - SP', lat: -23.5505, lng: -46.6333, cep: '01310-100' },
    { name: 'Rio de Janeiro - RJ', lat: -22.9068, lng: -43.1729, cep: '20040-020' },
    { name: 'Belo Horizonte - MG', lat: -19.9167, lng: -43.9345, cep: '30112-000' },
    { name: 'Fortaleza - CE', lat: -3.7319, lng: -38.5267, cep: '60160-230' },
    { name: 'Brasília - DF', lat: -15.8267, lng: -47.9218, cep: '70040-010' }
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
            Verifique se sua região está na nossa área de cobertura. Digite o CEP, endereço completo ou nome da cidade.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <div className="max-w-2xl mx-auto">
          {/* Main Search */}
          <form onSubmit={handleFormSubmit} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Digite CEP (01310-100), endereço ou cidade"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-all flex items-center gap-2"
            >
              {isSearching ? <Loader className="animate-spin" size={18} /> : <Target size={18} />}
              {isSearching ? 'Buscando...' : 'Localizar'}
            </button>
          </form>

          {/* Quick Search Examples */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">Exemplos de busca:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300">01310-100</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300">Av. Paulista, São Paulo</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300">Copacabana, Rio de Janeiro</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300">Fortaleza, CE</span>
            </div>
          </div>

          {/* Quick Access Buttons */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">Acesso rápido às principais cidades:</p>
            <div className="flex flex-wrap gap-2">
              {quickLocations.map((location) => (
                <button
                  key={location.name}
                  onClick={() => {
                    setSearchQuery(location.name);
                    handleSearch(location.name);
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-all flex items-center gap-1"
                >
                  <Home size={12} />
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          {/* Alternative search using existing SearchBar */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400 mb-2">Ou busque diretamente por cidade:</p>
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
        </div>

        {/* Location Results */}
        {locationData && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <MapPin size={18} className="text-blue-400" />
                Localização Encontrada
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Endereço:</span> {locationData.address}</p>
                <p><span className="text-gray-400">Cidade:</span> {locationData.city}</p>
                <p><span className="text-gray-400">Estado:</span> {locationData.state}</p>
                {locationData.cep && (
                  <p><span className="text-gray-400">CEP:</span> {locationData.cep}</p>
                )}
                <p><span className="text-gray-400">Coordenadas:</span> {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)}</p>
              </div>
            </div>
          </div>
        )}

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
                <div className="flex-1">
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
                {coverageStatus === 'covered' && selectedTerritory && (
                  <button
                    onClick={() => setShowPlansModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-all"
                  >
                    Ver Planos
                  </button>
                )}
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
                <span className="text-white">Localizando no mapa...</span>
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
          {quickLocations.map((location) => (
            <button
              key={location.name}
              onClick={() => {
                updateMapLocation(location.lat, location.lng, 12);
                handleSearch(location.name);
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
            >
              📍 {location.name.split(' - ')[0]}
            </button>
          ))}
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
                <li>• CEP: 01310-100 ou 01310100</li>
                <li>• Endereço: Av. Paulista, 1000, São Paulo</li>
                <li>• Cidade: São Paulo, SP</li>
                <li>• Bairro: Vila Madalena, São Paulo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Funcionalidades:</h4>
              <ul className="space-y-1">
                <li>• Busca automática no mapa</li>
                <li>• Verificação de cobertura em tempo real</li>
                <li>• Navegação interativa com zoom</li>
                <li>• Exibição de planos disponíveis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Modal */}
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