import React, { useState } from 'react';
import { Copy, Check, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "O que seria Wi-Fi 6?",
    answer: "Vantagens do Wi-Fi 6:\n• Maior velocidade\n• Menor interferência\n• Maior número de dispositivos conectados simultaneamente\n• Economia de energia\n• Maior segurança"
  },
  {
    question: "Informações sobre o plano GIGA",
    answer: "O plano GIGA compreende uma velocidade de até 920 Mbps de download e 460 Mbps de upload. O dispositivo deve ser compatível com a tecnologia 5 GHz."
  },
  {
    question: "Informações sobre o Modem",
    answer: "O Modem Wi-Fi é cedido em regime de comodato e deverá ser devolvido ao término do contrato."
  },
  {
    question: "Informações sobre Velocidade",
    answer: "A velocidade anunciada de acesso e tráfego da internet é a nominal máxima a ser atingida, podendo sofrer variações decorrentes de fatores externos. A velocidade instantânea mínima exigida pela ANATEL para download é de 40% e upload é de 40% da máxima contratada."
  },
  {
    question: "Detalhes sobre Wi-Fi 6",
    answer: "A velocidade de navegação pode ser até 4 vezes mais rápida se comparada com a tecnologia anterior (Wi-Fi 5), enquanto a latência tem uma redução de até 40% no mesmo comparativo. Para obter melhor alcance e estabilidade do sinal é necessário que os dispositivos de uso, como celulares, tablets, notebooks e smart TVs sejam compatíveis com Wi-Fi 6."
  },
  {
    question: "Taxa de Instalação",
    answer: "A Giga+ Fibra, promocionalmente, oferece um desconto referente a Taxa de Instalação para os CLIENTES destes planos que permanecerem durante 12 (doze) meses com este serviço. O valor é de R$ 600,00 (seiscentos reais). Em caso de cancelamento do plano antes de completar o período, será cobrada uma multa por quebra contratual, calculada com base no valor do desconto concedido no ato da contratação, proporcional aos meses faltantes para completar o total de meses."
  },
  {
    question: "Contratos e regulamentos",
    answer: "Ao efetuar a contratação, o CLIENTE adere, sem ressalvas, aos contratos de prestação de serviços do seu plano disponíveis em gigamaisfibra.com.br/contratos-e-regulamentos."
  },
  {
    question: "Informações sobre Globoplay",
    answer: "O Globoplay é a plataforma digital de vídeos comercializado pela GLOBO COMUNICAÇÃO E PARTICIPAÇÕES S.A. através de parceria com a Giga+ Fibra."
  },
  {
    question: "Informações sobre Paramount+",
    answer: "O PARAMOUNT+ é um serviço de streaming de vídeo sob demanda por assinatura fornecido através da parceria GIGA+ FIBRA e WATCH BRASIL."
  },
  {
    question: "Informações sobre Max",
    answer: "Verifique A Classificação Indicativa © 2024 WarnerMedia Direct Latin America, LLC. Todos os direitos reservados. Max é usado sob licença."
  },
  {
    question: "Informações sobre Premiere",
    answer: "O Premiere é uma plataforma de streaming por assinatura usada sob licença da Globo.com © 2000-2023 Globo Comunicação e Participações S.A., que permite assistir pela internet jogos ao vivo dos campeonatos: Brasileiro Série A e B 2023, Copa do Brasil 2023 e estaduais (Gaúcho, Paulista, Mineiro), dos clubes que cederam direitos à Globo. Ao utilizar o Serviço, o cliente está concordando com a Política de Privacidade do Premiere, em: privacidade.globo.com/privacy-policy."
  }
];

export function FAQ() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <HelpCircle size={20} className="text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-300 text-sm whitespace-pre-line">{faq.answer}</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(`${faq.question}\n\n${faq.answer}`, index)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${
                copiedIndex === index
                  ? 'bg-green-500 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {copiedIndex === index ? (
                <>
                  <Check size={14} />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}