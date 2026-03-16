"use client";

import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  Lightbulb, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  Stethoscope,
  ArrowRight,
  ChevronRight,
  Car,
  Search
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const CHANNELS = [
  // CANAIS COMUNIDADE GERAL
  { 
    id: 'carona', 
    name: 'Carona Amiga', 
    category: 'geral',
    icon: <Car className="w-5 h-5" />,
    description: "Combine caronas e auxílio no transporte para terapias e consultas.",
    color: "bg-blue-500"
  },
  { 
    id: 'geral_desabafa', 
    name: 'Desabafa, Mãe!', 
    category: 'geral',
    icon: <Heart className="w-5 h-5" />,
    description: "Um espaço seguro para compartilhar seus sentimentos e desafios diários.",
    color: "bg-rose-500"
  },
  { 
    id: 'geral_indica', 
    name: 'Indica Aí, Mãe!', 
    category: 'geral',
    icon: <Search className="w-5 h-5" />,
    description: "Dicas de serviços, produtos e profissionais recomendados pela comunidade.",
    color: "bg-amber-500"
  },
  { 
    id: 'geral_levezas', 
    name: 'Levezas do Dia', 
    category: 'geral',
    icon: <Sparkles className="w-5 h-5" />,
    description: "Compartilhe pequenas vitórias e momentos felizes da sua jornada.",
    color: "bg-teal-500"
  },
  
  // CANAIS IA
  { 
    id: 'ia_duvidas', 
    name: 'Dúvidas Gerais (IA)', 
    category: 'ia',
    icon: <Lightbulb className="w-5 h-5" />,
    description: "Tire dúvidas rápidas com nossa inteligência artificial especializada.",
    color: "bg-indigo-600"
  },
  { 
    id: 'atipica_ia_comportamento', 
    name: 'Especialista em Comportamento (IA)', 
    category: 'atipica',
    icon: <MessageCircle className="w-5 h-5" />,
    description: "Consultoria personalizada via IA para desafios comportamentais.",
    color: "bg-purple-600"
  },
  { 
    id: 'atipica_vitorias', 
    name: 'Pequenas Grandes Vitórias', 
    category: 'atipica',
    icon: <Trophy className="w-5 h-5" />,
    description: "Celebre cada evolução no desenvolvimento do seu filho atípico.",
    color: "bg-orange-500"
  },
  { 
    id: 'atipica_terapias', 
    name: 'Guia de Terapias', 
    category: 'atipica',
    icon: <Stethoscope className="w-5 h-5" />,
    description: "Troca de experiências sobre métodos terapêuticos e clínicas.",
    color: "bg-cyan-600"
  },
  { 
    id: 'atipica_direitos', 
    name: 'Direitos e Inclusão', 
    category: 'atipica',
    icon: <ShieldCheck className="w-5 h-5" />,
    description: "Informações jurídicas e dicas sobre direitos das crianças atípicas.",
    color: "bg-slate-700"
  }
];

const ChannelsList: React.FC = () => {
  const { navigate, setSelectedChannel } = useApp();

  const handleChannelClick = (id: string) => {
    setSelectedChannel(id);
    navigate('channelChat');
  };

  const renderSection = (title: string, category: string) => {
    const filtered = CHANNELS.filter(c => c.category === category);
    if (filtered.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">
          {title}
        </h2>
        <div className="space-y-3">
          {filtered.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelClick(channel.id)}
              className="w-full flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all text-left"
            >
              <div className={`w-12 h-12 rounded-xl ${channel.color} flex items-center justify-center text-white shadow-lg shrink-0 mr-4`}>
                {channel.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-base mb-0.5 truncate">{channel.name}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {channel.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 ml-2" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100">
        <h1 className="text-2xl font-black text-slate-900 mb-2">Comunidade</h1>
        <p className="text-slate-500 text-sm">
          Conecte-se com outras mães e troque experiências valiosas.
        </p>
      </div>

      <div className="p-6">
        {/* Seção Inteligência Artificial */}
        {renderSection("Apoio com IA", "ia")}

        {/* Seção Canais Comunidade */}
        {renderSection("Comunidade Geral", "geral")}

        {/* Seção Espaço Atípico */}
        {renderSection("Espaço Super Mãe Atípica", "atipica")}

        {/* Card CTA Voluntariado ou Sugestão */}
        <div className="mt-4 p-5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl text-white shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <span className="bg-white/20 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              Em breve
            </span>
          </div>
          <h3 className="font-bold text-lg mb-1 text-white">Precisa de um novo canal?</h3>
          <p className="text-white/80 text-xs mb-4">
            Estamos sempre ouvindo nossa comunidade. Sugira novos temas para conversarmos.
          </p>
          <button className="w-full py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            Sugerir Tema <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelsList;