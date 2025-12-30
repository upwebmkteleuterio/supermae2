
import React from 'react';
import { useApp } from '../store/AppContext';
import { SENTIMENTS } from '../constants';
import { ChevronRight } from 'lucide-react';

export const WeeklyCalendar: React.FC = () => {
  const { state, setSelectedDate, navigate } = useApp();
  
  const getWeekDays = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Dom) a 6 (Sab)
    
    // Ajuste para Segunda como primeiro dia (1)
    // Se hoje for Domingo (0), retrocede 6 dias para pegar a segunda
    // Caso contrário, retrocede (currentDay - 1) dias.
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    
    const days = [];
    const labels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toLocaleDateString('sv-SE');
      days.push({
        date: dStr,
        dayNum: d.getDate(),
        label: labels[i],
        isToday: dStr === now.toLocaleDateString('sv-SE')
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getMoodColors = (dateStr: string) => {
    const sentimentsIds = state.moodHistory[dateStr] || [];
    return sentimentsIds.map(id => SENTIMENTS.find(s => s.id === id)?.color).filter(Boolean) as string[];
  };

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 relative">
      <div className="grid grid-cols-7 gap-y-6">
        {weekDays.map((day, i) => {
          const isSelected = state.selectedDate === day.date;
          const moodColors = getMoodColors(day.date);
          
          return (
            <button 
              key={i} 
              onClick={() => setSelectedDate(day.date)}
              className="flex flex-col items-center gap-2 group outline-none"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${
                day.isToday ? 'bg-purple-50 ring-2 ring-purple-100' : ''
              } ${isSelected ? 'scale-110' : ''}`}>
                
                {/* Mood Rings - Exatamente como no Diário Emocional */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
                     {moodColors.length > 0 ? (
                       moodColors.map((color, idx) => (
                         <circle
                           key={idx}
                           cx="16" cy="16" r="14"
                           fill="none"
                           stroke={color}
                           strokeWidth="3"
                           strokeDasharray={`${(1 / moodColors.length) * 88} 88`}
                           strokeDashoffset={-((idx / moodColors.length) * 88)}
                           className="transition-all duration-500"
                         />
                       ))
                     ) : (
                       <circle
                         cx="16" cy="16" r="14"
                         fill="none"
                         stroke="#F1F5F9"
                         strokeWidth="2"
                       />
                     )}
                   </svg>
                </div>

                <div className={`w-1.5 h-1.5 rounded-full z-10 transition-colors ${
                   day.isToday ? 'bg-purple-500' : 
                   day.label === 'D' ? 'bg-orange-200' : 
                   'bg-slate-200'
                 } ${moodColors.length > 0 ? 'opacity-0' : 'opacity-100'}`}></div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className={`text-[9px] font-black transition-colors ${isSelected ? 'text-purple-500' : 'text-slate-300'}`}>
                  {day.label}
                </span>
                <span className={`text-[10px] font-black transition-colors ${isSelected ? 'text-purple-600' : 'text-slate-600'}`}>
                  {day.dayNum}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      <button 
        onClick={() => navigate('mood_diary')}
        className="w-full flex flex-col items-center justify-center mt-4 gap-1 active:opacity-60 transition-opacity"
      >
         <span className="text-[10px] font-bold text-purple-400">Ver diário emocional</span>
         <ChevronRight className="w-4 h-4 text-purple-400 rotate-90" />
      </button>
    </div>
  );
};
