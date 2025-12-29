
import React, { useEffect, useRef, useMemo } from 'react';
import { useApp } from '../store/AppContext';

export const CalendarHeader: React.FC = () => {
  const { state, setSelectedDate } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  const days = useMemo(() => {
    const arr = [];
    // Hoje baseado no fuso horário do sistema
    const today = new Date();
    // Range generoso para permitir navegação
    for (let i = -15; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    return { day, weekday };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    const dStr = date.toLocaleDateString('sv-SE'); // Formato YYYY-MM-DD local
    return dStr === state.selectedDate;
  };

  // Centralização forçada
  useEffect(() => {
    const centerDay = () => {
      if (activeBtnRef.current) {
        activeBtnRef.current.scrollIntoView({
          behavior: 'auto', // Primeira vez sem animação para ser instantâneo
          block: 'nearest',
          inline: 'center'
        });
      }
    };
    
    // Pequeno timeout para garantir que o DOM renderizou o scroll
    const timer = setTimeout(centerDay, 50);
    return () => clearTimeout(timer);
  }, [state.selectedDate]);

  return (
    <div className="relative mb-6">
      {/* Container de Scroll com Snap e largura controlada para mostrar aprox 5 dias */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto px-[15%] py-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {days.map((date, idx) => {
          const { day, weekday } = formatDate(date);
          const active = isSelected(date);
          const dStr = date.toLocaleDateString('sv-SE');

          return (
            <button
              key={idx}
              ref={active ? activeBtnRef : null}
              onClick={() => setSelectedDate(dStr)}
              className={`flex flex-col items-center min-w-[62px] py-4 rounded-3xl transition-all snap-center shrink-0 ${
                active 
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-100 scale-110 z-10' 
                : 'text-slate-400 bg-white border border-slate-50 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${active ? 'text-purple-100' : 'text-slate-300'}`}>
                {weekday}
              </span>
              <span className="text-xl font-black">{day}</span>
              {isToday(date) && !active && (
                <div className="w-1.5 h-1.5 bg-purple-300 rounded-full mt-1.5 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Gradientes laterais para foco no centro */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FDFCFE] to-transparent pointer-events-none z-20"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FDFCFE] to-transparent pointer-events-none z-20"></div>
    </div>
  );
};
