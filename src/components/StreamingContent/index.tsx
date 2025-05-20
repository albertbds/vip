import React, { useState } from 'react';
import { Copy, Check, Play, Film, Trophy, Tv, AlertCircle } from 'lucide-react';
import { AppList } from '../AppList';

interface StreamingPlan {
  name: string;
  price: string;
  description: string;
  icon: React.ElementType;
}

const streamingPlans: StreamingPlan[] = [
  {
    name: "Globoplay Padrão",
    price: "32,90",
    description: "Acesso ao catálogo completo de séries, filmes e novelas",
    icon: Play
  },
  {
    name: "Globoplay Premium",
    price: "54,90",
    description: "Catálogo completo + canais ao vivo e conteúdo exclusivo",
    icon: Tv
  },
  {
    name: "Premiere",
    price: "49,90",
    description: "Todos os jogos do Brasileirão e principais campeonatos",
    icon: Trophy
  },
  {
    name: "Telecine",
    price: "29,90",
    description: "Os melhores filmes em primeira mão",
    icon: Film
  },
  {
    name: "Watch+HBOMax",
    price: "30,00",
    description: "Filmes e séries exclusivas HBO + conteúdo Warner",
    icon: Film
  },
  {
    name: "Watch+Paramount",
    price: "10,00",
    description: "Conteúdo exclusivo Paramount e MTV",
    icon: Film
  },
  {
    name: "Globoplay Padrão com A",
    price: "22,90",
    description: "Acesso ao catálogo básico com benefícios especiais",
    icon: Play
  }
];

export function StreamingContent() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('streaming');

  const message = `🎬 Turbine sua experiência de entretenimento!\n\n` +
    `Aproveite nossos serviços premium de streaming com os melhores conteúdos:\n\n` +
    streamingPlans.map(plan => 
      `• ${plan.name}: R$ ${plan.price}\n${plan.description}`
    ).join('\n\n') +
    `\n\n🚀 Turbine agora mesmo seu plano de internet com nossos serviços de filmes, séries e esporte!\n` +
    `Entre em contato e aproveite estas ofertas incríveis! 🎉`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-white">
      <div className="mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('streaming')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'streaming'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Streaming
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'apps'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Apps
          </button>
        </div>
      </div>

      {activeTab === 'streaming' ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Streaming & Entretenimento</h1>
              <p className="text-gray-300">Os melhores conteúdos para sua diversão</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamingPlans.map((plan, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <plan.icon size={24} className="text-blue-400" />
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-blue-400">
                    R$ {plan.price}
                    <span className="text-sm text-gray-400 ml-1">/mês</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AppList />
      )}
    </div>
  );
}