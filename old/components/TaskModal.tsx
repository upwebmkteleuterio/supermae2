
import React, { useState } from 'react';
import { X, Clock, Bell, Users, Calendar as CalendarIcon, ChevronDown, Plus, Check } from 'lucide-react';
import { AgendaItem, Child } from '../types';
import { useApp } from '../store/AppContext';

interface TaskModalProps {
  onClose: () => void;
  onSave: (task: Partial<AgendaItem>) => void;
  initialTask?: AgendaItem;
  owner?: 'mãe' | 'filho';
  date: string;
}

const REPETITION_OPTIONS = ["Não repetir", "Todos os dias", "Segunda a Sexta", "Finais de semana", "Personalizado"];

export const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSave, initialTask, owner = 'mãe', date }) => {
  const { state } = useApp();
  const [title, setTitle] = useState(initialTask?.title || '');
  const [time, setTime] = useState(initialTask?.time || '18:00');
  const [reminder, setReminder] = useState(initialTask?.reminder || false);
  const [repetition, setRepetition] = useState(initialTask?.description?.split(': ')[1] || REPETITION_OPTIONS[0]);
  
  // Se for nova tarefa e vier da agenda integrada ou mãe, garante que 'mom' está presente
  const [participantIds, setParticipantIds] = useState<string[]>(() => {
    if (initialTask?.participantIds) return initialTask.participantIds;
    const base = ['mom'];
    if (owner === 'filho' && state.selectedChildId) base.push(state.selectedChildId);
    return base;
  });
  
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);

  const getParticipantsLabel = () => {
    const hasMom = participantIds.includes('mom');
    const childIds = participantIds.filter(p => p !== 'mom');
    const childNames = childIds.map(id => state.children.find(c => c.id === id)?.name).filter(Boolean);
    
    let parts: string[] = [];
    if (hasMom) parts.push("Eu");
    parts = [...parts, ...(childNames as string[])];
    
    if (parts.length === 0) return "Ninguém";
    if (parts.length === 1) return parts[0] === "Eu" ? "Sozinha" : parts[0];
    
    // Formatação: A, B e C
    const last = parts.pop();
    const joined = parts.join(", ") + " e " + last;
    
    return joined.length > 22 ? joined.substring(0, 20) + "..." : joined;
  };

  const toggleParticipant = (id: string) => {
    setParticipantIds(prev => {
      // Regra: Se clicar em 'mom' quando está sozinha, não faz nada. 
      // Mas se houver outros e clicar em 'mom', alterna.
      if (id === 'mom') {
        if (prev.includes('mom') && prev.length > 1) return prev.filter(p => p !== 'mom');
        if (!prev.includes('mom')) return ['mom', ...prev];
        return prev;
      }

      // Se clicar em um filho:
      if (prev.includes(id)) {
        const next = prev.filter(p => p !== id);
        // Se ficou vazio, volta para 'mom'
        return next.length === 0 ? ['mom'] : next;
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSetSozinha = () => {
    setParticipantIds(['mom']);
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Agenda Integrada - Adicionar Tarefa</h3>
            <button onClick={onClose} className="p-1 text-slate-300"><X className="w-5 h-5" /></button>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 rounded-2xl p-4">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome da Atividade" 
                className="w-full bg-transparent border-none text-center focus:ring-0 outline-none text-slate-500 font-bold text-lg placeholder:text-slate-300" 
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-purple-400" />
                  <span className="text-slate-700 font-bold">Lembrete</span>
                </div>
                <div 
                  onClick={() => setReminder(!reminder)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${reminder ? 'bg-purple-600' : 'bg-slate-100'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${reminder ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <span className="text-slate-700 font-bold">Quando</span>
                </div>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="text-slate-400 font-bold focus:outline-none border-none bg-transparent text-right"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-6 h-6 text-purple-400" />
                  <span className="text-slate-700 font-bold">Repetição</span>
                </div>
                <select 
                   value={repetition}
                   onChange={e => setRepetition(e.target.value)}
                   className="appearance-none bg-transparent text-slate-400 font-bold text-sm border-none focus:ring-0 text-right pr-0"
                >
                    {REPETITION_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>

              <button 
                onClick={() => setShowParticipantsModal(true)}
                className="w-full flex items-center justify-between py-2 active:opacity-60 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-400" />
                  <span className="text-slate-700 font-bold">Participantes</span>
                </div>
                <span className="text-slate-400 font-bold text-sm max-w-[150px] truncate text-right">
                  {getParticipantsLabel()}
                </span>
              </button>
            </div>
          </div>

          <button 
            disabled={!title}
            onClick={() => onSave({ 
              title, 
              time, 
              category: 'Outros', 
              owner: participantIds.includes('mom') ? 'mãe' : 'filho', 
              participantIds,
              date, 
              reminder,
              description: `Repetição: ${repetition}`,
              id: initialTask?.id || Math.random().toString(36).substr(2, 9) 
            })}
            className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 mt-10 active:scale-95 transition-all disabled:opacity-30"
          >
            {initialTask ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>

      {/* Modal de Participantes */}
      {showParticipantsModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Agenda Integrada - Participantes</h3>
              <button onClick={() => setShowParticipantsModal(false)} className="p-1 text-slate-300"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
               <button 
                 onClick={handleSetSozinha}
                 className={`w-full bg-slate-50 rounded-2xl p-4 flex items-center justify-between border-2 transition-all ${participantIds.length === 1 && participantIds[0] === 'mom' ? 'border-purple-200 bg-purple-50' : 'border-transparent'}`}
               >
                  <span className={`font-bold ${participantIds.length === 1 && participantIds[0] === 'mom' ? 'text-purple-700' : 'text-slate-700'}`}>Sozinha</span>
                  {participantIds.length === 1 && participantIds[0] === 'mom' && <Check className="w-5 h-5 text-purple-600" />}
               </button>

               <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ou selecione filhos</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
               </div>

               <div className="space-y-3 pt-2">
                 <div 
                   onClick={() => toggleParticipant('mom')}
                   className={`bg-slate-50 rounded-2xl p-4 flex items-center justify-between cursor-pointer border-2 transition-all ${participantIds.includes('mom') ? 'border-purple-200' : 'border-transparent'}`}
                 >
                   <span className="font-bold text-slate-700">Eu (Mãe)</span>
                   {participantIds.includes('mom') ? <Check className="w-5 h-5 text-purple-600" /> : <Plus className="w-5 h-5 text-slate-300" />}
                 </div>

                 {state.children.map(child => (
                   <div 
                     key={child.id}
                     onClick={() => toggleParticipant(child.id)}
                     className={`bg-slate-50 rounded-2xl p-4 flex items-center justify-between cursor-pointer border-2 transition-all ${participantIds.includes(child.id) ? 'border-purple-200' : 'border-transparent'}`}
                   >
                     <span className="font-bold text-purple-400">{child.name}</span>
                     {participantIds.includes(child.id) ? (
                        <Check className="w-5 h-5 text-purple-600" />
                     ) : (
                        <Plus className="w-5 h-5 text-purple-400" />
                     )}
                   </div>
                 ))}
               </div>
            </div>

            <button 
              onClick={() => setShowParticipantsModal(false)}
              className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 mt-8 active:scale-95 transition-all"
            >
              Confirmar Participantes
            </button>
          </div>
        </div>
      )}
    </>
  );
};
