import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChannelListProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: 'basic' | 'family' | 'cinema' | null;
}

interface ChannelCategory {
  name: string;
  channels: string[];
}

const basicPackage: ChannelCategory[] = [
  {
    name: "Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta"]
  },
  {
    name: "Esportes",
    channels: ["Band Sports", "SporTV", "SporTV2", "SporTV3"]
  },
  {
    name: "Notícias",
    channels: ["Band News", "Globo News"]
  },
  {
    name: "Infantis",
    channels: ["Gloob", "Gloobinho"]
  },
  {
    name: "Filmes e Séries",
    channels: ["Universal TV", "Studio Universal", "Megapix", "USA"]
  },
  {
    name: "Variedades",
    channels: [
      "Sabor & Arte", "Agro Plus", "C. Empreendedor", "Arte 1", "Multishow",
      "Terra Viva", "GNT", "Canal Off", "Bis", "Modo Viagem", "Viva",
      "Canal Brasil", "Futura", "TV Brasil", "MTV"
    ]
  },
  {
    name: "Religiosos",
    channels: ["Canção Nova", "Rede Vida", "Aparecida"]
  },
  {
    name: "Catálogo",
    channels: ["Lionsgate", "Xpeed", "Sony Pictures", "Universal"]
  }
];

const familyPackage: ChannelCategory[] = [
  {
    name: "Streaming",
    channels: ["Paramount+"]
  },
  {
    name: "Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta", "TV Cultura"]
  },
  {
    name: "Esportes",
    channels: ["Band Sports", "SporTV", "SporTV2", "SporTV3"]
  },
  {
    name: "Notícias",
    channels: ["Band News", "Globo News", "Record News", "Bloomberg"]
  },
  {
    name: "Infantis",
    channels: ["Gloob", "Gloobinho", "Nickeloeon", "Nick Jr."]
  },
  {
    name: "Filmes e Séries",
    channels: ["Universal TV", "Studio Universal", "Megapix", "USA", "Films & Arts", "Comedy Central", "Paramount"]
  },
  {
    name: "Variedades",
    channels: [
      "Sabor & Arte", "Agro Plus", "C. Empreendedor", "Arte 1", "Multishow",
      "Terra Viva", "GNT", "Canal Off", "Bis", "Modo Viagem", "Viva",
      "Canal Brasil", "Futura", "TV Brasil", "MTV"
    ]
  },
  {
    name: "Religiosos",
    channels: ["Canção Nova", "Rede Vida", "Aparecida"]
  },
  {
    name: "Catálogo",
    channels: ["Lionsgate", "Xpeed", "Sony Pictures", "Universal"]
  }
];

const cinemaPackage: ChannelCategory[] = [
  {
    name: "Streaming",
    channels: ["Paramount+ e HBO Max"]
  },
  {
    name: "Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta", "TV Cultura"]
  },
  {
    name: "Esportes",
    channels: ["Band Sports", "SporTV", "SporTV2", "SporTV3"]
  },
  {
    name: "Notícias",
    channels: ["Band News", "Globo News", "Record News", "Bloomberg"]
  },
  {
    name: "Infantis",
    channels: ["Gloob", "Gloobinho", "Nickeloeon", "Nick Jr."]
  },
  {
    name: "Filmes e Séries",
    channels: ["Universal TV", "Studio Universal", "Megapix", "USA", "Films & Arts", "Comedy Central", "Paramount"]
  },
  {
    name: "Variedades",
    channels: [
      "Sabor & Arte", "Agro Plus", "C. Empreendedor", "Arte 1", "Multishow",
      "Terra Viva", "GNT", "Canal Off", "Bis", "Modo Viagem", "Viva",
      "Canal Brasil", "Futura", "TV Brasil", "MTV"
    ]
  },
  {
    name: "Religiosos",
    channels: ["Canção Nova", "Rede Vida", "Aparecida"]
  },
  {
    name: "Catálogo",
    channels: ["Lionsgate", "Xpeed", "Sony Pictures", "Universal"]
  }
];

// Cities with TV service
export const tvCities = new Set([
  // Giga+ TV disponível em: Cabo Frio, Fortaleza, Guarulhos, Macaé, São Paulo, Teresina, Vila Velha e Vitória
  'CABO FRIO', 'FORTALEZA', 'GUARULHOS', 'MACAÉ', 'SÃO PAULO', 'TERESINA', 'VILA VELHA', 'VITÓRIA'
]);

export function ChannelList({ isOpen, onClose, packageType }: ChannelListProps) {
  const [copied, setCopied] = useState(false);

  const getPackageChannels = () => {
    switch (packageType) {
      case 'basic':
        return basicPackage;
      case 'family':
        return familyPackage;
      case 'cinema':
        return cinemaPackage;
      default:
        return [];
    }
  };

  const getPackageName = () => {
    switch (packageType) {
      case 'basic':
        return 'Pacote Básico';
      case 'family':
        return 'Pacote Família';
      case 'cinema':
        return 'Pacote Cinema';
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    const channels = getPackageChannels();
    const text = channels.map(category => 
      `${category.name}\n${category.channels.join('\n')}\n`
    ).join('\n');
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1D1E2C] rounded-lg w-full max-w-4xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-medium">
              Lista de Canais - {getPackageName()}
            </h2>
            <div className="flex items-center gap-2">
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
                    <span>Copiar Lista</span>
                  </>
                )}
              </button>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getPackageChannels().map((category, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-medium text-blue-400 mb-3">
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {category.channels.map((channel, channelIndex) => (
                      <div
                        key={channelIndex}
                        className="px-3 py-2 bg-white/5 rounded-lg"
                      >
                        {channel}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}