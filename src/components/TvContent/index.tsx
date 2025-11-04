import { useState } from 'react';
import { Tv } from 'lucide-react';
import { ChannelList } from './ChannelList';

type PackageType = 'basic' | 'family' | 'cinema' | null;

export function TvContent() {
  const [showChannels, setShowChannels] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(null);

  const packages = [
    {
      id: 'basic' as const,
      name: 'Pacote Básico',
      price: 'R$ 49,90',
      description: 'Canais essenciais para toda a família',
      features: ['Canais abertos', 'Esportes básicos', 'Notícias', 'Infantis']
    },
    {
      id: 'family' as const,
      name: 'Pacote Família',
      price: 'R$ 79,90',
      description: 'Mais opções de entretenimento',
      features: ['Paramount+', 'Mais canais infantis', 'Filmes e séries', 'Variedades']
    },
    {
      id: 'cinema' as const,
      name: 'Pacote Cinema',
      price: 'R$ 99,90',
      description: 'O melhor do entretenimento',
      features: ['HBO Max + Paramount+', 'Canais premium', 'Cinema em casa', 'Todos os esportes']
    }
  ];

  const handleViewChannels = (packageId: PackageType) => {
    setSelectedPackage(packageId);
    setShowChannels(true);
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-2xl p-8 border border-white/10 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <Tv size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Giga+ TV</h2>
            <p className="text-gray-400">Conheça nossos pacotes de canais</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-all"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
            <p className="text-3xl font-bold text-pink-400 mb-4">{pkg.price}</p>
            <p className="text-gray-400 mb-6">{pkg.description}</p>

            <ul className="space-y-2 mb-6">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-pink-400 mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleViewChannels(pkg.id)}
              className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all"
            >
              Ver Lista Completa
            </button>
          </div>
        ))}
      </div>

      <ChannelList
        isOpen={showChannels}
        onClose={() => setShowChannels(false)}
        packageType={selectedPackage}
      />
    </div>
  );
}
