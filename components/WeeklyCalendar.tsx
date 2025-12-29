
import React from 'react';
import { useApp } from '../store/AppContext';
import { ChevronRight } from 'lucide-react';

export const WeeklyCalendar: React.FC = () => {
  const { state, setSelectedDate } = useApp();
  
  const getWeekDays = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - currentDay);
    
    const days = [];
    const labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push({
        date: d.toISOString().split('T')[0],
        dayNum: d.getDate(),
        label: labels[i],
        isToday: d.toDateString() === now.toDateString()
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 relative">
      <div className="grid grid-cols-7 gap-y-6">
        {weekDays.map((day, i) => {
          const isSelected = state.selectedDate === day.date;
          return (
            <button 
              key={i} 
              onClick={() => setSelectedDate(day.date)}
              className="flex flex-col items-center gap-2 group outline-none"
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? 'border-purple-300' : 'border-slate-100 group-active:border-purple-200'
              }`}>
                 <div className={`w-5 h-5 rounded-full transition-colors ${
                   day.isToday ? 'bg-purple-100' : 
                   day.label === 'S' && i === 1 ? 'bg-orange-50' : 
                   day.label === 'T' && i === 2 ? 'bg-teal-50' : 
                   'bg-slate-50'
                 } ${isSelected ? 'scale-110' : ''}`}></div>
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-[10px] font-bold transition-colors ${isSelected ? 'text-purple-500' : 'text-slate-400'}`}>
                  {day.label}
                </span>
                <span className={`text-[11px] font-bold transition-colors ${isSelected ? 'text-purple-600' : 'text-slate-700'}`}>
                  {day.dayNum}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <button className="w-full flex flex-col items-center justify-center mt-4 gap-1 active:opacity-60 transition-opacity">
         <span className="text-[10px] font-bold text-purple-400">Ver mais informações</span>
         <ChevronRight className="w-4 h-4 text-purple-400 rotate-90" />
      </button>
    </div>
  );
};
