"use client";

import React from 'react';
import { useApp } from '../store/AppContext';
import { ROUTINE_TEMPLATES } from '../constants/routines';
import { Heart, Zap, ChevronRight, Clock } from 'lucide-react';

export const RoutineSelectionCards: React.FC = () => {
  const { state, applyRoutineTemplate, navigate } = useApp();
  const { moodHistory, selectedDate } = state;

  const todayMood = moodHistory[selectedDate] || [];
  const isDifficultMood = todayMood.some(id => ['cansada', 'triste', 'ansiosa', 'sobrecarregada', 'exhausted', 'sad', 'anxious'].includes(id.toLowerCase()));
  const isPositiveMood = todayMood.some(id => ['feliz', 'animada', 'calma', 'disposta', 'happy', 'proud', 'grateful'].includes(id.toLowerCase()));

  const handleApply = async (id: string) => {
    await applyRoutineTemplate(id);
    navigate('mom_agenda');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2 mb-1">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-purple-400">Sugestões baseadas no seu humor</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Card Abraço de Mãe */}
        <button 
          onClick={() => handleApply('acolhedora')}
          className={`relative overflow-hidden p-5 rounded-2xl border-2 transition-all active:scale-[0.98] text-left group bg-white ${
            isDifficultMood ? 'border-purple-400 shadow-md ring-4 ring-purple-50' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shadow-inner">
                <Heart className="w-6 h-6 text-purple-500" />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-slate-800 text-sm">{ROUTINE_TEMPLATES.acolhedora.name}</h4>
                  <div className="flex items-center gap-1 text-[8px] font-black text-purple-400 bg-purple-50 px-1.5 py-0.5 rounded-full">
                    <Clock size={10} /> {ROUTINE_TEMPLATES.acolhedora.duration}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{ROUTINE_TEMPLATES.acolhedora.description}</p>
             </div>
             <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={18} />
          </div>
        </button>

        {/* Card Super Mãe em Movimento */}
        <button 
          onClick={() => handleApply('energetica')}
          className={`relative overflow-hidden p-5 rounded-2xl border-2 transition-all active:scale-[0.98] text-left group bg-white ${
            isPositiveMood ? 'border-orange-300 shadow-md ring-4 ring-orange-50' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shadow-inner">
                <Zap className="w-6 h-6 text-orange-500" />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-slate-800 text-sm">{ROUTINE_TEMPLATES.energetica.name}</h4>
                  <div className="flex items-center gap-1 text-[8px] font-black text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded-full">
                    <Clock size={10} /> {ROUTINE_TEMPLATES.energetica.duration}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{ROUTINE_TEMPLATES.energetica.description}</p>
             </div>
             <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={18} />
          </div>
        </button>
      </div>
    </div>
  );
};