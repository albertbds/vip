import React from 'react';
import { ExternalLink, Wifi } from 'lucide-react';

export function EbookContent() {
  return (
    <div className="w-full max-w-4xl mx-auto text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">eBook de Ofertas • B2C</h1>
          <p className="text-gray-300">Vigência • 01/03 até 31/03 • Março • 2025</p>
        </div>

        <div className="space-y-8">
          {/* What's New Section */}
          <div className="bg-blue-900/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">O que há de novo</h2>
            <div className="space-y-4">
              <div>
                <p className="text-lg mb-2">Adquira um plano com Globoplay e assista ao reality show</p>
                <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                  Saiba mais sobre nossas ofertas com Globoplay
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Extended Offers */}
          <div className="bg-green-900/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Ofertas estendidas</h2>
            <p className="text-lg mb-2">Validade das ofertas estendida até 31/03</p>
            <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
              Saiba mais
              <ExternalLink size={16} />
            </button>
          </div>

          {/* WiFi 6 Section */}
          <div className="bg-purple-900/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              <div className="flex items-center gap-2">
                <Wifi size={24} />
                Wi-Fi 6 é na Giga+ Fibra
              </div>
            </h2>
            <p className="text-lg mb-4">
              O Wi-Fi 6 oferece muito mais desempenho para uma conexão GIGA Rápida na casa toda
            </p>
            <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
              Saiba mais sobre a tecnologia Wi-Fi 6
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Plans Sections */}
      <div className="space-y-8">
        {/* T1 to T9 Plans */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Banda Larga • T1 a T9</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                speed: "400 Mega",
                upload: "200 Mega de upload",
                price: "79,99",
                priceAfter: "99,99",
                wifi: "Wi-Fi 5"
              },
              {
                speed: "600 Mega",
                upload: "300 Mega de upload",
                price: "99,99",
                priceAfter: "119,99",
                wifi: "Wi-Fi 6",
                highlight: true
              },
              {
                speed: "800 Mega",
                upload: "400 Mega de upload",
                price: "119,99",
                priceAfter: "139,99",
                wifi: "Wi-Fi 6"
              },
              {
                speed: "GIGA 920 Mega",
                upload: "460 Mega de upload",
                price: "139,99",
                priceAfter: "159,99",
                wifi: "Wi-Fi 6"
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`${
                  plan.highlight
                    ? 'bg-blue-600/30 border-blue-500'
                    : 'bg-white/5 border-white/10'
                } border rounded-lg p-6`}
              >
                {plan.highlight && (
                  <div className="text-blue-400 font-semibold mb-2">Melhor oferta!</div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.speed}</h3>
                <p className="text-gray-300 mb-4">{plan.upload}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">Adicionais inclusos</p>
                  <ul className="text-gray-300 text-sm">
                    <li>• {plan.wifi}</li>
                    <li>• 100% Fibra Óptica</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">R${plan.price}/mês</div>
                  <div className="text-sm text-gray-300">
                    Por 3 meses, após R$ {plan.priceAfter}/mês
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar sections for T10-T14 and T5-T7 */}
        {/* Add more plan sections as needed */}
      </div>

      {/* Why Choose Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">Por que escolher a Giga+ Fibra?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Empresa consolidada",
              description: "É a 4ª maior empresa de banda larga fibra do Brasil"
            },
            {
              title: "Internet premiada",
              description: "Campeã em diversas regiões em 2025"
            },
            {
              title: "100% Fibra Óptica",
              description: "Tecnologia até dentro de casa permitindo alta taxa de upload"
            },
            {
              title: "Qualidade de atendimento",
              description: "Atendimento humanizado e manutenção disponível 24x7"
            },
            {
              title: "Melhor custo-benefício",
              description: "Velocidades e ofertas únicas fazem dela a melhor escolha"
            }
          ].map((item, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">Perguntas frequentes</h2>
        <div className="space-y-6">
          {[
            {
              question: "Como funciona a instalação?",
              answer: "A instalação é agendada após a contratação e realizada por técnicos especializados em até 7 dias úteis."
            },
            {
              question: "Qual a diferença do Wi-Fi 6?",
              answer: "O Wi-Fi 6 oferece maior velocidade, melhor desempenho com múltiplos dispositivos e menor consumo de bateria."
            },
            {
              question: "Posso mudar de plano?",
              answer: "Sim, você pode fazer upgrade de plano a qualquer momento, sujeito às condições vigentes."
            }
          ].map((item, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">{item.question}</h3>
              <p className="text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}