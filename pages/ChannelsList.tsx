
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  MessageCircle, 
  Bot, 
  Sparkles, 
  ThumbsUp, 
  Sun, 
  Truck, 
  ShoppingCart,
  ChevronRight,
  ArrowLeft,
  Users
} from 'lucide-react';

export const CHANNELS = [
  { 
    id: 'desabafa', 
    icon: <MessageCircle className="w-8 h-8" />, 
    title: "Desabafa, Mãe!", 
    description: "Um espaço seguro para falar o que sente sem julgamentos.",
    color: "bg-pink-500",
    online: 42
  },
  { 
    id: 'ia_duvidas', 
    icon: <Bot className="w-8 h-8" />, 
    title: "Tire dúvidas com IA", 
    description: "Nossa mentora IA disponível 24h para suporte imediato.",
    color: "bg-indigo-500",
    online: 1
  },
  { 
    id: 'autocuidado', 
    icon: <Sparkles className="w-8 h-8" />, 
    title: "Dicas de autocuidado possível", 
    description: "Ideias práticas para se cuidar no meio do furacão.",
    color: "bg-purple-500",
    online: 15
  },
  { 
    id: 'indica', 
    icon: <ThumbsUp className="w-8 h-8" />, 
    title: "Indica aí, Mãe!", 
    description: "Troca de indicações de médicos, brinquedos e serviços.",
    color: "bg-teal-500",
    online: 28
  },
  { 
    id: 'levezas', 
    icon: <Sun className="w-8 h-8" />, 
    title: "Levezas do Dia", 
    description: "Compartilhe vitórias e momentos bons da sua jornada.",
    color: "bg-amber-500",
    online: 56
  },
  { 
    id: 'carona', 
    icon: <Truck className="w-8 h-8" />, 
    title: "Carona e Apoio Local", 
    description: "Mães da mesma região se ajudando na logística.",
    color: "bg-blue-500",
    online: 9
  },
  { 
    id: 'venda_troca', 
    icon: <ShoppingCart className="w-8 h-8" />, 
    title: "Venda e Troca entre Mães", 
    description: "Desapegos e trocas de itens que seus filhos não usam mais.",
    color: "bg-emerald-500",
    online: 31
  }
];

export const ChannelsList: React.FC = () => {
  const { navigate, setSelectedChannel } = useApp();

  const handleOpenChannel = (id: string) => {
    setSelectedChannel(id);
    navigate('channel_chat');
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('home')} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Canais temáticos</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 space-y-4 pb-40">
        {CHANNELS.map((channel) => (
          <ChannelCard 
            key={channel.id}
            icon={channel.icon}
            title={channel.title}
            description={channel.description}
            color={channel.color}
            online={channel.online}
            onClick={() => handleOpenChannel(channel.id)}
          />
        ))}
      </div>
    </Layout>
  );
};

const ChannelCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
  online: number;
  onClick: () => void;
}> = ({ icon, title, description, color, online, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[24px] flex overflow-hidden border border-slate-50 shadow-sm active:scale-[0.98] transition-all text-left min-h-[110px] group"
  >
    <div className={`w-[100px] ${color} flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105`}>
      <div className="text-white">
        {icon}
      </div>
    </div>
    
    <div className="flex-1 p-5 flex flex-col justify-center">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{online}</span>
        </div>
      </div>
      <p className="text-[#6B7280] text-[11px] leading-relaxed font-medium">
        {description}
      </p>
    </div>
  </button>
);
