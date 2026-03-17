
import React, { useState } from 'react';
import { X, Bell, Clock, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { AgendaItem } from '../types';

interface ChildActivityModalProps {
  onClose: () => void;
  onSave: (task: Partial<AgendaItem>) => void;
  date: string;
  childId: string;
}

const REPETITION_OPTIONS = ["Todos os dias", "Segunda a Sexta", "Finais de semana", "Personalizado", "Não repetir"];

export const ChildActivityModal: React.FC<ChildActivityModalProps> = ({ onClose, onSave, date, childId }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('18:00');
  const [reminder, setReminder] = useState(false);
  const [repetition, setRepetition] = useState(REPETITION_OPTIONS[0]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-end mb-2">
            <button onClick={onClose} className="p-1 text-slate-300">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="space-y-8">
          {/* Título Input Estilizado */}
          <div className="bg-slate-50 rounded-2xl p-6 text-center">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da Atividade" 
              className="w-full bg-transparent border-none text-center focus:ring-0 outline-none text-slate-500 font-bold text-lg placeholder:text-slate-300" 
            />
          </div>

          <div className="space-y-6">
            {/* Lembrete */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-purple-500" />
                <span className="text-slate-700 font-bold">Lembrete</span>
              </div>
              <div 
                onClick={() => setReminder(!reminder)}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${reminder ? 'bg-purple-600' : 'bg-slate-100'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${reminder ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>

            {/* Quando (Hora Editável) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-500" />
                <span className="text-slate-700 font-bold">Quando</span>
              </div>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-purple-600 font-black text-lg focus:outline-none bg-purple-50 px-3 py-1 rounded-xl border-none"
              />
            </div>

            {/* Repetição (Select Editável) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-purple-500" />
                <span className="text-slate-700 font-bold">Repetição</span>
              </div>
              <div className="relative">
                <select 
                  value={repetition}
                  onChange={(e) => setRepetition(e.target.value)}
                  className="appearance-none bg-slate-50 text-slate-500 font-bold text-xs pr-8 pl-3 py-2 rounded-xl border-none focus:ring-1 ring-purple-300 outline-none"
                >
                  {REPETITION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <button 
          disabled={!title}
          onClick={() => onSave({ 
            title, 
            time, 
            category: 'Outros', 
            owner: 'filho', 
            childId,
            date, 
            id: Math.random().toString(36).substr(2, 9),
            description: `Repetição: ${repetition}` 
          })}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-lg shadow-purple-100 mt-10 active:scale-95 transition-all disabled:opacity-30"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
};
