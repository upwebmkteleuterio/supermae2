
import React from 'react';
import { Routine } from '../types';
import { getRoutineIcon } from '../constants/Icons';

interface RoutineCardProps {
  routine: Routine;
  onClick: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onClick }) => {
  // Cores dinâmicas baseadas no ícone ou nome para dar um visual premium
  const isAbrace = routine.name.includes('Abraço');
  const isMovimento = routine.name.includes('Movimento');
  
  const bgColor = isAbrace ? 'bg-rose-50' : isMovimento ? 'bg-orange-50' : 'bg-purple-50';
  const iconColor = isAbrace ? 'text-rose-500' : isMovimento ? 'text-orange-500' : 'text-purple-500';

  return (
    <div
      onClick={() => onClick(routine.id)}
      className="bg-white rounded-[2.2rem] flex overflow-hidden border border-slate-50 shadow-sm active:scale-[0.98] transition-all group h-28 cursor-pointer"
    >
      {/* Área Visual (Ícone Substituindo Imagem) */}
      <div className={`w-[32%] ${bgColor} flex items-center justify-center relative overflow-hidden shrink-0 transition-colors group-hover:bg-opacity-80`}>
        <div className={`${iconColor} transition-transform group-hover:scale-110 duration-500`}>
          {getRoutineIcon(routine.icon || 'Sparkles', "w-10 h-10 stroke-[1.5]")}
        </div>
        
        {/* Glow sutil no fundo */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white blur-2xl rounded-full"></div>
        </div>
      </div>
      
      <div className="flex-1 px-6 flex flex-col justify-center text-left">
        <h3 className="font-bold text-slate-800 text-[15px] mb-1 leading-tight group-hover:text-purple-700 transition-colors">
          {routine.name}
        </h3>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
          {routine.subtitle}
        </p>
      </div>
    </div>
  );
};
