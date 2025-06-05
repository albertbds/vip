import React, { useState, useEffect } from 'react';
import { X, Tag, Store, Play, Phone, Tv2, Copy, Check, AlertCircle, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { Territory } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { isTVAvailable, isPhoneAvailable } from '../../data/tvPlans';
import { getBrandForCity } from '../../data/cityBrands';
import { getTVPlans } from '../../data/plans';

interface PlansDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  territory: Territory;
}

type TabType = 'cpf' | 'cnpj' | 'apps' | 'tv-basic' | 'tv-family' | 'tv-cinema';

export function PlansDetailModal({ isOpen, onClose, territory }: PlansDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cpf');
  const [copied, setCopied] = useState(false);
  const [showPhoneOptions, setShowPhoneOptions] = useState(false);
  const [tabsScrollPosition, setTabsScrollPosition] = useState(0);
  const [selectedCity, setSelectedCity] = useState(territory.cities[0]);
  const cityBrand = getBrandForCity(selectedCity);
  const hasTVService = isTVAvailable(selectedCity);
  const hasPhoneService = isPhoneAvailable(selectedCity);

  const tabsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedCity(territory.cities[0]);
  }, [territory]);

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

  const getPlansText = () => {
    if (!territory?.plans?.regular) return 'Planos não disponíveis';

    if (activeTab === 'apps') {
      return `🎬 *EXPANDA SUA EXPERIÊNCIA!* 🤩
Inclua um aplicativo ao seu pacote:

*TELECINE – R$ 29,90/mês*
* O melhor catálogo de cinema ao seu alcance!

*PREMIERE – R$ 49,90/mês*
* Assista a Séries A e B, Copa do Brasil e estaduais!

*MAX – R$ 29,99/mês*
* Filmes, séries, jogos de futebol e muito mais!

*PARAMOUNT – apenas R$ 10/mês*
* Assista a jogos da Libertadores e Sul-Americana!`;
    }

    if (activeTab.startsWith('tv-')) {
      const planType = activeTab.split('-')[1];
      const tvPlans = getTVPlans();
      const tvPlan = tvPlans.find(p => p.name.toLowerCase().includes(planType));
      if (!tvPlan) return '';

      return `➕ ${tvPlan.channels}\n\n` +
             `Melhores Ofertas:\n` +
             tvPlan.plans.map(speed => 
               `➕${speed.speed} por R$ ${speed.price}/mês\n` +
               `por 3 meses, após ${speed.priceAfter}`
             ).join('\n\n') +
             `\n\n(${tvPlan.description}) 📽️\n\n` +
             `Instalação Gratuita\n` +
             `📝 Fidelidade de 12 meses\n` +
             `⚙️ Roteador fornecido em comodato`;
    }

    const prices = territory.id.startsWith('T1') || 
                  territory.id.startsWith('T2') || 
                  territory.id.startsWith('T3') || 
                  territory.id.startsWith('T4') || 
                  territory.id.startsWith('T5') || 
                  territory.id.startsWith('T6') || 
                  territory.id.startsWith('T7') || 
                  territory.id.startsWith('T8') || 
                  territory.id.startsWith('T9')
      ? {
          920: { price: '139,99', after: '159,99' },
          800: { price: '119,99', after: '139,99' },
          600: { price: '99,99', after: '119,99' },
          400: { price: '79,99', after: '99,99' }
        }
      : {
          920: { price: '139,99', after: '159,99' },
          800: { price: '109,99', after: '129,99' },
          600: { price: '89,99', after: '109,99' },
          400: { price: '69,99', after: '89,99' }
        };

    if (activeTab === 'cnpj') {
      return `Temos cobertura para seu endereço ✅
_Internet_ *100% Fibra*.
_Fidelidade de 12 meses_
_Sua instalação 100% gratuita_
_Roteador fornecido em comodato_
             CNPJ
➕ 920MB por R$ ${prices[920].price}/mês • Wi-Fi 6
Após 3 meses, R$ ${prices[920].after}

➕ 800MB por R$ ${prices[800].price}/mês • Wi-Fi 6
Após 3 meses, R$ ${prices[800].after}

➕ 600MB por R$ ${prices[600].price}/mês • Wi-Fi 6
Após 3 meses, R$ ${prices[600].after}

➕ 400MB por R$ ${prices[400].price}/mês • Wi-Fi 5
Após 3 meses, R$ ${prices[400].after}`;
    }

    const basePlans = territory.plans.regular
      .map(plan => 
        `➕ ${plan.speed} por R$ ${plan.price}/mês${plan.description ? ` • ${plan.description}` : ''}\n` +
        `Após 3 meses, R$ ${plan.priceAfter}`
      )
      .join('\n\n');

    let message = `Temos cobertura para seu endereço ✅
Internet_ *100% Fibra*.
Fidelidade de 12 meses_
Sua instalação 100% gratuita_
Roteador fornecido em comodato_

- = - = - = *✯ Internet ✯* - = - = - =

${basePlans}`;

    if (hasTVService || hasPhoneService) {
      message += '\n\n🎉 Adicione ao Plano: Consulte valores';
      if (hasTVService) message += '\n• GIGA+ TV disponível';
      if (hasPhoneService) message += '\n• Telefonia disponível';
    }

    return message;
  };

  const handleCopy = async () => {
    const text = getPlansText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-[#0F1118] rounded-xl shadow-2xl overflow-hidden border border-white/10 mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">≡</span> Detalhes dos Planos
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="relative border-b border-white/10 bg-black/20">
              <button 
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#0F1118] to-transparent px-4 h-full z-10 hover:text-white transition-colors"
              >
                <ChevronLeft className="text-gray-400" />
              </button>

              <div 
                ref={tabsRef}
                className="flex overflow-x-auto scrollbar-hide px-16 py-4 gap-2"
                style={{ scrollBehavior: 'smooth' }}
              >
                <button
                  onClick={() => setActiveTab('cpf')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'cpf'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Tag size={18} />
                  CPF
                </button>

                <button
                  onClick={() => setActiveTab('cnpj')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'cnpj'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Store size={18} />
                  CNPJ
                </button>

                <button
                  onClick={() => setActiveTab('apps')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'apps'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Play size={18} />
                  APPS
                </button>

                {hasTVService && (
                  <>
                    <button
                      onClick={() => setActiveTab('tv-basic')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                        activeTab === 'tv-basic'
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Tv2 size={18} />
                      desativado 1
                    </button>

                    <button
                      onClick={() => setActiveTab('tv-family')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                        activeTab === 'tv-family'
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Tv2 size={18} />
                      desativado 2
                    </button>

                    <button
                      onClick={() => setActiveTab('tv-cinema')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                        activeTab === 'tv-cinema'
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Film size={18} />
                      desativado 3
                    </button>
                  </>
                )}
              </div>

              <button 
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-[#0F1118] to-transparent px-4 h-full z-10 hover:text-white transition-colors"
              >
                <ChevronRight className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(90vh-180px)] overflow-y-auto">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={territory.name}
                    disabled
                    placeholder="Estado"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  />
                  <input
                    type="text"
                    value={selectedCity}
                    disabled
                    placeholder="Cidade"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={territory.id}
                    disabled
                    placeholder="Empresa"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  />
                  <input
                    type="text"
                    value={cityBrand}
                    disabled
                    placeholder="Marca"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  />
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    hasPhoneService ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
                  }`}>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={18} />
                      <span>TELEFONIA</span>
                    </div>
                    <button
                      onClick={() => setShowPhoneOptions(!showPhoneOptions)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        hasPhoneService ? 'bg-green-500' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${
                          hasPhoneService ? 'left-7' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    hasTVService ? 'bg-orange-600/20 border border-orange-500/30' : 'bg-white/5'
                  }`}>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Tv2 size={18} />
                      <span>TV </span>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${
                      hasTVService ? 'bg-orange-600' : 'bg-white/10'
                    }`}>
                      <div
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${
                          hasTVService ? 'left-7' : 'left-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[rgba(31,56,77,0.4)] to-[rgba(41,50,60,0.5)] p-4 rounded-lg">
                  <p className="text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    sem informação
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="relative">
                <textarea
                  value={getPlansText()}
                  readOnly
                  className="w-full h-[400px] bg-black/20 border border-white/10 rounded-lg p-6 text-gray-300 resize-none font-mono"
                />
                <div className="absolute top-4 right-4 bg-blue-600/20 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 border border-blue-500/30">
                  {activeTab.toUpperCase()}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute bottom-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}