
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { ArrowLeft, ChevronRight, Plus, Image as ImageIcon } from 'lucide-react';

export const ChildrenSelection: React.FC = () => {
  const { state, navigate, goBack, selectChild } = useApp();

  const handleSelectChild = (id: string) => {
    selectChild(id);
    navigate('child_agenda');
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      {/* Header com Voltar e SOS */}
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Agenda de cuidados</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 space-y-4 pb-32">
        {state.children.map((child) => (
          <button
            key={child.id}
            onClick={() => handleSelectChild(child.id)}
            className="w-full bg-white rounded-[1.5rem] p-4 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-800 text-lg">{child.name}</h4>
                <p className="text-slate-400 text-sm">{child.age}</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-purple-400" />
          </button>
        ))}

        <button
          onClick={() => navigate('add_child')}
          className="w-full bg-white rounded-[1.5rem] p-4 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center border border-slate-100 border-dashed">
              <ImageIcon className="w-8 h-8 opacity-50" />
            </div>
            <span className="text-slate-700 font-bold text-lg">Adicionar filho(a)</span>
          </div>
          <Plus className="w-6 h-6 text-purple-400" />
        </button>
      </div>
    </Layout>
  );
};
