import React, { useState } from 'react';
import { Routine } from '../types';
import { getRoutineIcon } from '../constants/Icons';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface RoutineCardProps {
  routine: Routine;
  onClick: (id: string) => void;
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onClick, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <div 
        onClick={() => onClick(routine.id)}
        className="bg-white rounded-[2rem] flex overflow-hidden border border-slate-50 shadow-sm active:scale-[0.98] transition-all group h-28 cursor-pointer"
      >
        <div className="w-[32%] bg-[#F5E6D3] flex items-center justify-center relative overflow-hidden shrink-0">
          {routine.image ? (
            <img 
              src={routine.image} 
              className="w-full h-full object-cover"
              alt={routine.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-400">
              {getRoutineIcon(routine.icon, "w-8 h-8")}
            </div>
          )}
        </div>
        
        <div className="flex-1 px-5 flex flex-col justify-center text-left min-w-0">
          <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight truncate">{routine.name}</h3>
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tight truncate">{routine.subtitle}</p>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-4 text-slate-300 hover:text-slate-600 transition-colors shrink-0"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setShowMenu(false)} />
          <div className="absolute right-2 top-12 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-[70] min-w-[120px] animate-in zoom-in-95 duration-200">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(routine); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
            >
              <Pencil className="w-3.5 h-3.5" /> Editar Nome
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(routine.id); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
};