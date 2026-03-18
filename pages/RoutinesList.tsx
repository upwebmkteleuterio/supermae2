import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { Plus, ChevronRight, ArrowLeft, Loader2, Check, X } from 'lucide-react';
import { RoutineCard } from '../components/RoutineCard';
import { CreateRoutineModal } from '../components/CreateRoutineModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Routine } from '../types';
import { ROUTINE_TEMPLATES } from '../constants/Templates';
import { getRoutineIcon } from '../constants/Icons';

export const RoutinesList: React.FC = () => {
  const { state, goBack, addRoutine, selectRoutine, navigate, fetchRoutines, installTemplate, deleteRoutine, updateRoutine } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [installingId, setInstallingId] = useState<string | null>(null);
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [newRoutineName, setNewRoutineName] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchRoutines();
      setLoading(false);
    };
    load();
  }, [fetchRoutines]);

  const handleInstallTemplate = async (template: any) => {
    setInstallingId(template.id);
    await installTemplate(template);
    setInstallingId(null);
  };

  const handleSaveNewRoutine = async (routine: Routine) => {
    setLoading(true);
    await addRoutine(routine);
    setShowModal(false);
    setLoading(false);
  };

  const handleUpdateName = async () => {
    if (!editingRoutine || !newRoutineName.trim()) return;
    await updateRoutine(editingRoutine.id, { name: newRoutineName });
    setEditingRoutine(null);
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
        
        {/* Seção 1: Listagem das Ativas */}
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Suas rotinas ativas</h2>
        <div className="space-y-4 mb-8">
          {loading && state.routines.length === 0 ? (
            [1,2].map(i => <div key={i} className="w-full h-28 bg-slate-50 animate-pulse rounded-[2rem]"></div>)
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
                onEdit={(r) => { setEditingRoutine(r); setNewRoutineName(r.name); }}
                onDelete={(id) => setDeletingId(id)}
              />
            ))
          )}
        </div>

        {/* Seção 2: Criar Manual */}
        <button 
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="w-full bg-white rounded-[1.8rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all mb-10 group relative disabled:opacity-50"
        >
          <div className="flex items-center gap-5 relative">
            <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform relative z-10">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
            </div>
            <span className="text-slate-700 font-bold text-sm">Criar rotina do zero</span>
          </div>
          <ChevronRight className="w-6 h-6 text-purple-300" />
        </button>

        {/* Seção 3: Sugestões Especiais */}
        <div className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4 ml-2">Sugestões Especiais</h2>
          <div className="space-y-4">
            {ROUTINE_TEMPLATES.map(template => {
              const isInstalled = state.routines.some(r => r.name === template.name);
              return (
                <div 
                  key={template.id}
                  className="bg-purple-50/50 rounded-[2rem] p-5 border border-purple-100 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-500 shadow-sm shrink-0">
                      {getRoutineIcon(template.icon, "w-6 h-6")}
                    </div>
                    <div className="text-left">
                      <span className="text-slate-800 font-bold text-sm block">{template.name}</span>
                      <span className="text-purple-400 text-[10px] font-medium uppercase">{template.duration}</span>
                    </div>
                  </div>
                  
                  {isInstalled ? (
                    <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2 border border-purple-100 shadow-sm animate-in fade-in">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Instalado</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleInstallTemplate(template)}
                      disabled={installingId === template.id}
                      className="bg-purple-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-100 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {installingId === template.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Instalar'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Edição de Nome */}
      {editingRoutine && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Editar Nome</h3>
              <button onClick={() => setEditingRoutine(null)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
              <input 
                type="text" 
                autoFocus
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500 outline-none shadow-sm font-bold text-slate-700 text-sm"
              />
              <button 
                onClick={handleUpdateName}
                className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 active:scale-95 transition-all text-xs uppercase tracking-widest"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deletingId && (
        <ConfirmModal 
          title="Excluir rotina?" 
          message="Isso apagará permanentemente esta rotina e todos os hábitos vinculados a ela." 
          confirmText="Sim, excluir"
          onConfirm={() => { deleteRoutine(deletingId); setDeletingId(null); }} 
          onClose={() => setDeletingId(null)} 
        />
      )}

      {showModal && (
        <CreateRoutineModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSaveNewRoutine} 
        />
      )}
    </Layout>
  );
};