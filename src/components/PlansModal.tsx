import React, { useState } from 'react';
import Modal from 'react-modal';
import { X, Copy, Check } from 'lucide-react';
import { Territory } from '../types';
import { getCityZipCode, shouldShowFixo } from '../data';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  territory: Territory;
}

Modal.setAppElement('#root');

export function PlansModal({ isOpen, onClose, territory }: PlansModalProps) {
  const [copied, setCopied] = useState(false);
  const [showFixedPlans, setShowFixedPlans] = useState(false);
  const city = territory.cities[0];
  const zipCode = getCityZipCode(city);
  const showFixoOption = shouldShowFixo(city);

  const getPlansText = () => {
    if (showFixedPlans) {
      return `🌐 Conecte-se com mais velocidade
Temos cobertura para seu endereço ✅
Internet residencial 100% Fibra.
📝 Fidelidade de 12 meses.
⚙️ Roteador fornecido em comodato.

Melhor Oferta:
➕ 920MB + telefone FIXO por R$ 159,99/mês
Após 3 meses, valor R$ 179,99

➕ 800MB + telefone FIXO por R$ 139,99/mês
Após 3 meses, valor R$ 159,99

➕ 600MB + telefone FIXO por R$ 119,99/mês
Após 3 meses, valor R$ 139,99

➕ 400MB + telefone FIXO por R$ 99,99/mês
Após 3 meses, valor R$ 119,99

⚙️ Instalação Gratuita`;
    }

    const regularPlans = territory.plans.regular.map(plan => 
      `➕ ${plan.speed} por R$ ${plan.price}/mês${plan.description ? ` (${plan.description})` : ''}\nApós 3 meses, valor R$ ${plan.priceAfter}`
    ).join('\n\n');

    const streamingPlans = [];
    if (territory.plans.globoplay) {
      streamingPlans.push(
        `GLOBOPLAY + ${territory.plans.globoplay.speed} por R$ ${territory.plans.globoplay.price}/mês${territory.plans.globoplay.description ? ` (${territory.plans.globoplay.description})` : ''}\n` +
        `Após 3 meses, valor R$ ${territory.plans.globoplay.priceAfter}`
      );
    }
    if (territory.plans.paramount) {
      streamingPlans.push(
        `PARAMOUNT + ${territory.plans.paramount.speed} por R$ ${territory.plans.paramount.price}/mês${territory.plans.paramount.description ? ` (${territory.plans.paramount.description})` : ''}\n` +
        `Após 3 meses, valor R$ ${territory.plans.paramount.priceAfter}`
      );
    }

    return `
🌐 Conecte-se com mais velocidade
Temos cobertura para seu endereço ✅
Internet residencial 100% Fibra.
⋆ _Fidelidade de 12 meses_
⋆ _Roteador fornecido em comodato_ 
\n\nMelhor Oferta:\n${regularPlans}\n\nOFERTA ➕:\n(mais conectividade)\n\n${streamingPlans.join('\n\n')}\n\nInstalação Gratuita\ .`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPlansText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-3 w-full max-w-md"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-bold text-blue-900">Planos disponíveis</h2>
          <p className="text-sm text-gray-600">CEP: {zipCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 text-xs ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span className="font-medium">Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="font-medium">Copiar</span>
              </>
            )}
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
      </div>

      {showFixoOption && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowFixedPlans(false)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              !showFixedPlans
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Internet
          </button>
          <button
            onClick={() => setShowFixedPlans(true)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              showFixedPlans
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            FIXO
          </button>
        </div>
      )}

      <div className="space-y-2">
        {showFixedPlans ? (
          <div className="bg-gradient-to-r from-blue-900 to-black p-3 rounded-lg text-white">
            <h3 className="text-base mb-2">🌐 Internet + Telefone Fixo</h3>
            
            <div className="space-y-2">
              {[
                { speed: "920MB", price: "159,99", priceAfter: "179,99" },
                { speed: "800MB", price: "139,99", priceAfter: "159,99" },
                { speed: "600MB", price: "119,99", priceAfter: "139,99" },
                { speed: "400MB", price: "99,99", priceAfter: "119,99" }
              ].map((plan, index) => (
                <div key={index} className="border-b border-blue-700 pb-2 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">➕ {plan.speed} + FIXO</span>
                    <div className="text-right">
                      <div className="text-base font-bold">R$ {plan.price}/mês</div>
                      <div className="text-[10px] text-gray-300">
                        Após 3 meses, R$ {plan.priceAfter}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-900 to-black p-3 rounded-lg text-white">
              <h3 className="text-base mb-2">🌐 Internet 100% Fibra Óptica</h3>
              
              <div className="space-y-2">
                {territory.plans.regular.map((plan, index) => (
                  <div key={index} className="border-b border-blue-700 pb-2 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">➕ {plan.speed}</span>
                      <div className="text-right">
                        <div className="text-base font-bold">R$ {plan.price}/mês</div>
                        <div className="text-[10px] text-gray-300">
                          Após 3 meses, R$ {plan.priceAfter}
                        </div>
                        {plan.description && (
                          <div className="text-[10px] text-yellow-400">
                            {plan.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {(territory.plans.globoplay || territory.plans.paramount) && (
              <div className="space-y-2">
                {territory.plans.globoplay && (
                  <div className="bg-gradient-to-r from-red-900 to-red-700 p-3 rounded-lg text-white">
                    <h3 className="text-base mb-2">OFERTA ➕: GLOBOPLAY</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{territory.plans.globoplay.speed}</span>
                      <div className="text-right">
                        <div className="text-base font-bold">
                          R$ {territory.plans.globoplay.price}/mês
                        </div>
                        <div className="text-[10px] text-gray-300">
                          Após 3 meses, R$ {territory.plans.globoplay.priceAfter}
                        </div>
                        {territory.plans.globoplay.description && (
                          <div className="text-[10px] text-yellow-400">
                            {territory.plans.globoplay.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {territory.plans.paramount && (
                  <div className="bg-gradient-to-r from-purple-900 to-purple-700 p-3 rounded-lg text-white">
                    <h3 className="text-base mb-2">OFERTA ➕: PARAMOUNT+</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{territory.plans.paramount.speed}</span>
                      <div className="text-right">
                        <div className="text-base font-bold">
                          R$ {territory.plans.paramount.price}/mês
                        </div>
                        <div className="text-[10px] text-gray-300">
                          Após 3 meses, R$ {territory.plans.paramount.priceAfter}
                        </div>
                        {territory.plans.paramount.description && (
                          <div className="text-[10px] text-yellow-400">
                            {territory.plans.paramount.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-2 text-[10px] text-gray-600 space-y-0.5">
          <p>Instalação Gratuita</p>
          <p>📝 Fidelidade de 12 meses</p>
          <p>⚙️ Roteador fornecido em comodato</p>
        </div>
      </div>
    </Modal>
  );
}