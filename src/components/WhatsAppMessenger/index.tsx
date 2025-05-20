import React, { useState } from 'react';
import { Send, Upload, Clock, AlertCircle, Trash, Copy } from 'lucide-react';

interface Message {
  numbers: string[];
  text: string;
  delay: number;
}

export function WhatsAppMessenger() {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [delay, setDelay] = useState(15);
  const [isSending, setIsSending] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNumbersUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const newNumbers = text.split('\n')
          .map(num => num.trim())
          .filter(num => /^\d+$/.test(num));
        setNumbers(prevNumbers => [...prevNumbers, ...newNumbers]);
      };
      reader.readAsText(file);
    }
  };

  const handleAddNumber = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const input = event.target as HTMLInputElement;
      const number = input.value.trim();
      if (/^\d+$/.test(number)) {
        setNumbers(prev => [...prev, number]);
        input.value = '';
      }
    }
  };

  const removeNumber = (index: number) => {
    setNumbers(prev => prev.filter((_, i) => i !== index));
  };

  const startSending = async () => {
    if (!numbers.length || !messageText) return;
    
    setIsSending(true);
    setCurrentIndex(0);

    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      setCurrentIndex(i);
      
      // Open WhatsApp Web with the current number and message
      const encodedMessage = encodeURIComponent(messageText);
      window.open(`https://web.whatsapp.com/send?phone=${number}&text=${encodedMessage}`, '_blank');
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }

    setIsSending(false);
    setCurrentIndex(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">WhatsApp Bulk Messenger</h2>

        {/* Numbers Input Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Digite um número e pressione Enter"
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
              onKeyPress={handleAddNumber}
            />
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Upload size={18} />
              <span>Upload CSV</span>
              <input
                type="file"
                accept=".txt,.csv"
                className="hidden"
                onChange={handleNumbersUpload}
              />
            </label>
          </div>

          {/* Numbers List */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {numbers.map((number, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 ${
                  isSending && index === currentIndex ? 'border-2 border-blue-500' : ''
                }`}
              >
                <span>{number}</span>
                <button
                  onClick={() => removeNumber(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="mb-8">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="w-full h-32 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Delay Setting */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <Clock size={16} />
            Intervalo entre mensagens (segundos)
          </label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            min="15"
            className="w-24 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Warning */}
        <div className="mb-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-2 text-yellow-400">
            <AlertCircle size={20} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Recomendações de Uso</h3>
              <ul className="text-sm space-y-1">
                <li>• Mantenha o intervalo mínimo de 15 segundos entre mensagens</li>
                <li>• Evite enviar a mesma mensagem repetidamente</li>
                <li>• Não use para spam ou conteúdo indesejado</li>
                <li>• Certifique-se que o WhatsApp Web está aberto e conectado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={startSending}
            disabled={!numbers.length || !messageText || isSending}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              !numbers.length || !messageText || isSending
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Send size={18} />
            {isSending ? 'Enviando...' : 'Iniciar Envio'}
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(numbers.join('\n'))}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-white/5 hover:bg-white/10"
          >
            <Copy size={18} />
            Copiar Números
          </button>
        </div>
      </div>
    </div>
  );
}