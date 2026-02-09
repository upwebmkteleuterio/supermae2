
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { Plus, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { RoutineCard } from '../components/RoutineCard';
import { CreateRoutineModal } from '../components/CreateRoutineModal';
import { Routine } from '../types';

export const RoutinesList: React.FC = () => {
  const { state, goBack, addRoutine, selectRoutine, navigate, fetchRoutines } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      console.log("[RoutinesList] Carregando rotinas...");
      await fetchRoutines();
      setLoading(false);
    };
    load();
  }, [fetchRoutines]);

  const handleSaveNewRoutine = async (routine: Routine) => {
    setLoading(true);
    console.log("[RoutinesList] Solicitando salvamento de nova rotina:", routine);
    const success = await addRoutine(routine);
    console.log("[RoutinesList] Resultado do salvamento:", success ? "Sucesso" : "Falha");
    setShowModal(false);
    setLoading(false);
  };

  const handleOpenRoutine = (id: string) => {
    selectRoutine(id);
    navigate('routine_detail');
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
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
        <button 
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="w-full bg-white rounded-[1.8rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all mb-10 group relative disabled:opacity-50"
        >
          <div className="flex items-center gap-5 relative">
            <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform relative z-10">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
            </div>
            <span className="text-slate-700 font-bold text-sm">Criar minha rotina</span>
          </div>
          <ChevronRight className="w-6 h-6 text-purple-300" />
        </button>

        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Sua rotina personalizada</h2>
        
        <div className="space-y-4">
          {loading && state.routines.length === 0 ? (
            [1,2,3].map(i => <div key={i} className="w-full h-28 bg-slate-50 animate-pulse rounded-[2rem]"></div>)
          ) : state.routines.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
              <p className="text-slate-400 text-sm font-medium">Você ainda não criou rotinas.</p>
            </div>
          ) : (
            state.routines.map((routine) => (
              <RoutineCard 
                key={routine.id} 
                routine={routine} 
                onClick={handleOpenRoutine} 
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <CreateRoutineModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSaveNewRoutine} 
        />
      )}
    </Layout>
  );
};
