import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { Plus, ChevronRight, ArrowLeft, Loader2, Check, X, Users, User, Image as ImageIcon } from 'lucide-react';
import { RoutineCard } from '../components/RoutineCard';
import { CreateRoutineModal } from '../components/CreateRoutineModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Routine } from '../types';
import { ROUTINE_TEMPLATES } from '../constants/Templates';
import { getRoutineIcon } from '../constants/Icons';

export const RoutinesList: React.FC = () => {
  const { state, goBack, addRoutine, selectRoutine, navigate, fetchRoutines, installTemplate, deleteRoutine, updateRoutine, selectChild } = useApp();
  const [activeTab, setActiveTab] = useState<'mom' | 'children'>('mom');
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

  const selectedChild = state.children.find(c => c.id === state.selectedChildId);

  const filteredRoutines = useMemo(() => {
    return state.routines.filter(r => 
      activeTab === 'mom' ? !r.child_id : r.child_id === state.selectedChildId
    );
  }, [state.routines, activeTab, state.selectedChildId]);

  const handleInstallTemplate = async (template: any) => {
    setInstallingId(template.id);
    await installTemplate(template);
    setInstallingId(null);
  };

  const handleSaveNewRoutine = async (routine: Routine) => {
    setLoading(true);
    const routineData = { 
      ...routine, 
      child_id: activeTab === 'children' ? state.selectedChildId || undefined : undefined 
    };
    await addRoutine(routineData);
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
      <div className="pt-12 px-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Minhas Rotinas</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 mb-8">
        <div className="bg-slate-100 p-1.5 rounded-[2rem] flex items-center gap-1 shadow-inner border border-slate-200/50">
          <button 
            onClick={() => setActiveTab('mom')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'mom' 
              ? 'bg-white text-purple-600 shadow-md shadow-purple-100 ring-1 ring-purple-100' 
              : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Para Mim
          </button>
          <button 
            onClick={() => setActiveTab('children')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'children' 
              ? 'bg-white text-purple-600 shadow-md shadow-purple-100 ring-1 ring-purple-100' 
              : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Para os Filhos
          </button>
        </div>
      </div>

      <div className="px-6 pb-32">
        {activeTab === 'children' && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Escolha o filho</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
              {state.children.map(child => {
                const isActive = state.selectedChildId === child.id;
                return (
                  <button 
                    key={child.id}
                    onClick={() => selectChild(child.id)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all whitespace-nowrap border-2 ${
                      isActive 
                      ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100 scale-105' 
                      : 'bg-white border-slate-50 text-slate-500 shadow-sm hover:border-purple-200'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0">
                      <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold">{child.name.split(' ')[0]}</span>
                    {isActive && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                  </button>
                );
              })}
              <button 
                onClick={() => navigate('add_child')}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border-2 border-dashed border-slate-200 text-slate-400 whitespace-nowrap active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Novo</span>
              </button>
            </div>
          </div>
        )}

        <div className="animate-in fade-in duration-500">
          {(activeTab === 'children' && !selectedChild) ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30 flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                <Users size={32} />
              </div>
              <p className="text-slate-400 text-xs font-bold px-12 leading-relaxed">
                Selecione um filho acima para ver e gerenciar as rotinas personalizadas dele.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">
                {activeTab === 'mom' ? 'Suas rotinas ativas' : `Rotinas de ${selectedChild?.name.split(' ')[0]}`}
              </h2>
              <div className="space-y-4 mb-8">
                {loading && filteredRoutines.length === 0 ? (
                  [1,2].map(i => <div key={i} className="w-full h-28 bg-slate-50 animate-pulse rounded-[2rem]"></div>)
                ) : filteredRoutines.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                    <p className="text-slate-400 text-xs font-bold px-10">Nenhuma rotina criada nesta categoria.</p>
                  </div>
                ) : (
                  filteredRoutines.map((routine) => (
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

              {activeTab === 'mom' && (
                <div className="mb-10">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4 ml-2">Sugestões Especiais</h2>
                  <div className="space-y-4">
                    {ROUTINE_TEMPLATES.map(template => {
                      const isInstalled = state.routines.some(r => r.name === template.name && !r.child_id);
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
              )}
            </>
          )}
        </div>
      </div>

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