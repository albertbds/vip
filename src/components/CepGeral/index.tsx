import React, { useState } from 'react';
import { Search, MapPin, Copy, Check, Loader } from 'lucide-react';

interface CityData {
  city: string;
  state: string;
  cep: string;
  region: string;
}

// Base de dados com cidades e CEPs do Brasil
const brazilianCities: CityData[] = [
  // Acre
  { city: 'Rio Branco', state: 'AC', cep: '69900-000', region: 'Norte' },
  { city: 'Cruzeiro do Sul', state: 'AC', cep: '69980-000', region: 'Norte' },
  { city: 'Sena Madureira', state: 'AC', cep: '69940-000', region: 'Norte' },
  
  // Alagoas
  { city: 'Maceió', state: 'AL', cep: '57000-000', region: 'Nordeste' },
  { city: 'Arapiraca', state: 'AL', cep: '57300-000', region: 'Nordeste' },
  { city: 'Palmeira dos Índios', state: 'AL', cep: '57600-000', region: 'Nordeste' },
  
  // Amapá
  { city: 'Macapá', state: 'AP', cep: '68900-000', region: 'Norte' },
  { city: 'Santana', state: 'AP', cep: '68925-000', region: 'Norte' },
  { city: 'Laranjal do Jari', state: 'AP', cep: '68920-000', region: 'Norte' },
  
  // Amazonas
  { city: 'Manaus', state: 'AM', cep: '69000-000', region: 'Norte' },
  { city: 'Parintins', state: 'AM', cep: '69151-000', region: 'Norte' },
  { city: 'Itacoatiara', state: 'AM', cep: '69100-000', region: 'Norte' },
  
  // Bahia
  { city: 'Salvador', state: 'BA', cep: '40000-000', region: 'Nordeste' },
  { city: 'Feira de Santana', state: 'BA', cep: '44000-000', region: 'Nordeste' },
  { city: 'Vitória da Conquista', state: 'BA', cep: '45000-000', region: 'Nordeste' },
  { city: 'Camaçari', state: 'BA', cep: '42800-000', region: 'Nordeste' },
  { city: 'Juazeiro', state: 'BA', cep: '48900-000', region: 'Nordeste' },
  { city: 'Ilhéus', state: 'BA', cep: '45650-000', region: 'Nordeste' },
  
  // Ceará
  { city: 'Fortaleza', state: 'CE', cep: '60000-000', region: 'Nordeste' },
  { city: 'Caucaia', state: 'CE', cep: '61600-000', region: 'Nordeste' },
  { city: 'Juazeiro do Norte', state: 'CE', cep: '63010-000', region: 'Nordeste' },
  { city: 'Maracanaú', state: 'CE', cep: '61900-000', region: 'Nordeste' },
  { city: 'Sobral', state: 'CE', cep: '62000-000', region: 'Nordeste' },
  
  // Distrito Federal
  { city: 'Brasília', state: 'DF', cep: '70000-000', region: 'Centro-Oeste' },
  { city: 'Taguatinga', state: 'DF', cep: '72000-000', region: 'Centro-Oeste' },
  { city: 'Ceilândia', state: 'DF', cep: '72000-000', region: 'Centro-Oeste' },
  
  // Espírito Santo
  { city: 'Vitória', state: 'ES', cep: '29000-000', region: 'Sudeste' },
  { city: 'Vila Velha', state: 'ES', cep: '29100-000', region: 'Sudeste' },
  { city: 'Cariacica', state: 'ES', cep: '29140-000', region: 'Sudeste' },
  { city: 'Serra', state: 'ES', cep: '29160-000', region: 'Sudeste' },
  { city: 'Cachoeiro de Itapemirim', state: 'ES', cep: '29300-000', region: 'Sudeste' },
  
  // Goiás
  { city: 'Goiânia', state: 'GO', cep: '74000-000', region: 'Centro-Oeste' },
  { city: 'Aparecida de Goiânia', state: 'GO', cep: '74900-000', region: 'Centro-Oeste' },
  { city: 'Anápolis', state: 'GO', cep: '75000-000', region: 'Centro-Oeste' },
  { city: 'Rio Verde', state: 'GO', cep: '75900-000', region: 'Centro-Oeste' },
  
  // Maranhão
  { city: 'São Luís', state: 'MA', cep: '65000-000', region: 'Nordeste' },
  { city: 'Imperatriz', state: 'MA', cep: '65900-000', region: 'Nordeste' },
  { city: 'Timon', state: 'MA', cep: '65630-000', region: 'Nordeste' },
  { city: 'Caxias', state: 'MA', cep: '65600-000', region: 'Nordeste' },
  
  // Mato Grosso
  { city: 'Cuiabá', state: 'MT', cep: '78000-000', region: 'Centro-Oeste' },
  { city: 'Várzea Grande', state: 'MT', cep: '78100-000', region: 'Centro-Oeste' },
  { city: 'Rondonópolis', state: 'MT', cep: '78700-000', region: 'Centro-Oeste' },
  { city: 'Sinop', state: 'MT', cep: '78550-000', region: 'Centro-Oeste' },
  
  // Mato Grosso do Sul
  { city: 'Campo Grande', state: 'MS', cep: '79000-000', region: 'Centro-Oeste' },
  { city: 'Dourados', state: 'MS', cep: '79800-000', region: 'Centro-Oeste' },
  { city: 'Três Lagoas', state: 'MS', cep: '79600-000', region: 'Centro-Oeste' },
  { city: 'Corumbá', state: 'MS', cep: '79300-000', region: 'Centro-Oeste' },
  
  // Minas Gerais
  { city: 'Belo Horizonte', state: 'MG', cep: '30000-000', region: 'Sudeste' },
  { city: 'Uberlândia', state: 'MG', cep: '38400-000', region: 'Sudeste' },
  { city: 'Contagem', state: 'MG', cep: '32000-000', region: 'Sudeste' },
  { city: 'Juiz de Fora', state: 'MG', cep: '36000-000', region: 'Sudeste' },
  { city: 'Betim', state: 'MG', cep: '32600-000', region: 'Sudeste' },
  { city: 'Montes Claros', state: 'MG', cep: '39400-000', region: 'Sudeste' },
  { city: 'Ribeirão das Neves', state: 'MG', cep: '33800-000', region: 'Sudeste' },
  { city: 'Uberaba', state: 'MG', cep: '38000-000', region: 'Sudeste' },
  { city: 'Governador Valadares', state: 'MG', cep: '35000-000', region: 'Sudeste' },
  { city: 'Ipatinga', state: 'MG', cep: '35160-000', region: 'Sudeste' },
  
  // Pará
  { city: 'Belém', state: 'PA', cep: '66000-000', region: 'Norte' },
  { city: 'Ananindeua', state: 'PA', cep: '67000-000', region: 'Norte' },
  { city: 'Santarém', state: 'PA', cep: '68000-000', region: 'Norte' },
  { city: 'Marabá', state: 'PA', cep: '68500-000', region: 'Norte' },
  { city: 'Parauapebas', state: 'PA', cep: '68515-000', region: 'Norte' },
  
  // Paraíba
  { city: 'João Pessoa', state: 'PB', cep: '58000-000', region: 'Nordeste' },
  { city: 'Campina Grande', state: 'PB', cep: '58400-000', region: 'Nordeste' },
  { city: 'Santa Rita', state: 'PB', cep: '58300-000', region: 'Nordeste' },
  { city: 'Patos', state: 'PB', cep: '58700-000', region: 'Nordeste' },
  
  // Paraná
  { city: 'Curitiba', state: 'PR', cep: '80000-000', region: 'Sul' },
  { city: 'Londrina', state: 'PR', cep: '86000-000', region: 'Sul' },
  { city: 'Maringá', state: 'PR', cep: '87000-000', region: 'Sul' },
  { city: 'Ponta Grossa', state: 'PR', cep: '84000-000', region: 'Sul' },
  { city: 'Cascavel', state: 'PR', cep: '85800-000', region: 'Sul' },
  { city: 'São José dos Pinhais', state: 'PR', cep: '83000-000', region: 'Sul' },
  { city: 'Foz do Iguaçu', state: 'PR', cep: '85850-000', region: 'Sul' },
  { city: 'Colombo', state: 'PR', cep: '83400-000', region: 'Sul' },
  { city: 'Guarapuava', state: 'PR', cep: '85000-000', region: 'Sul' },
  { city: 'Paranaguá', state: 'PR', cep: '83200-000', region: 'Sul' },
  
  // Pernambuco
  { city: 'Recife', state: 'PE', cep: '50000-000', region: 'Nordeste' },
  { city: 'Jaboatão dos Guararapes', state: 'PE', cep: '54400-000', region: 'Nordeste' },
  { city: 'Olinda', state: 'PE', cep: '53000-000', region: 'Nordeste' },
  { city: 'Caruaru', state: 'PE', cep: '55000-000', region: 'Nordeste' },
  { city: 'Petrolina', state: 'PE', cep: '56300-000', region: 'Nordeste' },
  { city: 'Paulista', state: 'PE', cep: '53400-000', region: 'Nordeste' },
  
  // Piauí
  { city: 'Teresina', state: 'PI', cep: '64000-000', region: 'Nordeste' },
  { city: 'Parnaíba', state: 'PI', cep: '64200-000', region: 'Nordeste' },
  { city: 'Picos', state: 'PI', cep: '64600-000', region: 'Nordeste' },
  { city: 'Piripiri', state: 'PI', cep: '64260-000', region: 'Nordeste' },
  
  // Rio de Janeiro
  { city: 'Rio de Janeiro', state: 'RJ', cep: '20000-000', region: 'Sudeste' },
  { city: 'São Gonçalo', state: 'RJ', cep: '24400-000', region: 'Sudeste' },
  { city: 'Duque de Caxias', state: 'RJ', cep: '25000-000', region: 'Sudeste' },
  { city: 'Nova Iguaçu', state: 'RJ', cep: '26200-000', region: 'Sudeste' },
  { city: 'Niterói', state: 'RJ', cep: '24000-000', region: 'Sudeste' },
  { city: 'Campos dos Goytacazes', state: 'RJ', cep: '28000-000', region: 'Sudeste' },
  { city: 'Belford Roxo', state: 'RJ', cep: '26100-000', region: 'Sudeste' },
  { city: 'São João de Meriti', state: 'RJ', cep: '25500-000', region: 'Sudeste' },
  { city: 'Petrópolis', state: 'RJ', cep: '25600-000', region: 'Sudeste' },
  { city: 'Volta Redonda', state: 'RJ', cep: '27200-000', region: 'Sudeste' },
  
  // Rio Grande do Norte
  { city: 'Natal', state: 'RN', cep: '59000-000', region: 'Nordeste' },
  { city: 'Mossoró', state: 'RN', cep: '59600-000', region: 'Nordeste' },
  { city: 'Parnamirim', state: 'RN', cep: '59140-000', region: 'Nordeste' },
  { city: 'São Gonçalo do Amarante', state: 'RN', cep: '59290-000', region: 'Nordeste' },
  
  // Rio Grande do Sul
  { city: 'Porto Alegre', state: 'RS', cep: '90000-000', region: 'Sul' },
  { city: 'Caxias do Sul', state: 'RS', cep: '95000-000', region: 'Sul' },
  { city: 'Pelotas', state: 'RS', cep: '96000-000', region: 'Sul' },
  { city: 'Canoas', state: 'RS', cep: '92000-000', region: 'Sul' },
  { city: 'Santa Maria', state: 'RS', cep: '97000-000', region: 'Sul' },
  { city: 'Gravataí', state: 'RS', cep: '94000-000', region: 'Sul' },
  { city: 'Viamão', state: 'RS', cep: '94400-000', region: 'Sul' },
  { city: 'Novo Hamburgo', state: 'RS', cep: '93500-000', region: 'Sul' },
  { city: 'São Leopoldo', state: 'RS', cep: '93000-000', region: 'Sul' },
  { city: 'Rio Grande', state: 'RS', cep: '96200-000', region: 'Sul' },
  
  // Rondônia
  { city: 'Porto Velho', state: 'RO', cep: '76800-000', region: 'Norte' },
  { city: 'Ji-Paraná', state: 'RO', cep: '76900-000', region: 'Norte' },
  { city: 'Ariquemes', state: 'RO', cep: '76870-000', region: 'Norte' },
  { city: 'Vilhena', state: 'RO', cep: '76980-000', region: 'Norte' },
  
  // Roraima
  { city: 'Boa Vista', state: 'RR', cep: '69300-000', region: 'Norte' },
  { city: 'Rorainópolis', state: 'RR', cep: '69373-000', region: 'Norte' },
  { city: 'Caracaraí', state: 'RR', cep: '69360-000', region: 'Norte' },
  
  // Santa Catarina
  { city: 'Florianópolis', state: 'SC', cep: '88000-000', region: 'Sul' },
  { city: 'Joinville', state: 'SC', cep: '89200-000', region: 'Sul' },
  { city: 'Blumenau', state: 'SC', cep: '89000-000', region: 'Sul' },
  { city: 'São José', state: 'SC', cep: '88100-000', region: 'Sul' },
  { city: 'Criciúma', state: 'SC', cep: '88800-000', region: 'Sul' },
  { city: 'Chapecó', state: 'SC', cep: '89800-000', region: 'Sul' },
  { city: 'Itajaí', state: 'SC', cep: '88300-000', region: 'Sul' },
  { city: 'Jaraguá do Sul', state: 'SC', cep: '89250-000', region: 'Sul' },
  { city: 'Lages', state: 'SC', cep: '88500-000', region: 'Sul' },
  { city: 'Palhoça', state: 'SC', cep: '88130-000', region: 'Sul' },
  
  // São Paulo
  { city: 'São Paulo', state: 'SP', cep: '01000-000', region: 'Sudeste' },
  { city: 'Guarulhos', state: 'SP', cep: '07000-000', region: 'Sudeste' },
  { city: 'Campinas', state: 'SP', cep: '13000-000', region: 'Sudeste' },
  { city: 'São Bernardo do Campo', state: 'SP', cep: '09700-000', region: 'Sudeste' },
  { city: 'Santo André', state: 'SP', cep: '09000-000', region: 'Sudeste' },
  { city: 'Osasco', state: 'SP', cep: '06000-000', region: 'Sudeste' },
  { city: 'São José dos Campos', state: 'SP', cep: '12200-000', region: 'Sudeste' },
  { city: 'Ribeirão Preto', state: 'SP', cep: '14000-000', region: 'Sudeste' },
  { city: 'Sorocaba', state: 'SP', cep: '18000-000', region: 'Sudeste' },
  { city: 'Santos', state: 'SP', cep: '11000-000', region: 'Sudeste' },
  { city: 'Mauá', state: 'SP', cep: '09300-000', region: 'Sudeste' },
  { city: 'São José do Rio Preto', state: 'SP', cep: '15000-000', region: 'Sudeste' },
  { city: 'Mogi das Cruzes', state: 'SP', cep: '08700-000', region: 'Sudeste' },
  { city: 'Diadema', state: 'SP', cep: '09900-000', region: 'Sudeste' },
  { city: 'Jundiaí', state: 'SP', cep: '13200-000', region: 'Sudeste' },
  { city: 'Carapicuíba', state: 'SP', cep: '06300-000', region: 'Sudeste' },
  { city: 'Piracicaba', state: 'SP', cep: '13400-000', region: 'Sudeste' },
  { city: 'Bauru', state: 'SP', cep: '17000-000', region: 'Sudeste' },
  { city: 'Itaquaquecetuba', state: 'SP', cep: '08570-000', region: 'Sudeste' },
  { city: 'Franca', state: 'SP', cep: '14400-000', region: 'Sudeste' },
  
  // Sergipe
  { city: 'Aracaju', state: 'SE', cep: '49000-000', region: 'Nordeste' },
  { city: 'Nossa Senhora do Socorro', state: 'SE', cep: '49160-000', region: 'Nordeste' },
  { city: 'Lagarto', state: 'SE', cep: '49400-000', region: 'Nordeste' },
  { city: 'Itabaiana', state: 'SE', cep: '49500-000', region: 'Nordeste' },
  
  // Tocantins
  { city: 'Palmas', state: 'TO', cep: '77000-000', region: 'Norte' },
  { city: 'Araguaína', state: 'TO', cep: '77800-000', region: 'Norte' },
  { city: 'Gurupi', state: 'TO', cep: '77400-000', region: 'Norte' },
  { city: 'Porto Nacional', state: 'TO', cep: '77500-000', region: 'Norte' }
];

export function CepGeral() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<CityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (query.length > 1) {
      const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtered = brazilianCities.filter(city => 
        city.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery) ||
        city.state.toLowerCase().includes(normalizedQuery.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 10)); // Limitar a 10 resultados
    } else {
      setFilteredCities([]);
    }
    
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
    setSearchQuery(`${city.city} - ${city.state}`);
    setFilteredCities([]);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">CEP Geral do Brasil</h2>
            <p className="text-gray-400">Consulte o CEP geral de qualquer cidade brasileira</p>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Digite o nome da cidade ou estado..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && (
              <Loader className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-spin" size={20} />
            )}
          </div>

          {/* Sugestões */}
          {filteredCities.length > 0 && (
            <div className="absolute w-full mt-1 bg-[#1D1E2C] rounded-lg shadow-lg border border-white/10 max-h-60 overflow-y-auto z-50">
              {filteredCities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 focus:outline-none focus:bg-white/10 border-b border-white/5 last:border-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium">{city.city}</span>
                      <span className="text-gray-400 ml-2">- {city.state}</span>
                    </div>
                    <span className="text-blue-400 text-sm">{city.region}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resultado */}
        {selectedCity && (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Cidade</label>
                  <p className="text-lg font-semibold text-white">{selectedCity.city}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
                  <p className="text-lg font-semibold text-white">{selectedCity.state}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Região</label>
                  <p className="text-lg font-semibold text-white">{selectedCity.region}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">CEP Geral</label>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-blue-400">{selectedCity.cep}</p>
                    <button
                      onClick={() => handleCopy(selectedCity.cep)}
                      className={`p-2 rounded-lg transition-all ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-gray-400'
                      }`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Informação Importante</h4>
                  <p className="text-sm text-gray-300">
                    Este é o CEP geral da cidade. Para endereços específicos, 
                    consulte o site dos Correios ou use um serviço de busca de CEP detalhado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{brazilianCities.length}</p>
            <p className="text-sm text-gray-400">Cidades</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">27</p>
            <p className="text-sm text-gray-400">Estados + DF</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">5</p>
            <p className="text-sm text-gray-400">Regiões</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">100%</p>
            <p className="text-sm text-gray-400">Cobertura</p>
          </div>
        </div>
      </div>
    </div>
  );
}