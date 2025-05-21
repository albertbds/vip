import React, { useState } from 'react';
import { X, Tag, Store, Play, Phone, Headphones, Copy, Check, AlertCircle, ChevronLeft, ChevronRight, Film, Trophy } from 'lucide-react';
import { Territory } from '../../types';
import { getCityZipCode, shouldShowFixo } from '../../data';

interface PlanosTVEModalProps {
  isOpen: boolean;
  onClose: () => void;
  territory: Territory;
}

export function PlanosTVEModal({ isOpen, onClose, territory }: PlanosTVEModalProps) {
  const [copied, setCopied] = useState(false);
  const [showFixedPlans, setShowFixedPlans] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('cpf');
  const city = territory.cities[0];
  const zipCode = getCityZipCode(city);
  const showFixoOption = shouldShowFixo(city);
  const [tabsScrollPosition, setTabsScrollPosition] = useState(0);

  const tabsRef = React.useRef<HTMLDivElement>(null);

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
_Internet empresarial_ *100% Fibra*.
⋆ _Fidelidade de 12 meses_
⋆ _Sua instalação 100% gratuita_
⋆ _Roteador fornecido em comodato_
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

    const getStreamingPrices = (basePrices: typeof territory.plans.regular, additionalPrice: number) => {
      return basePrices.map(plan => {
        const basePrice = parseFloat(plan.price.replace(',', '.'));
        const basePriceAfter = parseFloat(plan.priceAfter.replace(',', '.'));
        
        const newPrice = (basePrice + additionalPrice).toFixed(2).replace('.', ',');
        const newPriceAfter = (basePriceAfter + additionalPrice).toFixed(2).replace('.', ',');
        
        return `➕ ${plan.speed} por R$ ${newPrice}/mês${plan.description ? ` • ${plan.description}` : ''}
Após 3 meses, R$ ${newPriceAfter}`;
      }).join('\n\n');
    };

    if (activeTab === 'globoplay') {
      return `Temos cobertura para seu endereço ✅
_Internet empresarial_ *100% Fibra*.
⋆ _Fidelidade de 12 meses_
⋆ _Sua instalação 100% gratuita_
⋆ _Roteador fornecido em comodato_

- = - = - = *✯ Internet + Streamings ✯* - = - = - =

${getStreamingPrices(territory.plans.regular, 22.90)}`;
    }

    if (activeTab === 'telecine') {
      return `Temos cobertura para seu endereço ✅
_Internet empresarial_ *100% Fibra*.
⋆ _Fidelidade de 12 meses_
⋆ _Sua instalação 100% gratuita_
⋆ _Roteador fornecido em comodato_

- = - = - = *✯ Internet + Streamings ✯* - = - = - =

${getStreamingPrices(territory.plans.regular, 29.90)}`;
    }

    if (activeTab === 'max') {
      return `Temos cobertura para seu endereço ✅
_Internet empresarial_ *100% Fibra*.
⋆ _Fidelidade de 12 meses_
⋆ _Sua instalação 100% gratuita_
⋆ _Roteador fornecido em comodato_

- = - = - = *✯ Internet + Streamings ✯* - = - = - =

${getStreamingPrices(territory.plans.regular, 30.00)}`;
    }

    if (activeTab === 'paramount') {
      return `Temos cobertura para seu endereço ✅
_Internet empresarial_ *100% Fibra*.
⋆ _Fidelidade de 12 meses_
⋆ _Sua instalação 100% gratuita_
⋆ _Roteador fornecido em comodato_

- = - = - = *✯ Internet + Streamings ✯* - = - = - =

${getStreamingPrices(territory.plans.regular, 10.00)}`;
    }

    const plans = territory.plans.regular.map(plan => 
      `➕ ${plan.speed} por R$ ${plan.price}/mês${plan.description ? ` • ${plan.description}` : ''}\nApós 3 meses, R$ ${plan.priceAfter}`
    ).join('\n\n');

    return `Temos cobertura para seu endereço ✅
_Internet empresarial_ *100% Fibra*.
⋆ _Fidelidade de 12 meses_
⋆ _Sua instalação 100% gratuita_
⋆ _Roteador fornecido em comodato_

- = - = - = *✯ Internet + Streamings ✯* - = - = - =

${plans}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPlansText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1D1E2C] rounded-lg w-full max-w-6xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white text-lg font-medium flex items-center gap-2">
            <span className="text-gray-400">≡</span> Planos TVE
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="relative border-b border-white/10">
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#1D1E2C] to-transparent px-2 h-full z-10"
          >
            <ChevronLeft className="text-gray-400" />
          </button>

          <div 
            ref={tabsRef}
            className="flex overflow-x-auto scrollbar-hide px-12 py-2 gap-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {[
              { id: 'cpf', label: 'CPF', icon: Tag },
              { id: 'cnpj', label: 'CNPJ', icon: Store },
              { id: 'apps', label: 'APPS', icon: Play },
              { id: 'globoplay', label: 'Globoplay', icon: Film },
              { id: 'telecine', label: 'Telecine', icon: Film },
              { id: 'max', label: 'MAX', icon: Play },
              { id: 'paramount', label: 'Paramount+', icon: Trophy },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-[#1D1E2C] to-transparent px-2 h-full z-10"
          >
            <ChevronRight className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={territory.name}
                disabled
                placeholder="Estado"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
              />
              <input
                type="text"
                value={territory.cities[0]}
                disabled
                placeholder="Cidade"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={territory.id}
                disabled
                placeholder="Empresa"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
              />
              <input
                type="text"
                value="marca empresa"
                disabled
                placeholder="marca empresa"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300"
              />
            </div>

            <div className="space-y-3">
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                showFixoOption ? 'bg-green-500/20' : 'bg-white/5'
              }`}>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone size={18} />
                  <span>TELEFONIA</span>
                </div>
                <button
                  onClick={() => setShowFixedPlans(!showFixedPlans)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    showFixoOption ? 'bg-green-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${
                      showFixoOption ? 'left-7' : 'left-0.5'
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
              className="w-full h-[400px] bg-white/5 border border-white/10 rounded-lg p-4 text-gray-300 resize-none"
            />
            <div className="absolute top-4 right-4 bg-white/10 px-2 py-1 rounded text-xs text-gray-400">
              {activeTab.toUpperCase()}
            </div>
            <button
              onClick={handleCopy}
              className="absolute bottom-4 right-4 p-2 rounded bg-white/10 hover:bg-white/20 transition-colors text-gray-400"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}