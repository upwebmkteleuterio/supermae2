
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { Plus, ChevronRight, ArrowLeft } from 'lucide-react';
import { RoutineCard } from '../components/RoutineCard';
import { CreateRoutineModal } from '../components/CreateRoutineModal';
import { Routine } from '../types';

export const RoutinesList: React.FC = () => {
  const { state, goBack, addRoutine, selectRoutine, navigate } = useApp();
  const [showModal, setShowModal] = useState(false);

  const handleSaveNewRoutine = (routine: Routine) => {
    addRoutine(routine);
    setShowModal(false);
  };

  const handleOpenRoutine = (id: string) => {
    selectRoutine(id);
    navigate('routine_detail');
  };

  const hasNoRoutines = state.routines.length === 0;

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      {/* Header */}
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Minhas Rotinas</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 pb-32">
        {/* Botão Criar Rotina */}
        <button 
          onClick={() => setShowModal(true)}
          className="w-full bg-white rounded-[1.8rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all mb-10 group relative"
        >
          <div className="flex items-center gap-5 relative">
            <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform relative z-10">
              <Plus className="w-6 h-6" />
            </div>
            {/* Efeito de pulso se não houver rotinas */}
            {hasNoRoutines && (
              <div className="absolute inset-0 w-14 h-14 bg-purple-200 rounded-2xl animate-ripple-pulse z-0 pointer-events-none"></div>
            )}
            <span className="text-slate-700 font-bold text-sm">Criar minha rotina</span>
          </div>
          <ChevronRight className="w-6 h-6 text-purple-300" />
        </button>

        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Sua rotina personalizada</h2>
        
        {/* Listagem de Rotinas */}
        <div className="space-y-4">
          {state.routines.map((routine) => (
            <RoutineCard 
              key={routine.id} 
              routine={routine} 
              onClick={handleOpenRoutine} 
            />
          ))}
        </div>
      </div>

      {/* Modal Criar Rotina */}
      {showModal && (
        <CreateRoutineModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSaveNewRoutine} 
        />
      )}
    </Layout>
  );
};
