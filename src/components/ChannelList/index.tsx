import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChannelListProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: 'essencial' | 'esportes' | 'cinema' | 'completo' | null;
}

interface ChannelCategory {
  name: string;
  channels: string[];
}

const essencialPackage: ChannelCategory[] = [
  {
    name: "Canais Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta", "TV Cultura"]
  },
  {
    name: "Aplicativos Inclusos",
    channels: ["Conta Outra Vez", "Skeelo", "Bebanca", "Qualifica"]
  },
  {
    name: "Adicionais",
    channels: ["Wi-Fi 6", "100% Fibra Óptica", "Instalação Gratuita"]
  }
];

const esportesPackage: ChannelCategory[] = [
  {
    name: "Canais Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta", "TV Cultura"]
  },
  {
    name: "Streaming Inclusos",
    channels: ["Paramount+", "ESPN", "Premiere"]
  },
  {
    name: "Aplicativos Inclusos",
    channels: ["Conta Outra Vez", "Skeelo", "Bebanca", "Qualifica", "Fit Anywhere"]
  },
  {
    name: "Adicionais",
    channels: ["Wi-Fi 6", "100% Fibra Óptica", "Instalação Gratuita"]
  }
];

const cinemaPackage: ChannelCategory[] = [
  {
    name: "Canais Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta", "TV Cultura"]
  },
  {
    name: "Streaming Inclusos",
    channels: ["Paramount+", "HBO Max", "Telecine"]
  },
  {
    name: "Aplicativos Inclusos",
    channels: ["Conta Outra Vez", "Skeelo", "Bebanca", "Qualifica", "Fit Anywhere", "Super Comics"]
  },
  {
    name: "Adicionais",
    channels: ["Wi-Fi 6", "100% Fibra Óptica", "Instalação Gratuita"]
  }
];

const completoPackage: ChannelCategory[] = [
  {
    name: "Canais Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta", "TV Cultura"]
  },
  {
    name: "Streaming Inclusos",
    channels: ["Paramount+", "HBO Max", "Telecine", "ESPN", "Premiere"]
  },
  {
    name: "Aplicativos Inclusos",
    channels: ["Conta Outra Vez", "Skeelo", "Bebanca", "Qualifica", "Fit Anywhere", "Super Comics"]
  },
  {
    name: "Adicionais",
    channels: ["Wi-Fi 6", "100% Fibra Óptica", "Instalação Gratuita"]
  }
];

export function ChannelList({ isOpen, onClose, packageType }: ChannelListProps) {
  const [copied, setCopied] = useState(false);

  const getPackageChannels = () => {
    switch (packageType) {
      case 'essencial':
        return essencialPackage;
      case 'esportes':
        return esportesPackage;
      case 'cinema':
        return cinemaPackage;
      case 'completo':
        return completoPackage;
      default:
        return [];
    }
  };

  const getPackageName = () => {
    switch (packageType) {
      case 'essencial':
        return 'Pacote Essencial';
      case 'esportes':
        return 'Pacote Esportes';
      case 'cinema':
        return 'Pacote Cinema';
      case 'completo':
        return 'Pacote Completo';
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