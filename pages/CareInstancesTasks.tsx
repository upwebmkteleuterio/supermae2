
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { HeartCheckbox } from '../components/HeartCheckbox';
import { CareCompletionModal } from '../components/CareCompletionModal';
import { CARE_INSTANCES } from '../constants/CareInstancesData';
import { ArrowLeft, CheckCircle2, Sparkles, Zap, Info, Loader2 } from 'lucide-react';

export const CareInstancesTasks: React.FC = () => {
  const { state, goBack, navigate, toggleCareTask, addAgendaItem } = useApp();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const category = CARE_INSTANCES.find(c => c.id === state.selectedCareCategoryId);
  const intensity = state.selectedCareIntensity;

  if (!category || !intensity) return null;

  const selectedTasks = state.careTasks.filter(t => t.completed);

  const handleFinishFlow = async () => {
    if (selectedTasks.length > 0) {
      setSaving(true);
      try {
        // Persistir cada tarefa selecionada na agenda única
        for (const task of selectedTasks) {
          await addAgendaItem({
            id: Math.random().toString(36).substr(2, 9),
            time: "09:00", // Horário padrão para sugestões
            title: task.text,
            date: state.selectedDate,
            category: category.title,
            owner: state.selectedChildId ? 'filho' : 'mãe',
            participantIds: state.selectedChildId ? [state.selectedChildId] : ['mom'],
            completed: false,
            reminder: true,
            description: "Sugestão Inteligente"
          });
        }
        setShowCompletionModal(true);
      } catch (e) {
        console.error("Erro ao salvar tarefas das instâncias:", e);
        navigate('routines_list');
      } finally {
        setSaving(false);
      }
    } else {
      navigate('routines_list');
    }
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Minhas tarefas</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 mb-8">
        <div className={`p-6 rounded-[2.5rem] flex items-center gap-5 border shadow-sm ${
          intensity === 'light' ? 'bg-purple-50 border-purple-100' : 'bg-indigo-50 border-indigo-100'
        }`}>
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner">
             {intensity === 'light' ? <Sparkles className="w-6 h-6 text-purple-500" /> : <Zap className="w-6 h-6 text-indigo-500" />}
          </div>
          <div>
            <h2 className="text-slate-800 font-bold text-sm leading-tight">{category.title}</h2>
            <p className={`text-[10px] font-black uppercase tracking-widest ${intensity === 'light' ? 'text-purple-400' : 'text-indigo-400'}`}>
              Jornada {intensity === 'light' ? 'Leve' : 'Com Força'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-40">
        <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 flex items-start gap-4 border border-slate-100">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
            Selecione as ações que você se compromete a realizar hoje. Ao concluir, elas serão somadas à sua agenda única do dia.
          </p>
        </div>

        <div className="space-y-4">
          {state.careTasks.map(task => (
            <div 
              key={task.id} 
              className={`bg-white p-5 rounded-[2rem] border transition-all duration-300 flex items-center gap-4 shadow-sm ${
                task.completed ? 'opacity-50 grayscale-[0.2] border-slate-100' : 'border-slate-50 hover:border-purple-200'
              }`}
            >
              <div className="shrink-0">
                <HeartCheckbox checked={task.completed} onChange={() => toggleCareTask(task.id)} />
              </div>
              <p className={`text-slate-700 font-bold text-sm leading-snug flex-1 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                {task.text}
              </p>
            </div>
          ))}
        </div>

        <button 
          onClick={handleFinishFlow} 
          disabled={saving}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2.5rem] font-black shadow-xl shadow-purple-100 mt-12 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          {saving ? 'Salvando na Agenda...' : 'Concluir e Salvar'}
        </button>
      </div>

      {showCompletionModal && (
        <CareCompletionModal 
          onContinue={() => navigate('integrated_agenda')}
          context={{ 
            category: category.title, 
            intensity: intensity === 'breathe' ? 'light' : intensity as 'light' | 'strong', 
            tasks: selectedTasks.map(t => t.text), 
            userName: state.userProfile.name.split(' ')[0] 
          }}
        />
      )}
    </Layout>
  );
};
