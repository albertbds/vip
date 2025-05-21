import React, { useState, useEffect } from 'react';
import { X, Tag, Store, Play, Phone, Tv2, Copy, Check, AlertCircle, ChevronLeft, ChevronRight, Film, Trophy } from 'lucide-react';
import { Territory } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PlansDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  territory: Territory;
}

type TabType = 'cpf' | 'cnpj' | 'apps' | 'globoplay' | 'telecine' | 'max' | 'paramount';

const citiesWithTVEnabled = new Set([
  'Acaraú', 'Aquiraz', 'Beberibe', 'Camocim', 'Cascavel', 'Caucaia', 'Cruz', 'Eusébio',
  'Fortaleza', 'Fortim', 'Frecheirinha', 'Graça', 'Granja', 'Ibiapina', 'Itaitinga',
  'Itapipoca', 'Itarema', 'Jijoca De Jericoacoara', 'Limoeiro Do Norte', 'Maracanaú',
  'Maranguape', 'Morada Nova', 'Mucambo', 'Pacajus', 'Pacatuba', 'Pacujá', 'Paracuru',
  'Paraipaba', 'Pentecoste', 'Pindoretama', 'Quixadá', 'Russas', 'São Benedito',
  'São Gonçalo Do Amarante', 'São Luís Do Curu', 'Sobral', 'Tabuleiro Do Norte',
  'Trairi', 'Ubajara'
]);

export function PlansDetailModal({ isOpen, onClose, territory }: PlansDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cpf');
  const [copied, setCopied] = useState(false);
  const [showPhoneOptions, setShowPhoneOptions] = useState(false);
  const [showTVOptions, setShowTVOptions] = useState(false);
  const [tabsScrollPosition, setTabsScrollPosition] = useState(0);

  const tabsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shouldEnableTV = territory.cities.some(city => citiesWithTVEnabled.has(city));
    setShowTVOptions(shouldEnableTV);

    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [territory, isOpen]);

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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  if (!isOpen) return null;

  const getStreamingPrices = (basePrices: typeof territory.plans.regular, additionalPrice: number) => {
    if (!basePrices || !Array.isArray(basePrices)) return '';
    
    return basePrices
      .filter(plan => plan && typeof plan === 'object' && 'price' in plan && 'priceAfter' in plan)
      .map(plan => {
        const basePrice = parseFloat((plan.price || '0').replace(',', '.'));
        const basePriceAfter = parseFloat((plan.priceAfter || '0').replace(',', '.'));
        
        const newPrice = (basePrice + additionalPrice).toFixed(2).replace('.', ',');
        const newPriceAfter = (basePriceAfter + additionalPrice).toFixed(2).replace('.', ',');
        
        return `➕ ${plan.speed || ''} por R$ ${newPrice}/mês${plan.description ? ` • ${plan.description}` : ''}\nApós 3 meses, R$ ${newPriceAfter}`;
      })
      .join('\n\n');
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

    if (activeTab === 'cnpj') {
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

    const streamingPlans = getStreamingPrices(territory.plans.regular, activeTab === 'globoplay' ? 22.90 :
      activeTab === 'telecine' ? 29.90 :
      activeTab === 'max' ? 30.00 :
      activeTab === 'paramount' ? 10.00 : 0);

    const basePlans = territory.plans.regular
      .filter(plan => plan && typeof plan === 'object' && 'price' in plan && 'priceAfter' in plan)
      .map(plan => 
        `➕ ${plan.speed || ''} por R$ ${plan.price || '0'}/mês${plan.description ? ` • ${plan.description}` : ''}\nApós 3 meses, R$ ${plan.priceAfter || '0'}`
      )
      .join('\n\n');

    let message = `Temos cobertura para seu endereço ✅
Internet_ *100% Fibra*.
Fidelidade de 12 meses_
Sua instalação 100% gratuita_
Roteador fornecido em comodato_
- = - = - = *✯ Internet ✯* - = - = - =

${streamingPlans || basePlans}`;

    // Add TV offer text only for cities with TV service
    if (territory.cities.some(city => citiesWithTVEnabled.has(city))) {
      message += `\n\n🎉 Oferta especial GIGA+FIBRA para você! Adquira Internet 100% fibra óptica e aproveite a TV ao vivo e streaming. Além de uma conexão ultra-rápida, você terá acesso à Giga+TV, com milhares de filmes, séries e canais ao vivo. E o melhor: tudo isso com um preço exclusivo! Gostaria de saber mais detalhes? Confira se temos cobertura na sua cidade`;
    }

    return message;
  };

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
                {[
                  { id: 'cpf', label: 'CPF', icon: Tag },
                  { id: 'cnpj', label: 'CNPJ', icon: Store },
                  { id: 'apps', label: 'APPS', icon: Play },
                  { id: 'globoplay', label: 'Globoplay', icon: Tv2 },
                  { id: 'telecine', label: 'Telecine', icon: Film },
                  { id: 'max', label: 'MAX', icon: Play },
                  { id: 'paramount', label: 'Paramount+', icon: Trophy },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
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
                    value={territory.cities[0]}
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
                    value="Comprovante"
                    disabled
                    placeholder="Comprovante"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  />
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    showPhoneOptions ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
                  }`}>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={18} />
                      <span>TELEFONIA</span>
                    </div>
                    <button
                      onClick={() => setShowPhoneOptions(!showPhoneOptions)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        showPhoneOptions ? 'bg-green-500' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${
                          showPhoneOptions ? 'left-7' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    showTVOptions ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-white/5'
                  }`}>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Tv2 size={18} />
                      <span>GIGA+ TV</span>
                    </div>
                    <button
                      onClick={() => setShowTVOptions(!showTVOptions)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        showTVOptions ? 'bg-blue-600' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${
                          showTVOptions ? 'left-7' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
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
                  onClick={() => handleCopy(getPlansText())}
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