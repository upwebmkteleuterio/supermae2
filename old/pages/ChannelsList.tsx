
import React, { useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  Bot, 
  Sparkles, 
  Truck, 
  ShoppingCart,
  ArrowLeft,
  HeartHandshake,
  SearchCheck,
  Trophy,
  Stethoscope,
  ShieldCheck,
  Star,
  Lock
} from 'lucide-react';

export const CHANNELS = [
  // Canais Atípica
  { 
    id: 'atipica_desabafa', 
    icon: <HeartHandshake className="w-8 h-8" />, 
    title: "Desabafa, Mãe Atípica", 
    description: "Espaço exclusivo para compartilhar dores e lutas da jornada atípica.",
    color: "bg-rose-500",
    isAI: false,
    category: 'atipica'
  },
  { 
    id: 'atipica_indica', 
    icon: <SearchCheck className="w-8 h-8" />, 
    title: "Indicações entre Mães", 
    description: "Encontre especialistas e serviços recomendados pela comunidade.",
    color: "bg-teal-600",
    isAI: false,
    category: 'atipica'
  },
  { 
    id: 'atipica_vitorias', 
    icon: <Trophy className="w-8 h-8" />, 
    title: "Pequenas Vitórias", 
    description: "Celebre cada conquista do seu filho e da sua jornada conosco!",
    color: "bg-amber-500",
    isAI: false,
    category: 'atipica'
  },
  { 
    id: 'atipica_terapias', 
    icon: <Stethoscope className="w-8 h-8" />, 
    title: "Terapias e Rotinas", 
    description: "Troca de experiências sobre protocolos, clínicas e gestão diária.",
    color: "bg-indigo-600",
    isAI: false,
    category: 'atipica'
  },
  { 
    id: 'atipica_direitos', 
    icon: <ShieldCheck className="w-8 h-8" />, 
    title: "Auxílio, Direitos e Leis", 
    description: "Informações sobre BPC, planos de saúde e suporte jurídico.",
    color: "bg-blue-700",
    isAI: false,
    category: 'atipica'
  },
  // Canais Gerais
  { 
    id: 'ia_duvidas', 
    icon: <Bot className="w-8 h-8" />, 
    title: "Tire dúvidas com IA", 
    description: "Sua mentora particular disponível 24h para suporte imediato.",
    color: "bg-indigo-500",
    isAI: true,
    category: 'geral'
  },
  { 
    id: 'autocuidado', 
    icon: <Sparkles className="w-8 h-8" />, 
    title: "Autocuidado Possível", 
    description: "Ideias práticas para se cuidar no meio do furacão.",
    color: "bg-purple-500",
    isAI: false,
    category: 'geral'
  },
  { 
    id: 'carona', 
    icon: <Truck className="w-8 h-8" />, 
    title: "Carona e Apoio Local", 
    description: "Mães da mesma região se ajudando na logística.",
    color: "bg-blue-500",
    isAI: false,
    category: 'geral'
  },
  { 
    id: 'venda_troca', 
    icon: <ShoppingCart className="w-8 h-8" />, 
    title: "Venda e Troca", 
    description: "Desapegos e trocas de itens que seus filhos não usam mais.",
    color: "bg-emerald-500",
    isAI: false,
    category: 'geral'
  }
];

export const ChannelsList: React.FC = () => {
  const { state, navigate, setSelectedChannel } = useApp();

  const handleOpenChannel = (id: string) => {
    setSelectedChannel(id);
    navigate('channel_chat');
  };

  const isAtypical = state.userProfile.welcomingGoal?.toLowerCase().includes('atípico');

  const atypicalChannels = useMemo(() => CHANNELS.filter(c => c.category === 'atipica'), []);
  const generalChannels = useMemo(() => CHANNELS.filter(c => c.category === 'geral'), []);

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('home')} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Canais Temáticos</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 space-y-10 pb-40">
        {/* Seção Canais Atípica */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-5 ml-1">
            <div className="flex flex-col">
              <h2 className={`font-black text-xs uppercase tracking-[0.2em] ${isAtypical ? 'text-purple-600' : 'text-slate-400'}`}>
                {isAtypical ? 'Espaços Super Mãe Atípica' : 'Apoio Especializado'}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">Grupos focados na jornada atípica</p>
            </div>
            {isAtypical && (
              <div className="bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-purple-200">
                <Star className="w-3 h-3 text-purple-600 fill-current" />
                <span className="text-[8px] font-black text-purple-600 uppercase">Prioritário</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {atypicalChannels.map((channel) => (
              <ChannelCard 
                key={channel.id}
                icon={channel.icon}
                title={channel.title}
                description={channel.description}
                color={channel.color}
                isAI={channel.isAI}
                tag={isAtypical ? "Exclusivo Atípica" : "Acesso Aberto"}
                highlight={isAtypical}
                onClick={() => handleOpenChannel(channel.id)}
              />
            ))}
          </div>
        </section>

        {/* Seção Canais Comunidade */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex flex-col mb-5 ml-1">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Comunidade Geral</h2>
            <p className="text-[10px] text-slate-400 font-medium">Rede de troca entre todas as mães</p>
          </div>

          <div className="space-y-4">
            {generalChannels.map((channel) => (
              <ChannelCard 
                key={channel.id}
                icon={channel.icon}
                title={channel.title}
                description={channel.description}
                color={channel.color}
                isAI={channel.isAI}
                onClick={() => handleOpenChannel(channel.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

const ChannelCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
  isAI?: boolean;
  tag?: string;
  highlight?: boolean;
  onClick: () => void;
}> = ({ icon, title, description, color, isAI, tag, highlight, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full bg-white rounded-[24px] flex overflow-hidden border transition-all text-left min-h-[110px] group relative ${
      highlight 
      ? 'border-purple-100 shadow-lg shadow-purple-50 ring-1 ring-purple-50' 
      : 'border-slate-50 shadow-sm'
    } active:scale-[0.98]`}
  >
    {/* Faixa de Destaque para Atípica */}
    {highlight && (
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-500"></div>
    )}

    <div className={`w-[90px] ${color} flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-105 relative`}>
      <div className="text-white relative z-10">
        {icon}
      </div>
      {/* Overlay sutil para profundidade */}
      <div className="absolute inset-0 bg-black/5"></div>
    </div>
    
    <div className="flex-1 p-5 flex flex-col justify-center">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex flex-col">
          {tag && (
            <span className={`text-[7px] font-black uppercase tracking-[0.2em] mb-0.5 ${
              highlight ? 'text-purple-500' : 'text-slate-400'
            }`}>
              {tag}
            </span>
          )}
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        </div>
        {!isAI && (
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
             <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[7px] font-black text-slate-400 uppercase">Mães Online</span>
          </div>
        )}
      </div>
      <p className="text-[#6B7280] text-[10px] leading-relaxed font-medium line-clamp-2">
        {description}
      </p>
    </div>
  </button>
);
