import React, { useState } from 'react';
import { BookOpen, Headphones, Newspaper, GitCommit as Comic, Dumbbell, Heart, GraduationCap, Copy, Check } from 'lucide-react';

interface App {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
}

const apps: App[] = [
  {
    id: 1,
    name: "Conta Outra Vez",
    description: "Uma plataforma de livros que conecta grandes autores a pequenos leitores. Todos os meses novos títulos digitais para serem compartilhados entre adultos e crianças, numa relação de mediação e descoberta.",
    icon: BookOpen
  },
  {
    id: 2,
    name: "Skeelo",
    description: "Tenha acesso aos melhores ebooks e audiobooks disponíveis no mercado com o maior aplicativo de livros digitais para ler e ouvir quando e onde quiser.",
    icon: Headphones
  },
  {
    id: 3,
    name: "Bebanca",
    description: "Um aplicativo com jornais, revistas e notícias dos maiores veículos de comunicação do país para quem quer se manter informado e ler onde quando quiser.",
    icon: Newspaper
  },
  {
    id: 4,
    name: "Super Comics",
    description: "Acesse uma coleção com dezenas de títulos, além de encontrar histórias com Super Motion e ler HQs tradicionais. E mais: você pode baixar histórias para ler offline e receber recomendações criadas pra você.",
    icon: Comic
  },
  {
    id: 5,
    name: "Fit Anywhere",
    description: "Um aplicativo para quem busca uma vida de bem-estar, com treinos exclusivos e personalizados, aulas de diversas modalidades, desafios de transformação, dicas de saúde e muito mais.",
    icon: Dumbbell
  },
  {
    id: 6,
    name: "ESaúde Assist",
    description: "Aplicativo de busca e demanda espontânea de profissionais de saúde. Acesso imediato e agendado à profissionais de saúde nas redondezas ou de acordo com suas habilidades específicas.",
    icon: Heart
  },
  {
    id: 7,
    name: "Qualifica",
    description: "Uma plataforma de qualificação profissional e pessoal onde você desenvolve habilidades e competências que irão ajudá-lo em seu dia a dia em uma empresa ou em sua jornada como empreendedor.",
    icon: GraduationCap
  }
];

export function AppList() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid gap-6">
      {apps.map((app) => (
        <div
          key={app.id}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-start gap-4 transition-all hover:bg-white/15"
        >
          <div className="flex-shrink-0">
            <app.icon size={32} className="text-blue-400" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-white mb-2">{app.name}</h3>
              <button
                onClick={() => handleCopy(`${app.name}: ${app.description}`, app.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                  copiedId === app.id
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copiedId === app.id ? (
                  <>
                    <Check size={16} />
                    <span className="text-sm">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="text-sm">Copiar</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-300">{app.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}