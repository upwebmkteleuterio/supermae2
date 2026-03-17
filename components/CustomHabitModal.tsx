"use client";

import React, { useState } from 'react';
import { X, Tag, Plus, Check } from 'lucide-react';

interface CustomHabitModalProps {
  onClose: () => void;
  onSave: (habit: { title: string; category: string }) => void;
  existingCategories: string[];
}

export const CustomHabitModal: React.FC<CustomHabitModalProps> = ({ onClose, onSave, existingCategories }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(existingCategories[0] || 'Geral');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    const finalCategory = isNewCategory ? newCatName : category;
    onSave({ title: name, category: finalCategory });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Criar minha tarefa</h3>
          <button onClick={onClose} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome da Tarefa</label>
            <input 
              type="text" 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Minha meditação" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-bold text-slate-700 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Categoria</label>
            {!isNewCategory ? (
              <div className="space-y-3">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600 outline-none"
                >
                  {existingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => setIsNewCategory(true)} className="text-[10px] font-black text-purple-600 uppercase flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Criar nova categoria
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    value={newCatName} 
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nome da categoria..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600 pr-10"
                  />
                  <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                </div>
                <button onClick={() => setIsNewCategory(false)} className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                  <X className="w-3 h-3" /> Usar existente
                </button>
              </div>
            )}
          </div>

          <button 
            disabled={!name.trim() || (isNewCategory && !newCatName.trim())}
            onClick={handleSave}
            className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            <Check className="w-4 h-4" /> Salvar Tarefa
          </button>
        </div>
      </div>
    </div>
  );
};