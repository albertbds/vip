import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PaymentWarningModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se o modal já foi mostrado nesta sessão
    const hasShownWarning = sessionStorage.getItem('paymentWarningShown');
    
    if (!hasShownWarning) {
      // Mostra o modal após 2 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Marca que o aviso foi mostrado nesta sessão
    sessionStorage.setItem('paymentWarningShown', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-orange-900/90 to-red-900/90 backdrop-blur-md rounded-xl p-8 max-w-md w-full border border-orange-500/30 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Aviso Importante</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-orange-300">
                <Clock size={18} />
                <span className="font-semibold">Em Breve: Acesso Pago</span>
              </div>
              
              <p className="text-gray-200 leading-relaxed">
                Para manter o site sempre atualizado com as melhores ofertas e funcionalidades, 
                em breve o acesso será pago.
              </p>
              
              <div className="bg-white/10 rounded-lg p-4 border border-orange-500/20">
                <p className="text-sm text-orange-200">
                  <strong>Por que essa mudança?</strong><br />
                  • Manter dados sempre atualizados<br />
                  • Melhorar a experiência do usuário<br />
                  • Adicionar novas funcionalidades<br />
                  • Garantir suporte técnico contínuo
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                Entendi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}