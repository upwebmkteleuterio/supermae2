
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { User, Baby, ChevronRight, ArrowLeft } from 'lucide-react';

export const CareInstancesTarget: React.FC = () => {
  const { navigate, goBack } = useApp();

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Cuidado personalizado</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 text-center mb-10">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Para quem é o cuidado hoje?</h2>
        <p className="text-slate-400 text-sm font-medium">Escolha uma jornada para receber recomendações adaptadas às suas necessidades.</p>
      </div>

      <div className="px-6 space-y-4">
        <TargetCard 
          icon={<User className="w-8 h-8" />} 
          title="Para mim" 
          description="Foco total na sua saúde emocional, física e identidade como mulher e mãe." 
          onClick={() => navigate('care_instances_list')} 
        />
        
        <TargetCard 
          icon={<Baby className="w-8 h-8" />} 
          title="Para meu filho" 
          description="Atividades sensoriais, apoio terapêutico e conexão lúdica." 
          onClick={() => navigate('children_selection')} 
        />
      </div>
    </Layout>
  );
};

const TargetCard = ({ icon, title, description, onClick }: any) => (
  <button 
    onClick={onClick} 
    className="w-full bg-white rounded-[2.5rem] p-8 flex items-center gap-6 border border-slate-50 shadow-sm active:scale-[0.98] transition-all text-left group"
  >
    <div className="w-16 h-16 bg-[#F3E8FF] text-purple-600 rounded-3xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-purple-200 shrink-0" />
  </button>
);
