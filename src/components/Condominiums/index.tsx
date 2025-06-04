import React from 'react';
import { Building, List } from 'lucide-react';
import { ChannelList } from '../ChannelList';

export function Condominiums() {
  const [showChannels, setShowChannels] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState<'basic' | 'family' | 'cinema' | null>(null);

  const handleShowChannels = (packageType: 'basic' | 'family' | 'cinema') => {
    setSelectedPackage(packageType);
    setShowChannels(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Building className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Condomínios</h2>
        </div>

        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://app.powerbi.com/view?r=eyJrIjoiMGM0ZWM3YTQtOTMzZC00OGFkLWIzYjUtYTkyNjMzZWRlZWNhIiwidCI6IjdlYmFhNDY3LTNhY2UtNGE5Yy1hZDkxLTRlODQ5MzNhNjYwNyJ9&pageName=705dde3f9b6be3a2b385"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allowFullScreen
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Benefícios para Condomínios</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Internet de alta velocidade para todos os moradores
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Suporte técnico dedicado 24/7
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Instalação profissional sem custos
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Diferenciais</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Fibra óptica até o apartamento
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Planos exclusivos para condomínios
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Atendimento personalizado
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-600 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Canais Disponíveis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleShowChannels('basic')}
              className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
            >
              <span>Pacote Básico</span>
              <List size={16} />
            </button>
            <button
              onClick={() => handleShowChannels('family')}
              className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
            >
              <span>Pacote Família</span>
              <List size={16} />
            </button>
            <button
              onClick={() => handleShowChannels('cinema')}
              className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
            >
              <span>Pacote Cinema</span>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <ChannelList
        isOpen={showChannels}
        onClose={() => setShowChannels(false)}
        packageType={selectedPackage}
      />
    </div>
  );
}