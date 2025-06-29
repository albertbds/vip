import React, { useEffect, useState } from 'react';
import { Download, X, RefreshCw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';

interface SystemUpdate {
  version: string;
  title: string;
  description: string;
  features: string[];
  fixes: string[];
  releaseDate: string;
  critical: boolean;
}

export function SystemUpdateNotifier() {
  const [currentUpdate, setCurrentUpdate] = useState<SystemUpdate | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const { addNotification } = useNotifications();

  // Simular verificação de atualizações
  useEffect(() => {
    const checkForUpdates = () => {
      // Simular uma atualização disponível
      const updates: SystemUpdate[] = [
        {
          version: '2.1.4',
          title: 'Atualização de Segurança e Performance',
          description: 'Esta atualização inclui importantes melhorias de segurança e otimizações de performance.',
          features: [
            'Novo sistema de notificações em tempo real',
            'Interface melhorada para gerenciamento de vendas',
            'Backup automático de dados',
            'Suporte aprimorado para dispositivos móveis'
          ],
          fixes: [
            'Corrigido problema de sincronização de dados',
            'Melhorada estabilidade do sistema de login',
            'Otimizada velocidade de carregamento das páginas',
            'Corrigidos bugs menores na interface'
          ],
          releaseDate: new Date().toISOString(),
          critical: false
        },
        {
          version: '2.1.5',
          title: 'Atualização Crítica de Segurança',
          description: 'Atualização crítica que corrige vulnerabilidades de segurança importantes.',
          features: [
            'Criptografia aprimorada para dados sensíveis',
            'Autenticação de dois fatores opcional',
            'Logs de auditoria detalhados'
          ],
          fixes: [
            'Corrigida vulnerabilidade de segurança crítica',
            'Melhorada validação de entrada de dados',
            'Fortalecida proteção contra ataques'
          ],
          releaseDate: new Date().toISOString(),
          critical: true
        }
      ];

      // Simular disponibilidade de atualização (30% de chance)
      if (Math.random() < 0.3) {
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        setCurrentUpdate(randomUpdate);
        
        // Adicionar notificação
        addNotification({
          title: `Nova Atualização Disponível - v${randomUpdate.version}`,
          message: randomUpdate.description,
          type: randomUpdate.critical ? 'warning' : 'update',
          action: {
            label: 'Ver Detalhes',
            onClick: () => setShowUpdateModal(true)
          }
        });
      }
    };

    // Verificar atualizações a cada 10 minutos
    const interval = setInterval(checkForUpdates, 10 * 60 * 1000);
    
    // Verificação inicial após 30 segundos
    const initialCheck = setTimeout(checkForUpdates, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialCheck);
    };
  }, [addNotification]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    // Simular processo de atualização
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsUpdating(false);
    setUpdateComplete(true);
    
    // Adicionar notificação de sucesso
    addNotification({
      title: 'Atualização Concluída!',
      message: `Sistema atualizado para a versão ${currentUpdate?.version} com sucesso.`,
      type: 'success'
    });

    // Fechar modal após 2 segundos
    setTimeout(() => {
      setShowUpdateModal(false);
      setCurrentUpdate(null);
      setUpdateComplete(false);
    }, 2000);
  };

  const dismissUpdate = () => {
    setShowUpdateModal(false);
    // Não remover currentUpdate para manter a notificação disponível
  };

  return (
    <AnimatePresence>
      {showUpdateModal && currentUpdate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className={`p-6 border-b border-white/10 ${
              currentUpdate.critical ? 'bg-red-600/20' : 'bg-blue-600/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    currentUpdate.critical ? 'bg-red-500/20' : 'bg-blue-500/20'
                  }`}>
                    {updateComplete ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Download className={`w-6 h-6 ${
                        currentUpdate.critical ? 'text-red-400' : 'text-blue-400'
                      }`} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {updateComplete ? 'Atualização Concluída!' : currentUpdate.title}
                    </h2>
                    <p className="text-gray-300">
                      Versão {currentUpdate.version} • {
                        new Date(currentUpdate.releaseDate).toLocaleDateString('pt-BR')
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismissUpdate}
                  disabled={isUpdating}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {updateComplete ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Sistema Atualizado com Sucesso!
                  </h3>
                  <p className="text-gray-300">
                    Todas as melhorias e correções foram aplicadas.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-300 mb-6">{currentUpdate.description}</p>

                  {currentUpdate.critical && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400 mb-2">
                        <Download size={16} />
                        <span className="font-semibold">Atualização Crítica</span>
                      </div>
                      <p className="text-red-200 text-sm">
                        Esta atualização contém correções de segurança importantes e deve ser instalada o mais breve possível.
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  {currentUpdate.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Novos Recursos</h3>
                      <ul className="space-y-2">
                        {currentUpdate.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fixes */}
                  {currentUpdate.fixes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Correções</h3>
                      <ul className="space-y-2">
                        {currentUpdate.fixes.map((fix, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <CheckCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!updateComplete && (
              <div className="p-6 border-t border-white/10 bg-white/5">
                <div className="flex gap-3">
                  <button
                    onClick={dismissUpdate}
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    Mais Tarde
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className={`flex-1 px-6 py-3 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                      currentUpdate.critical 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    }`}
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Instalar Agora
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}