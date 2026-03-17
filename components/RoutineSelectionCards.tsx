"use client";

import React from 'react';
import { useApp } from '../store/AppContext';
import { ROUTINE_TEMPLATES } from '../constants/routines';
import { Heart, Zap, Sparkles, ChevronRight, Clock } from 'lucide-react';

export const RoutineSelectionCards: React.FC = () => {
  const { state, applyRoutineTemplate } = useApp();
  const { moodHistory, selectedDate } = state;

  // Busca o humor do dia atual para decidir a recomendação
  const todayMood = moodHistory[selectedDate] || [];
  
  // Lógica de Inteligência:
  // Se marcou emoções 'difíceis' (ex: cansada, triste, sobrecarregada - IDs fictícios baseados no seu sistema)
  // Como não tenho os IDs exatos aqui, vou usar uma lógica genérica: 
  // Se houver qualquer humor registrado, tentamos categorizar.
  
  const hasMood = todayMood.length > 0;
  
  // Mapeamento simples para exemplo (ajustar conforme seus IDs de sentimentos reais)
  const isDifficultMood = todayMood.some(id => ['cansada', 'triste', 'ansiosa', 'sobrecarregada'].includes(id.toLowerCase()));
  const isPositiveMood = todayMood.some(id => ['feliz', 'animada', 'calma', 'disposta'].includes(id.toLowerCase()));

  const handleApply = async (id: string) => {
    await applyRoutineTemplate(id);
  };

  return (
    <div className="space-y-4 mb-10">
      <div className="flex items-center justify-between px-2 mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rotinas prontas para hoje</h3>
        <Sparkles className="w-4 h-4 text-purple-300" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Card Abraço de Mãe */}
        <button 
          onClick={() => handleApply('acolhedora')}
          className={`relative overflow-hidden p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 text-left group ${
            ROUTINE_TEMPLATES.acolhedora.color
          } ${isDifficultMood ? 'ring-4 ring-purple-400/20 shadow-lg' : 'opacity-90'}`}
        >
          {isDifficultMood && (
            <div className="absolute top-4 right-6 bg-purple-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm animate-pulse">
              Para seu acolhimento
            </div>
          )}
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                <Heart className="w-6 h-6 text-purple-600" />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-lg leading-tight">{ROUTINE_TEMPLATES.acolhedora.name}</h4>
                  <div className="flex items-center gap-1 text-[9px] font-bold opacity-60">
                    <Clock className="w-3 h-3" /> {ROUTINE_TEMPLATES.acolhedora.duration}
                  </div>
                </div>
                <p className="text-xs opacity-70 font-medium">{ROUTINE_TEMPLATES.acolhedora.description}</p>
             </div>
             <ChevronRight className="w-5 h-5 opacity-30 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card Super Mãe em Movimento */}
        <button 
          onClick={() => handleApply('energetica')}
          className={`relative overflow-hidden p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 text-left group ${
            ROUTINE_TEMPLATES.energetica.color
          } ${isPositiveMood ? 'ring-4 ring-orange-400/20 shadow-lg' : 'opacity-90'}`}
        >
          {isPositiveMood && (
            <div className="absolute top-4 right-6 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm animate-pulse">
              Aproveite sua energia
            </div>
          )}
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                <Zap className="w-6 h-6 text-orange-600" />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-lg leading-tight">{ROUTINE_TEMPLATES.energetica.name}</h4>
                  <div className="flex items-center gap-1 text-[9px] font-bold opacity-60">
                    <Clock className="w-3 h-3" /> {ROUTINE_TEMPLATES.energetica.duration}
                  </div>
                </div>
                <p className="text-xs opacity-70 font-medium">{ROUTINE_TEMPLATES.energetica.description}</p>
             </div>
             <ChevronRight className="w-5 h-5 opacity-30 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
      
      {!hasMood && (
        <p className="text-[10px] text-center text-slate-400 font-medium italic">
          Faça seu check-in emocional para receber uma recomendação personalizada.
        </p>
      )}
    </div>
  );
};