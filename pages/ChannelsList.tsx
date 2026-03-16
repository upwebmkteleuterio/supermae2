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
  Search,
  ShoppingBag,
  Flower2
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const CHANNELS = [
  // --- ESPAÇOS SUPER MÃE ATÍPICA ---
  { 
    id: 'atipica_ia_comportamento', 
    name: 'Dúvidas: Desenv. e Comportamento', 
    category: 'atipica',
    tag: 'IA Ativa',
    badge: 'Exclusivo Atípica',
    icon: <MessageCircle className="w-5 h-5" />,
    description: "Mentoria IA especialista em comportamento e marcos do desenvolvimento atípico.",
    color: "bg-purple-600"
  },
  { 
    id: 'atipica_vitorias', 
    name: 'Pequenas Vitórias', 
    category: 'atipica',
    tag: 'Mães Online',
    badge: 'Exclusivo Atípica',
    icon: <Trophy className="w-5 h-5" />,
    description: "Celebre cada conquista do seu filho e da sua jornada conosco!",
    color: "bg-orange-500"
  },
  { 
    id: 'atipica_terapias', 
    name: 'Terapias e Rotinas', 
    category: 'atipica',
    tag: 'Mães Online',
    badge: 'Exclusivo Atípica',
    icon: <Stethoscope className="w-5 h-5" />,
    description: "Troca de experiências sobre protocolos, clínicas e gestão diária.",
    color: "bg-cyan-600"
  },
  { 
    id: 'atipica_direitos', 
    name: 'Auxílio, Direitos e Leis', 
    category: 'atipica',
    tag: 'Mães Online',
    badge: 'Exclusivo Atípica',
    icon: <ShieldCheck className="w-5 h-5" />,
    description: "Informações sobre BPC, planos de saúde e suporte jurídico.",
    color: "bg-slate-700"
  },

  // --- COMUNIDADE GERAL ---
  { 
    id: 'ia_duvidas', 
    name: 'Tire dúvidas com IA', 
    category: 'geral',
    tag: 'IA Ativa',
    badge: 'Apoio IA',
    icon: <Lightbulb className="w-5 h-5" />,
    description: "Sua mentora particular disponível 24h para suporte imediato.",
    color: "bg-indigo-600"
  },
  { 
    id: 'geral_desabafa', 
    name: 'Desabafa, Mãe!', 
    category: 'geral',
    tag: 'Mães Online',
    badge: 'Prioritário',
    icon: <Heart className="w-5 h-5" />,
    description: "Espaço para compartilhar dores e lutas da jornada materna.",
    color: "bg-rose-500"
  },
  { 
    id: 'geral_indica', 
    name: 'Indica Aí, Mãe!', 
    category: 'geral',
    tag: 'Mães Online',
    badge: 'Comunidade',
    icon: <Search className="w-5 h-5" />,
    description: "Encontre especialistas e serviços recomendados pela comunidade.",
    color: "bg-amber-500"
  },
  { 
    id: 'geral_levezas', 
    name: 'Levezas do Dia', 
    category: 'geral',
    tag: 'Mães Online',
    badge: 'Bem-estar',
    icon: <Sparkles className="w-5 h-5" />,
    description: "Espaço para compartilhar momentos leves e pequenas alegrias.",
    color: "bg-teal-500"
  },
  { 
    id: 'geral_autocuidado', 
    name: 'Autocuidado Possível', 
    category: 'geral',
    tag: 'Mães Online',
    badge: '',
    icon: <Flower2 className="w-5 h-5" />,
    description: "Ideias práticas para se cuidar no meio do furacão.",
    color: "bg-pink-400"
  },
  { 
    id: 'carona', 
    name: 'Carona e Apoio Local', 
    category: 'geral',
    tag: 'Mães Online',
    badge: '',
    icon: <Car className="w-5 h-5" />,
    description: "Mães da mesma região se ajudando na logística.",
    color: "bg-blue-500"
  },
  { 
    id: 'geral_venda', 
    name: 'Venda e Troca', 
    category: 'geral',
    tag: 'Mães Online',
    badge: '',
    icon: <ShoppingBag className="w-5 h-5" />,
    description: "Desapegos e trocas de itens que seus filhos não usam mais.",
    color: "bg-emerald-500"
  }
];

export const ChannelsList: React.FC = () => {
  const { navigate, setSelectedChannel } = useApp();

  const handleChannelClick = (id: string) => {
    setSelectedChannel(id);
    navigate('channel_chat');
  };

  const renderSection = (title: string, subtitle: string, category: string) => {
    const filtered = CHANNELS.filter(c => c.category === category);
    if (filtered.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="font-black text-lg text-slate-900 mb-1">{title}</h2>
        <p className="text-slate-500 text-xs mb-4 font-medium">{subtitle}</p>
        
        <div className="space-y-3">
          {filtered.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelClick(channel.id)}
              className="w-full flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all text-left relative overflow-hidden group"
            >
              <div className={`w-12 h-12 rounded-xl ${channel.color} flex items-center justify-center text-white shadow-lg shrink-0 mr-4 group-hover:scale-110 transition-transform`}>
                {channel.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {channel.badge && (
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">
                      {channel.badge}
                    </span>
                  )}
                  {channel.badge && <span className="w-1 h-1 rounded-full bg-slate-300" />}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{channel.tag}</span>
                </div>
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
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100">
        <h1 className="text-2xl font-black text-slate-900 mb-2 text-center">Comunidade</h1>
        <p className="text-slate-500 text-sm leading-relaxed text-center">
          Conecte-se e compartilhe sua jornada.
        </p>
      </div>

      <div className="p-6">
        {renderSection("Espaços Super Mãe Atípica", "Grupos focados na jornada atípica", "atipica")}
        {renderSection("Comunidade Geral", "Rede de troca entre todas as mães", "geral")}

        <div className="mt-4 p-5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl text-white shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <span className="bg-white/20 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              Colabore
            </span>
          </div>
          <h3 className="font-bold text-lg mb-1 text-white">Novo canal em mente?</h3>
          <p className="text-white/80 text-xs mb-4">
            Estamos sempre ouvindo nossa comunidade. Sugira novos temas.
          </p>
          <button className="w-full py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            Sugerir Tema <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};