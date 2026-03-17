import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { CalendarHeader } from '../components/CalendarHeader';
import { TaskModal } from '../components/TaskModal';
import { AgendaList } from '../components/AgendaList';
import { RoutineSelectionCards } from '../components/RoutineSelectionCards';
import { Plus, Info } from 'lucide-react';
import { AgendaItem } from '../types';
import { Toaster } from 'react-hot-toast';

export const MomAgenda: React.FC = () => {
  const { state, addAgendaItem, deleteAgendaItem, updateAgendaItem } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<AgendaItem | undefined>(undefined);

  const filteredTasks = state.manualMomAgenda
    .filter(t => t.date === state.selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Layout title="Minha Agenda" showBack themeColor="bg-indigo-50/20">
      <Toaster position="top-center" />
      <div className="px-6 pt-6 pb-32">
        <CalendarHeader />

        {/* Novas Rotinas Prontas */}
        <RoutineSelectionCards />

        <div className="bg-white rounded-[2rem] p-6 mb-8 border border-slate-50 flex items-start gap-4 shadow-sm">
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
            Use as rotinas prontas acima para preencher seu dia rapidamente ou adicione tarefas manuais no botão abaixo.
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