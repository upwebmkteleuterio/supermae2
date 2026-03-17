import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { CalendarHeader } from '../components/CalendarHeader';
import { TaskModal } from '../components/TaskModal';
import { AgendaList } from '../components/AgendaList';
import { RoutineSelectionCards } from '../components/RoutineSelectionCards';
import { Plus, Info, Sparkles, LayoutGrid, RefreshCw, ChevronRight } from 'lucide-react';
import { AgendaItem } from '../types';
import { Toaster } from 'react-hot-toast';

export const MomAgenda: React.FC = () => {
  const { state, addAgendaItem, deleteAgendaItem, updateAgendaItem, navigate, repeatPreviousDayRoutine } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTask, setEditingTask] = useState<AgendaItem | undefined>(undefined);

  const filteredTasks = state.manualMomAgenda
    .filter(t => t.date === state.selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Layout title="Minha Agenda" showBack themeColor="bg-indigo-50/20">
      <Toaster position="top-center" />
      <div className="px-6 pt-6 pb-32">
        <CalendarHeader />

        {/* Menu Principal de Opções */}
        <div className="space-y-3 mb-10">
           <AgendaOption 
             icon={<Sparkles className="w-5 h-5" />} 
             label="Escolher Rotina Pronta" 
             onClick={() => setShowTemplates(!showTemplates)}
             active={showTemplates}
           />
           
           {/* Sub-menu de Rotinas Prontas */}
           {showTemplates && (
             <div className="animate-in slide-in-from-top-4 duration-300 mb-6">
                <RoutineSelectionCards />
             </div>
           )}

           <AgendaOption 
             icon={<LayoutGrid className="w-5 h-5" />} 
             label="Montar Minha Rotina (por áreas)" 
             onClick={() => navigate('routines_list')}
           />

           <AgendaOption 
             icon={<RefreshCw className="w-5 h-5" />} 
             label="Repetir rotina do dia anterior" 
             onClick={repeatPreviousDayRoutine}
           />
        </div>

        <div className="bg-white rounded-[2rem] p-6 mb-8 border border-slate-50 flex items-start gap-4 shadow-sm">
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
            Gerencie seu dia com calma. Você pode usar rotinas prontas ou adicionar tarefas manuais abaixo.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Minhas Tarefas do Dia</h3>
          <button 
            onClick={() => { setEditingTask(undefined); setShowModal(true); }}
            className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <AgendaList 
          tasks={filteredTasks}
          onEdit={(task) => { setEditingTask(task); setShowModal(true); }}
          onDelete={deleteAgendaItem}
          owner="mãe"
        />
      </div>

      {showModal && (
        <TaskModal 
          onClose={() => setShowModal(false)}
          onSave={(task) => { 
            if (editingTask) updateAgendaItem(task as AgendaItem);
            else addAgendaItem(task as AgendaItem); 
            setShowModal(false); 
          }}
          initialTask={editingTask}
          owner="mãe"
          date={state.selectedDate}
        />
      )}
    </Layout>
  );
};

const AgendaOption = ({ icon, label, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-5 rounded-[1.8rem] flex items-center justify-between border transition-all active:scale-[0.98] ${
      active ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-white text-slate-700 border-slate-50 shadow-sm'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${active ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
        {icon}
      </div>
      <span className="font-bold text-sm">{label}</span>
    </div>
    <ChevronRight className={`w-5 h-5 transition-transform ${active ? 'rotate-90 text-white' : 'text-slate-300'}`} />
  </button>
);