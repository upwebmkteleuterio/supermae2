"use client";

import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  Heart, 
  MessageCircle, 
  Lightbulb, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  Stethoscope,
  ChevronRight,
  Car,
  Search,
  ShoppingBag,
  Flower2,
  ArrowLeft
} from 'lucide-react';

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
  const { navigate, setSelectedChannel, goBack } = useApp();

  const handleChannelClick = (id: string) => {
    setSelectedChannel(id);
    navigate('channel_chat');
  };

  const renderSection = (title: string, subtitle: string, category: string) => {
    const filtered = CHANNELS.filter(c => c.category === category);
    if (filtered.length === 0) return null;

    return (
      <div className="mb-10 last:mb-0">
        <h2 className="font-black text-lg text-slate-900 mb-1">{title}</h2>
        <p className="text-slate-400 text-xs mb-5 font-medium">{subtitle}</p>
        
        <div className="space-y-4">
          {filtered.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelClick(channel.id)}
              className="w-full flex items-center p-4 bg-white rounded-[2rem] border border-slate-50 shadow-sm active:scale-[0.98] transition-all text-left relative group"
            >
              <div className={`w-12 h-12 rounded-2xl ${channel.color} flex items-center justify-center text-white shadow-lg shrink-0 mr-4 group-hover:scale-105 transition-transform`}>
                {channel.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {channel.badge && (
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tight">
                      {channel.badge}
                    </span>
                  )}
                  {channel.badge && <span className="w-1 h-1 rounded-full bg-slate-200" />}
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-tight">{channel.tag}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-0.5 truncate">{channel.name}</h3>
                <p className="text-slate-500 text-[11px] line-clamp-2 leading-snug font-medium opacity-80">
                  {channel.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-200 ml-2 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Canais Temáticos</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 pb-32">
        {renderSection("Espaços Super Mãe Atípica", "Grupos focados na jornada atípica", "atipica")}
        <div className="my-8 border-t border-slate-100" />
        {renderSection("Comunidade Geral", "Rede de troca entre todas as mães", "geral")}
      </div>
    </Layout>
  );
};