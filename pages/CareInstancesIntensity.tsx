
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { CARE_INSTANCES } from '../constants/CareInstancesData';
import { ArrowLeft, Sparkles, Zap, ChevronRight } from 'lucide-react';

export const CareInstancesIntensity: React.FC = () => {
  const { state, navigate, goBack, setSelectedCareIntensity, setCareTasks } = useApp();

  const category = CARE_INSTANCES.find(c => c.id === state.selectedCareCategoryId);

  if (!category) return null;

  const handleSelectIntensity = (intensity: 'light' | 'strong') => {
    setSelectedCareIntensity(intensity);
    const rawTasks = intensity === 'light' ? category.leve : category.forca;
    setCareTasks(rawTasks.map((t, idx) => ({ id: `t-${idx}`, text: t, completed: false })));
    navigate('care_instances_tasks');
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Qual o ritmo?</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 mb-10 text-center">
        <div className="inline-block px-4 py-1.5 bg-purple-50 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">
           {category.title}
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Como está sua energia hoje?</h2>
        <p className="text-slate-400 text-sm font-medium">Respeite o seu tempo. Escolha a intensidade que você consegue sustentar agora.</p>
      </div>

      <div className="px-6 space-y-6">
        <button 
          onClick={() => handleSelectIntensity('light')} 
          className="w-full bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all group"
        >
          <div className="w-20 h-20 bg-[#A855F7] rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-purple-100 group-hover:scale-110 transition-transform">
            <Sparkles className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h4 className="font-black text-slate-800 text-xl mb-1 uppercase tracking-tight">Leve</h4>
            <p className="text-slate-400 text-xs font-medium">Pequenos passos, grandes alívios.</p>
          </div>
        </button>

        <button 
          onClick={() => handleSelectIntensity('strong')} 
          className="w-full bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all group"
        >
          <div className="w-20 h-20 bg-[#7C3AED] rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-purple-100 group-hover:scale-110 transition-transform">
            <Zap className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h4 className="font-black text-slate-800 text-xl mb-1 uppercase tracking-tight">Com força</h4>
            <p className="text-slate-400 text-xs font-medium">Ações profundas e fortalecimento.</p>
          </div>
        </button>
      </div>
    </Layout>
  );
};
