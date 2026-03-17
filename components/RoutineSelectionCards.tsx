import React from 'react';
import { useApp } from '../store/AppContext';
import { ROUTINE_TEMPLATES } from '../constants/routines';
import { Heart, Zap, Sparkles, ChevronRight } from 'lucide-react';

export const RoutineSelectionCards: React.FC = () => {
  const { state, applyRoutineTemplate } = useApp();
  const { selectedMood, selectedDate } = state;

  const handleApply = async (id: string) => {
    await applyRoutineTemplate(id);
  };

  // Lógica de recomendação: 'breathe' ou 'light' sugere Abraço de Mãe. 'strong' sugere em Movimento.
  const isAcolhedoraRecommended = selectedMood === 'breathe' || selectedMood === 'light';
  const isEnergeticaRecommended = selectedMood === 'strong';

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
          } ${isAcolhedoraRecommended ? 'ring-4 ring-purple-400/20 shadow-lg' : 'opacity-80'}`}
        >
          {isAcolhedoraRecommended && (
            <div className="absolute top-4 right-6 bg-purple-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              Recomendado
            </div>
          )}
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                <Heart className="w-6 h-6 text-purple-600" />
             </div>
             <div className="flex-1">
                <h4 className="font-black text-lg leading-tight">{ROUTINE_TEMPLATES.acolhedora.name}</h4>
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
          } ${isEnergeticaRecommended ? 'ring-4 ring-orange-400/20 shadow-lg' : 'opacity-80'}`}
        >
          {isEnergeticaRecommended && (
            <div className="absolute top-4 right-6 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              Recomendado
            </div>
          )}
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                <Zap className="w-6 h-6 text-orange-600" />
             </div>
             <div className="flex-1">
                <h4 className="font-black text-lg leading-tight">{ROUTINE_TEMPLATES.energetica.name}</h4>
                <p className="text-xs opacity-70 font-medium">{ROUTINE_TEMPLATES.energetica.description}</p>
             </div>
             <ChevronRight className="w-5 h-5 opacity-30 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};