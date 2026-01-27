
import React, { useState } from 'react';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';
import { AgendaItem } from '../types';
import { HeartCheckbox } from './HeartCheckbox';
import { useApp } from '../store/AppContext';

interface AgendaListProps {
  tasks: AgendaItem[];
  onEdit: (task: AgendaItem) => void;
  onDelete: (id: string, owner: 'mãe' | 'filho') => void;
  owner: 'mãe' | 'filho';
  showTags?: boolean;
}

export const AgendaList: React.FC<AgendaListProps> = ({ tasks, onEdit, onDelete, owner, showTags = false }) => {
  const { state, toggleAgendaItemCompletion } = useApp();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getParticipantsTag = (task: AgendaItem) => {
    const ids = task.participantIds || [];
    if (ids.length === 0) return owner === 'mãe' ? 'Minha tarefa' : 'Tarefa do filho';
    
    const includesMom = ids.includes('mom');
    const childrenCount = ids.filter(p => p !== 'mom').length;

    if (includesMom && childrenCount > 0) {
      return `Integrado: Você e ${childrenCount === 1 ? state.children.find(c => ids.includes(c.id))?.name : childrenCount + ' filhos'}`;
    }
    if (includesMom) return 'Mãe';
    if (childrenCount === 1) return state.children.find(c => ids.includes(c.id))?.name || 'Filho';
    return `Filhos: ${childrenCount} participantes`;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200">
        <p className="text-slate-400 text-sm">Nenhuma tarefa agendada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => {
        const isIntegrated = task.participantIds && task.participantIds.length > 1;

        return (
          <div key={task.id} className="relative group">
            {/* Tag da Agenda Integrada (Visão Completa) */}
            {showTags && (
              <div className="flex items-center gap-1.5 ml-4 mb-2">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {getParticipantsTag(task)}
                </span>
              </div>
            )}

            {/* Tag Flutuante "Integrado" (Visão Individual) */}
            {!showTags && isIntegrated && (
              <div className="absolute -top-2 left-6 z-10 bg-purple-100 text-purple-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border border-white animate-in slide-in-from-top-1 duration-300">
                Integrado
              </div>
            )}
            
            <div className={`bg-white px-4 py-3 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center gap-3 transition-all ${task.completed ? 'opacity-50 grayscale-[0.3]' : ''}`}>
              
              <div className="shrink-0 scale-75 -ml-2">
                <HeartCheckbox 
                  checked={!!task.completed} 
                  onChange={() => toggleAgendaItemCompletion(task.id, owner)} 
                />
              </div>

              <div className={`shrink-0 px-2 py-1 rounded-lg font-black text-[11px] ${
                owner === 'mãe' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'
              }`}>
                {task.time}
              </div>

              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleAgendaItemCompletion(task.id, owner)}>
                <div className="flex items-center">
                  <h4 className={`font-bold text-slate-700 text-sm truncate pr-2 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </h4>
                </div>
              </div>

              <div className="shrink-0">
                <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded-full border ${
                  task.category === 'Terapêutico' ? 'bg-red-50 text-red-500 border-red-100' : 
                  task.category === 'Cuidado' ? 'bg-indigo-50 text-indigo-500 border-indigo-100' :
                  'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {task.category}
                </span>
              </div>

              <button 
                onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {activeMenu === task.id && (
              <>
                <div className="fixed inset-0 z-[55]" onClick={() => setActiveMenu(null)} />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-[60] min-w-[110px] animate-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => { onEdit(task); setActiveMenu(null); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button 
                    onClick={() => { onDelete(task.id, owner); setActiveMenu(null); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
