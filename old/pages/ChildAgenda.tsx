
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { CalendarHeader } from '../components/CalendarHeader';
import { TaskModal } from '../components/TaskModal';
import { AgendaList } from '../components/AgendaList';
import { Plus } from 'lucide-react';
import { AgendaItem } from '../types';

export const ChildAgenda: React.FC = () => {
  const { state, addAgendaItem, deleteAgendaItem, updateAgendaItem, goBack } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<AgendaItem | undefined>(undefined);

  const selectedChild = state.children.find(c => c.id === state.selectedChildId);

  if (!selectedChild) {
    return (
      <div className="p-20 text-center">
        <p>Selecione um filho primeiro.</p>
        <button onClick={goBack} className="mt-4 text-purple-600 underline">Voltar</button>
      </div>
    );
  }

  const filteredTasks = state.manualChildAgenda
    .filter(t => t.date === state.selectedDate && t.childId === selectedChild.id)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Layout title={`Agenda do ${selectedChild.name}`} showBack themeColor="bg-purple-50/20">
      <div className="px-6 pt-6 pb-32">
        <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-3xl border border-slate-50 shadow-sm">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
            <img src={selectedChild.avatar} alt={selectedChild.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{selectedChild.name}</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{selectedChild.diagnosisStatus}</p>
          </div>
        </div>

        <CalendarHeader />

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Rotina de Hoje</h3>
          <button 
            onClick={() => { setEditingTask(undefined); setShowModal(true); }}
            className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <AgendaList 
          tasks={filteredTasks}
          onEdit={(task) => { setEditingTask(task); setShowModal(true); }}
          onDelete={deleteAgendaItem}
          owner="filho"
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
          owner="filho"
          date={state.selectedDate}
        />
      )}
    </Layout>
  );
};
