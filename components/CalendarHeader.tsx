
import React, { useEffect, useRef, useMemo } from 'react';
import { useApp } from '../store/AppContext';

export const CalendarHeader: React.FC = () => {
  const { state, setSelectedDate } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
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
    const dStr = date.toLocaleDateString('sv-SE'); 
    return { day, weekday, dStr };
  };

  // Função de scroll otimizada para NÃO afetar o scroll vertical da janela
  const scrollToDate = (dateStr: string, behavior: ScrollBehavior = 'smooth') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector(`[data-date="${dateStr}"]`) as HTMLElement;
    if (activeBtn) {
      const targetScroll = activeBtn.offsetLeft + (activeBtn.offsetWidth / 2) - (container.offsetWidth / 2);
      // Usamos scrollTo apenas no container local, evitando window.scroll
      container.scrollTo({
        left: targetScroll,
        behavior
      });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    
    let closestDate = state.selectedDate;
    let minDistance = Infinity;

    const buttons = container.querySelectorAll('[data-date]');
    buttons.forEach((btn) => {
      const htmlBtn = btn as HTMLElement;
      const btnCenter = htmlBtn.offsetLeft + htmlBtn.offsetWidth / 2;
      const distance = Math.abs(containerCenter - btnCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestDate = htmlBtn.getAttribute('data-date') || state.selectedDate;
      }
    });

    if (closestDate !== state.selectedDate) {
      setSelectedDate(closestDate);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToDate(state.selectedDate, 'auto');
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mb-8 h-28 flex items-center overflow-hidden">
      
      {/* Indicador Central Fixo - Sólido e sem bordas brancas */}
      <div className="absolute left-1/2 -translate-x-1/2 w-16 h-20 bg-purple-600 rounded-[2rem] shadow-[0_15px_30px_rgba(147,51,234,0.35)] z-10 pointer-events-none border-none ring-0">
         {/* Espaço limpo e sólido conforme pedido */}
      </div>

      {/* Container de Scroll */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex items-center gap-6 overflow-x-auto px-[calc(50%-32px)] py-4 no-scrollbar snap-x snap-mandatory scroll-smooth w-full relative z-20"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {days.map((date, idx) => {
          const { day, weekday, dStr } = formatDate(date);
          const active = dStr === state.selectedDate;

          return (
            <button
              key={idx}
              data-date={dStr}
              type="button"
              onClick={(e) => {
                e.preventDefault(); // Previne qualquer ação padrão que cause scroll
                setSelectedDate(dStr);
                scrollToDate(dStr, 'smooth');
              }}
              className={`flex flex-col items-center min-w-[64px] py-4 transition-all duration-300 snap-center shrink-0 outline-none select-none ${
                active 
                ? 'text-white z-20 scale-110' 
                : 'text-slate-400 bg-transparent'
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-widest mb-1.5 transition-colors ${active ? 'text-purple-100' : 'text-slate-300'}`}>
                {weekday}
              </span>
              <span className="text-xl font-black">{day}</span>
              
              {date.toDateString() === new Date().toDateString() && (
                <div className={`w-1 h-1 rounded-full mt-1.5 ${active ? 'bg-white' : 'bg-purple-300'}`}></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Sombras laterais para o efeito de desfoque */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8F9FE] to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8F9FE] to-transparent pointer-events-none z-10"></div>
    </div>
  );
};
