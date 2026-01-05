
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  HelpCircle, 
  Truck, 
  MessagesSquare, 
  Store,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const ChannelsList: React.FC = () => {
  const { navigate, goBack } = useApp();

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      {/* Header Profissional */}
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
        <ChannelCard 
          icon={<HelpCircle className="w-8 h-8" />}
          title="Dúvidas"
          description="Um espaço acolhedor para tirar suas dúvidas e receber apoio de outras mães."
          onClick={() => {}}
        />

        <ChannelCard 
          icon={<Truck className="w-8 h-8" />}
          title="Caronas"
          description="Organize e compartilhe caronas com outras mães. Juntas, facilitamos o dia a dia!"
          onClick={() => {}}
        />

        <ChannelCard 
          icon={<MessagesSquare className="w-8 h-8" />}
          title="Desabafo"
          description="Fale o que sente, sem julgamentos. Aqui é o seu espaço para desabafar e ser ouvida."
          onClick={() => {}}
        />

        <ChannelCard 
          icon={<Store className="w-8 h-8" />}
          title="Indicações"
          description="Compartilhe e descubra indicações úteis de produtos, serviços e lugares confiáveis."
          onClick={() => {}}
        />
      </div>
    </Layout>
  );
};

const ChannelCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[24px] flex overflow-hidden border border-slate-50 shadow-sm active:scale-[0.98] transition-all text-left min-h-[110px]"
  >
    {/* Bloco do Ícone Roxo */}
    <div className="w-[100px] bg-[#8B5CF6] flex items-center justify-center shrink-0">
      <div className="text-white">
        {icon}
      </div>
    </div>
    
    {/* Conteúdo Textual */}
    <div className="flex-1 p-5 flex flex-col justify-center">
      <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-[#6B7280] text-[11px] leading-relaxed font-medium">
        {description}
      </p>
    </div>
  </button>
);
