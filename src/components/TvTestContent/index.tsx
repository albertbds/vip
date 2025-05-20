import React, { useState } from 'react';
import { Search, X, AlertCircle, Tag, Store, Play, Phone, Headphones, Copy, Check } from 'lucide-react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export function TvTestContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('cpf');
  const [copied, setCopied] = useState(false);

  const mockCities = [
    { uf: 'CE', city: 'FORTALEZA', code: 'FOR', territory: 'TERRITÓRIO 14', views: '812' },
    { uf: 'SP', city: 'SÃO PAULO', code: 'SPOV', territory: 'TERRITÓRIO 3', views: '751' },
    { uf: 'MS', city: 'CAMPO GRANDE', code: 'CPE', territory: 'TERRITÓRIO 2', views: '217' },
    { uf: 'DF', city: 'BRASÍLIA', code: 'BSA', territory: 'TERRITÓRIO 9', views: '149' },
    { uf: 'RJ', city: 'CABO FRIO', code: 'CBF', territory: 'TERRITÓRIO 5', views: '144' },
    { uf: 'SP', city: 'CARAGUATATUBA', code: 'CGT', territory: 'TERRITÓRIO 4', views: '125' },
    { uf: 'RJ', city: 'PETRÓPOLIS', code: 'PTS', territory: 'TERRITÓRIO 6', views: '122' },
    { uf: 'RJ', city: 'RIO DAS OSTRAS', code: 'RIOS', territory: 'TERRITÓRIO 5', views: '110' }
  ];

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard w-full">
      <div className="top">
        <div className="search-box relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
            className="w-full px-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
            placeholder="Qual cidade ou endereço você está procurando?"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="dash-content mt-8">
        <div className="container">
          <h1 className="h1-title text-2xl font-bold text-white mb-4">Cidades e Regionais</h1>
          <p className="text-center text-gray-400 mb-8">
            <Search size={16} className="inline mr-2" />
            Encontre cidades, territórios, ofertas e pacotes nas regiões onde possuímos cobertura.
          </p>

          <div className="flex gap-8">
            <div className="flex-grow">
              <div className="bg-white/5 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-4 text-left w-24">Rank</th>
                      <th className="p-4 text-left w-20">UF</th>
                      <th className="p-4 text-left">Cidade</th>
                      <th className="p-4 text-left w-20">Código</th>
                      <th className="p-4 text-left">Território</th>
                      <th className="p-4 text-left w-32"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCities.map((city, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-4 text-gray-400 font-mono">
                          <span className="text-blue-400">🔥</span> {city.views}
                        </td>
                        <td className="p-4 font-semibold">{city.uf}</td>
                        <td className="p-4 text-gray-400">
                          <span className="text-blue-400">📍</span> {city.city}
                        </td>
                        <td className="p-4 font-semibold">{city.code}</td>
                        <td className="p-4 text-gray-400 italic">{city.territory}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleCitySelect(city)}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                          >
                            <span className="text-sm">Detalhes</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-1/3">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Pesquisar por condomínio.."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div className="mt-8 text-center text-gray-400">
                  <p className="font-bold mb-4">
                    <Search size={20} className="inline mr-2" />
                    Faça buscas por condomínios!
                  </p>
                  <p className="text-sm mb-2">Encontre por nome, endereço ou cep!</p>
                  <p className="text-sm">
                    <b>Exemplo</b>: <Search size={12} className="inline mx-1" /> 
                    Avenida Beira Mar, 4777
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pannel-viewinfo" style={{ display: isModalOpen ? 'flex' : 'none' }}>
        <div className="wrapper" style={{ height: '620px' }}>
          <header className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg">Detalhes</span>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </header>

          <form className="p-6">
            <div className="wrapper-st overflow-x-auto whitespace-nowrap mb-6 relative">
              <div className="icon flex"><span className="uil uil-angle-left-b"></span></div>
              
              <ul className="tabs-box flex gap-2">
                <li 
                  className={`tab flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${activeTab === 'cpf' ? 'bg-[#111] text-white' : 'bg-white/5 text-gray-400'}`}
                  onClick={() => setActiveTab('cpf')}
                >
                  <Tag size={16} />
                  CPF
                </li>
                <li 
                  className={`tab flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${activeTab === 'cnpj' ? 'bg-[#111] text-white' : 'bg-white/5 text-gray-400'}`}
                  onClick={() => setActiveTab('cnpj')}
                >
                  <Store size={16} />
                  CNPJ
                </li>
                <li 
                  className={`tab flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${activeTab === 'apps' ? 'bg-[#111] text-white' : 'bg-white/5 text-gray-400'}`}
                  onClick={() => setActiveTab('apps')}
                >
                  <Play size={16} />
                  APPS
                </li>
                <li 
                  className={`tab flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${activeTab === 'fixo' ? 'bg-[#111] text-white' : 'bg-white/5 text-gray-400'}`}
                  onClick={() => setActiveTab('fixo')}
                >
                  <Phone size={16} />
                  FIXO
                </li>
                <li 
                  className={`tab flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${activeTab === 'pre' ? 'bg-[#111] text-white' : 'bg-white/5 text-gray-400'}`}
                  onClick={() => setActiveTab('pre')}
                >
                  <Headphones size={16} />
                  PRÉ
                </li>
              </ul>

              <div className="icon flex"><span className="uil uil-angle-right-b"></span></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="dbl-field">
                  <div className="field w-full">
                    <input type="text" value={selectedCity?.uf || ''} placeholder="Estado" disabled className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                  </div>
                </div>

                <div className="dbl-field">
                  <div className="field w-full">
                    <input type="text" value={selectedCity?.city || ''} placeholder="Cidade" disabled className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                  </div>
                </div>

                <div className="dbl-field">
                  <div className="field">
                    <input type="text" value={selectedCity?.code || ''} placeholder="Empresa" disabled className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                  </div>
                  
                  <div className="field relative">
                    <div className="absolute right-2 top-2 z-10">
                      <button
                        onClick={() => handleCopy(selectedCity?.code || '')}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
                      </button>
                    </div>
                    <input type="text" value={selectedCity?.territory || ''} placeholder="CEP da Cidade" disabled className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                  </div>
                </div>

                <div className="dbl-field">
                  <div className="field">
                    <input type="text" placeholder="Atendimento" disabled className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                  </div>
                  
                  <div className="field">
                    <input type="text" placeholder="Território" disabled className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white" />
                  </div>
                </div>

                <div className="cardcomp bg-gradient-to-r from-[rgba(31,56,77,0.4)] to-[rgba(41,50,60,0.5)] p-4 rounded">
                  <div className="message-text-container">
                    <p className="message-text text-red-400 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Não permitido uso de comprovantes terceiros
                    </p>
                  </div>
                </div>

                <div className="dbl-field mt-4">
                  <div className="button-area flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-gray-400" />
                      <span className="text-gray-400 font-bold uppercase">Telefonia</span>
                    </div>
                    <div className="mode-toggle2 bg-white/10 w-10 h-5 rounded-full relative cursor-pointer">
                      <span className="switch2 absolute w-4 h-4 bg-white rounded-full top-0.5 left-0.5"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="message relative">
                <textarea 
                  placeholder="Não foi possível carregar os conteúdos"
                  className="w-full h-[422px] bg-white/5 border border-white/10 rounded p-4 text-white resize-none"
                  disabled
                />
                <div className="btn-info absolute top-4 right-4 px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                  PF
                </div>
                <button
                  onClick={() => handleCopy('')}
                  className="absolute right-4 bottom-4 p-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-gray-400" />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}