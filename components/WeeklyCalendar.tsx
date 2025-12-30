
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { SENTIMENTS } from '../constants';
import { ChevronRight, X, Edit2 } from 'lucide-react';
import { MoodCircle } from './MoodCircle';

export const WeeklyCalendar: React.FC = () => {
  const { state, setSelectedDate, navigate } = useApp();
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);
  
  const getWeekDays = () => {
    const now = new Date();
    const currentDay = now.getDay();
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

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    if (state.moodHistory[dateStr]) {
      setSelectedDayDetail(dateStr);
    } else {
      navigate('mood_selection');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 relative">
      <div className="grid grid-cols-7 gap-y-4">
        {weekDays.map((day, i) => {
          const isSelected = state.selectedDate === day.date;
          const moodColors = getMoodColors(day.date);
          
          return (
            <button 
              key={i} 
              onClick={() => handleDayClick(day.date)}
              className="flex flex-col items-center gap-2 group outline-none"
            >
              <MoodCircle 
                colors={moodColors} 
                dayNum={day.dayNum} 
                isToday={day.isToday} 
                isSelected={isSelected}
              />
              
              <span className={`text-[9px] font-black transition-colors ${isSelected ? 'text-purple-500' : 'text-slate-300'}`}>
                {day.label}
              </span>
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

      {/* Modal Detalhes do Dia (Igual ao do Diário Emocional) */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Registro de humor</h3>
              <button onClick={() => setSelectedDayDetail(null)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="text-center mb-8">
              <span className="text-purple-600 font-bold text-lg">
                {new Date(selectedDayDetail + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              </span>
            </div>

            <div className="flex justify-center gap-4 mb-10">
              {state.moodHistory[selectedDayDetail].map(id => {
                const sentiment = SENTIMENTS.find(s => s.id === id);
                return (
                  <div key={id} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-50 shadow-sm">
                      <img src={sentiment?.img} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{sentiment?.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => { setSelectedDate(selectedDayDetail); navigate('mood_selection'); }}
                className="w-full bg-purple-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Edit2 className="w-4 h-4" /> Alterar Registro
              </button>
              <button 
                onClick={() => setSelectedDayDetail(null)}
                className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
