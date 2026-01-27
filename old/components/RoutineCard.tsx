
import React from 'react';
import { Routine } from '../types';
import { getRoutineIcon } from '../constants/Icons';

interface RoutineCardProps {
  routine: Routine;
  onClick: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onClick }) => {
  return (
    <div 
      onClick={() => onClick(routine.id)}
      className="bg-white rounded-[2rem] flex overflow-hidden border border-slate-50 shadow-sm active:scale-[0.98] transition-all group h-28 cursor-pointer"
    >
      {/* Área Visual (Imagem ou Ícone) */}
      <div className="w-[32%] bg-[#F5E6D3] flex items-center justify-center relative overflow-hidden shrink-0">
        {routine.image ? (
          <img 
            src={routine.image} 
            className="w-full h-full object-cover"
            alt={routine.name}
            onError={(e) => {
              (e.target as any).style.display = 'none';
              (e.target as any).parentElement.classList.add('bg-slate-50');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-400">
            {getRoutineIcon(routine.icon, "w-8 h-8")}
          </div>
        )}
      </div>
      
      <div className="flex-1 px-5 flex flex-col justify-center text-left">
        <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{routine.name}</h3>
        <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tight">{routine.subtitle}</p>
      </div>
    </div>
  );
};
