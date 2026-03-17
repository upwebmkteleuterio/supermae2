"use client";

import React, { useState } from 'react';
import { X, Clock, Bell, Users, Calendar as CalendarIcon, ChevronDown, Plus, Check, Star } from 'lucide-react';
import { AgendaItem } from '../types';
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
  const { state, registerHabitTemplate } = useApp();
  const [title, setTitle] = useState(initialTask?.title || '');
  const [time, setTime] = useState(initialTask?.time || '18:00');
  const [reminder, setReminder] = useState(initialTask?.reminder || false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [repetition, setRepetition] = useState(initialTask?.description?.split(': ')[1] || REPETITION_OPTIONS[0]);
  
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
    
    const last = parts.pop();
    const joined = parts.join(", ") + " e " + last;
    return joined.length > 22 ? joined.substring(0, 20) + "..." : joined;
  };

  const handleAction = () => {
    if (!title) return;

    if (saveAsTemplate) {
      registerHabitTemplate({
        id: 'tpl-' + Math.random(),
        title,
        description: '',
        duration: '',
        completed: false,
        category: 'Meus Modelos'
      });
    }

    onSave({ 
      title, 
      time, 
      category: 'Geral', 
      owner: participantIds.includes('mom') ? 'mãe' : 'filho', 
      participantIds,
      date, 
      reminder,
      description: `Repetição: ${repetition}`,
      id: initialTask?.id || Math.random().toString(36).substr(2, 9) 
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto no-scrollbar max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{initialTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
            <button onClick={onClose} className="p-1 text-slate-300"><X className="w-5 h-5" /></button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-4">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Terapia do João" 
                className="w-full bg-transparent border-none text-center focus:ring-0 outline-none text-slate-600 font-bold text-lg placeholder:text-slate-300" 
              />
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-700 font-bold text-sm">Lembrete</span>
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
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-700 font-bold text-sm">Quando</span>
                </div>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="text-purple-600 font-black focus:outline-none border-none bg-purple-50 px-3 py-1 rounded-lg text-sm"
                />
              </div>

              <div 
                onClick={() => setSaveAsTemplate(!saveAsTemplate)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Star className={`w-5 h-5 transition-colors ${saveAsTemplate ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                  <span className="text-slate-700 font-bold text-sm">Salvar como modelo</span>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${saveAsTemplate ? 'bg-amber-400 border-amber-400' : 'border-slate-200'}`}>
                   {saveAsTemplate && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                </div>
              </div>

              <button 
                onClick={() => setShowParticipantsModal(true)}
                className="w-full flex items-center justify-between py-2 active:opacity-60 transition-opacity border-t border-slate-50 pt-4"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-700 font-bold text-sm">Participantes</span>
                </div>
                <span className="text-slate-400 font-bold text-[11px] max-w-[150px] truncate text-right">
                  {getParticipantsLabel()}
                </span>
              </button>
            </div>
          </div>

          <button 
            disabled={!title}
            onClick={handleAction}
            className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 mt-10 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest text-xs"
          >
            {initialTask ? 'Salvar Alterações' : 'Adicionar à Agenda'}
          </button>
        </div>
      </div>

      {/* Reuso do modal de participantes já existente no seu código */}
      {showParticipantsModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Selecionar Participantes</h3>
              <button onClick={() => setShowParticipantsModal(false)} className="p-1 text-slate-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
               <button onClick={() => setParticipantIds(['mom'])} className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${participantIds.length === 1 && participantIds[0] === 'mom' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-slate-50 text-slate-500'}`}><span className="font-bold">Sozinha (Mãe)</span>{participantIds.length === 1 && participantIds[0] === 'mom' && <Check className="w-5 h-5" />}</button>
               {state.children.map(child => (
                 <div key={child.id} onClick={() => setParticipantIds(prev => prev.includes(child.id) ? prev.filter(i => i !== child.id) : [...prev, child.id])} className={`p-4 rounded-2xl flex items-center justify-between border-2 cursor-pointer transition-all ${participantIds.includes(child.id) ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-slate-50 text-slate-500'}`}><span className="font-bold">{child.name}</span>{participantIds.includes(child.id) && <Check className="w-5 h-5" />}</div>
               ))}
            </div>
            <button onClick={() => setShowParticipantsModal(false)} className="w-full bg-purple-600 text-white py-4 rounded-full font-bold mt-8 shadow-md">Confirmar</button>
          </div>
        </div>
      )}
    </>
  );
};