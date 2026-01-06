
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Routine } from '../types';
import { ICON_GALLERY } from '../constants/Icons';

interface CreateRoutineModalProps {
  onClose: () => void;
  onSave: (routine: Routine) => void;
}

export const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({ onClose, onSave }) => {
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedIconId, setSelectedIconId] = useState('Sparkles');

  const handleCreateRoutine = () => {
    if (!newRoutineName.trim()) return;
    
    const routine: Routine = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRoutineName,
      subtitle: 'Minha rotina personalizada',
      image: '',
      icon: selectedIconId,
      habits: []
    };
    
    onSave(routine);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Cadastre uma nova Rotina</h3>
          <button onClick={onClose} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
        </div>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Uma rotina é uma lista de hábitos. Antes de escolher sua lista de hábitos, dê um nome para essa rotina.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome da Rotina</label>
            <input 
              type="text" 
              autoFocus
              value={newRoutineName}
              onChange={(e) => setNewRoutineName(e.target.value)}
              placeholder="Ex: Rotina Matinal" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500 outline-none shadow-sm font-bold text-slate-700 placeholder:text-slate-300 text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Escolha um Ícone</label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_GALLERY.map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedIconId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIconId(item.id)}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                      isSelected 
                      ? 'bg-purple-600 text-white shadow-lg scale-110' 
                      : 'bg-slate-50 text-slate-400 hover:bg-purple-50'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              disabled={!newRoutineName.trim()}
              onClick={handleCreateRoutine}
              className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            >
              Confirmar
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
