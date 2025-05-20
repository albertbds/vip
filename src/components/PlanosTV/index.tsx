import React, { useState } from 'react';
import { SearchBar } from '../SearchBar';
import { findTVTerritoryByCity } from '../../data/tvPlans';
import { TVTerritory } from '../../types';
import { Copy, Check, Play, Film, Trophy, Tv, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PlanosTV() {
  const [selectedTerritory, setSelectedTerritory] = useState<TVTerritory | null>(null);
  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleCitySelect = (city: string) => {
    const territory = findTVTerritoryByCity(city);
    if (territory) {
      setSelectedTerritory(territory);
      setShowError(false);
    } else {
      setSelectedTerritory(null);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const getPlansText = () => {
    if (!selectedTerritory) return '';

    return selectedTerritory.plans.map(plan => `
${plan.name}
➕ ${plan.channels} Canais ao vivo${plan.name.includes('Paramount') ? ' + ' + plan.name.split('+ ')[1] : ''}

Melhores Ofertas:
${plan.plans.map(p => `➕${p.speed} por R$ ${p.price}/mês
por 3 meses, após ${p.priceAfter}`).join('\n\n')}

(${plan.description}) 📽️

Instalação Gratuita
📝 Fidelidade de 12 meses
⚙️ Roteador fornecido em comodato

---------------------------------------------
`).join('\n');
  };

  const handleCopy = async () => {
    if (selectedTerritory) {
      await navigator.clipboard.writeText(getPlansText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Consulte a disponibilidade na sua cidade</h2>
          <p className="text-gray-300">Digite o nome da sua cidade para verificar os planos disponíveis</p>
          <div className="max-w-xl mx-auto">
            <SearchBar onCitySelect={handleCitySelect} customCities={true} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 flex items-center gap-3"
          >
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-100">Desculpe, não atendemos com TV nesta localidade.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTerritory && (
        <div className="mt-8 space-y-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Planos Disponíveis</h2>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check size={18} />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span>Copiar Planos</span>
                </>
              )}
            </button>
          </div>

          {selectedTerritory.plans.map((plan, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-400">➕ {plan.channels} Canais ao vivo</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{plan.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plan.plans.map((p, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-white mb-2">{p.speed}</h4>
                    <div className="text-2xl font-bold text-blue-400">
                      R$ {p.price}
                      <span className="text-sm text-gray-400 ml-1">/mês</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Por 3 meses, após R$ {p.priceAfter}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">📝</span>
                    Fidelidade de 12 meses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">⚙️</span>
                    Roteador fornecido em comodato
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">✨</span>
                    Instalação Gratuita
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}