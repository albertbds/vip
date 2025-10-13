import { Building2 } from 'lucide-react';

export function Condominiums() {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-teal-600/20 to-green-600/20 rounded-2xl p-8 border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center">
            <Building2 size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Condomínios</h2>
            <p className="text-gray-400">Informações sobre serviços para condomínios</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Serviços Disponíveis</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Internet de alta velocidade para áreas comuns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Planos personalizados para moradores</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Suporte técnico dedicado</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Instalação profissional</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Entre em Contato</h3>
            <p className="text-gray-300 mb-4">
              Para informações sobre planos para condomínios, entre em contato com nossa equipe comercial.
            </p>
            <a
              href="https://beacons.ai/gigamaisempresas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-lg hover:from-teal-700 hover:to-green-700 transition-all transform hover:scale-105"
            >
              Portal Empresarial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
