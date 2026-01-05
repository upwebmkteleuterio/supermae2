
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { CARE_INSTANCES } from '../constants/CareInstancesData';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';

export const CareInstancesList: React.FC = () => {
  const { navigate, goBack, setSelectedCareCategory } = useApp();

  const handleSelectCategory = (id: string) => {
    setSelectedCareCategory(id);
    navigate('care_instances_intensity');
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F5F5FA]">
      <header className="pt-12 pb-6 px-6 sticky top-0 bg-[#F5F5FA] z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Canais de Apoio</h1>
        </div>
        <SOSButton />
      </header>

      <main className="px-5 pb-32">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-start gap-4 mb-6">
          <Info className="w-5 h-5 text-purple-500 shrink-0" />
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
            Selecione a área que mais ressoa com seu momento atual para ver as sugestões de tarefas.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {CARE_INSTANCES.map((item) => (
            <li key={item.id} className="w-full">
              <button 
                onClick={() => handleSelectCategory(item.id)}
                className="w-full bg-white h-24 rounded-[24px] flex items-center overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-transform active:scale-95 duration-200 text-left"
              >
                {/* Image Container */}
                <div className="h-full flex-shrink-0 w-[90px] relative">
                  <img 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                    src={item.image} 
                  />
                  <div className="absolute inset-0 bg-black/5"></div>
                </div>
                
                {/* Text Content */}
                <div className="flex-1 px-5 flex flex-col justify-center h-full">
                  <h2 className="text-base font-bold text-gray-900 leading-tight mb-1">{item.title}</h2>
                  <p className="text-xs font-medium text-gray-400">{item.subtitle}</p>
                </div>

                <div className="pr-5">
                   <ChevronRight className="w-4 h-4 text-purple-200" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
};
