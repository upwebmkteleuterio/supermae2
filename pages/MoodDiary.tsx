
import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { SENTIMENTS } from '../constants';
// Add missing Smile icon to imports from lucide-react
import { ArrowLeft, ChevronLeft, ChevronRight, X, Edit2, Smile } from 'lucide-react';

export const MoodDiary: React.FC = () => {
  const { state, goBack, navigate, setSelectedDate } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();

  const daysInMonth = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const days = [];
    while (date.getMonth() === currentDate.getMonth()) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getMoodColors = (dateStr: string) => {
    const sentimentsIds = state.moodHistory[dateStr] || [];
    return sentimentsIds.map(id => SENTIMENTS.find(s => s.id === id)?.color).filter(Boolean) as string[];
  };

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (state.moodHistory[dateStr]) {
      setSelectedDayDetail(dateStr);
    } else {
      setSelectedDate(dateStr);
      navigate('mood_selection');
    }
  };

  const handleRegisterToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    navigate('mood_selection');
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Diário de cuidados</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 pb-32">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 mb-8">
          {/* Header Calendário */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-700 capitalize">{monthName} {year}</h2>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 bg-slate-50 rounded-full text-slate-400 active:scale-90"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={handleNextMonth} className="p-2 bg-slate-50 rounded-full text-slate-400 active:scale-90"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Grid de Dias */}
          <div className="grid grid-cols-7 gap-y-6 text-center">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(d => (
              <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>
            ))}
            
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            
            {daysInMonth.map((date, i) => {
              const dateStr = date.toISOString().split('T')[0];
              const moodColors = getMoodColors(dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <button 
                  key={i} 
                  onClick={() => handleDayClick(date)}
                  className="flex flex-col items-center gap-1 group relative"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${isToday ? 'bg-purple-50' : ''}`}>
                    {/* Anéis Coloridos */}
                    {moodColors.length > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
                           {moodColors.map((color, idx) => (
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
                           ))}
                         </svg>
                      </div>
                    )}
                    <span className={`text-[11px] font-bold z-10 ${moodColors.length > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="mt-12 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Legenda:</h4>
            <div className="grid grid-cols-3 gap-y-3">
              {SENTIMENTS.map(s => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px] font-bold text-slate-400 truncate">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleRegisterToday}
          className="w-full bg-white rounded-[1.8rem] p-6 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
              <Smile className="w-6 h-6" />
            </div>
            <span className="text-slate-700 font-bold text-sm">Como você está se sentindo?</span>
          </div>
          <ChevronRight className="w-6 h-6 text-purple-300" />
        </button>
      </div>

      {/* Modal Detalhes do Dia */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Registro de humor</h3>
              <button onClick={() => setSelectedDayDetail(null)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="text-center mb-8">
              <span className="text-purple-600 font-bold text-lg">
                {new Date(selectedDayDetail).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
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
    </Layout>
  );
};
