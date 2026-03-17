
import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { SENTIMENTS_CHILD } from '../constants';
import { MoodCircle } from '../components/MoodCircle';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Edit2, Smile, Info, Baby } from 'lucide-react';

export const ChildMoodDiary: React.FC = () => {
  const { state, navigate, setSelectedDate, goBack } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);

  const selectedChild = state.children.find(c => c.id === state.selectedChildId);

  if (!selectedChild) {
    return (
      <div className="p-20 text-center">
        <p>Selecione um filho primeiro.</p>
        <button onClick={() => navigate('child_mood_children_selection')} className="mt-4 text-purple-600 underline">Voltar</button>
      </div>
    );
  }

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
    const sentimentsIds = (state.childMoodHistory[selectedChild.id] || {})[dateStr] || [];
    return sentimentsIds.map(id => SENTIMENTS_CHILD.find(s => s.id === id)?.color).filter(Boolean) as string[];
  };

  const handleDayClick = (date: Date) => {
    const dateStr = date.toLocaleDateString('sv-SE');
    const history = state.childMoodHistory[selectedChild.id] || {};
    if (history[dateStr]) {
      setSelectedDayDetail(dateStr);
    } else {
      setSelectedDate(dateStr);
      navigate('child_mood_selection');
    }
  };

  const handleRegisterToday = () => {
    const today = new Date().toLocaleDateString('sv-SE');
    setSelectedDate(today);
    navigate('child_mood_selection');
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('child_mood_children_selection')} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Diário do {selectedChild.name.split(' ')[0]}</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 pb-32">
        {/* Identificação do Filho */}
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-[2rem] border border-slate-50 shadow-sm">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-inner">
            <img src={selectedChild.avatar} alt={selectedChild.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Acompanhamento Diário</h2>
            <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest">{selectedChild.age}</p>
          </div>
        </div>

        {/* Texto Explicativo */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
             <Baby className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="text-slate-700 font-bold text-sm mb-1">Registro de evolução</h4>
            <p className="text-slate-400 text-[10px] font-medium leading-relaxed">
              Mantenha o histórico emocional do seu filho para identificar padrões e compartilhar com terapeutas se necessário.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-700 capitalize">{monthName} {year}</h2>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 bg-slate-50 rounded-full text-slate-400 active:scale-90"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={handleNextMonth} className="p-2 bg-slate-50 rounded-full text-slate-400 active:scale-90"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-6 text-center">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(d => (
              <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>
            ))}
            
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            
            {daysInMonth.map((date, i) => {
              const dateStr = date.toLocaleDateString('sv-SE');
              const moodColors = getMoodColors(dateStr);
              const isToday = dateStr === new Date().toLocaleDateString('sv-SE');

              return (
                <button 
                  key={i} 
                  onClick={() => handleDayClick(date)}
                  className="flex flex-col items-center gap-1 group relative"
                >
                  <MoodCircle 
                    colors={moodColors} 
                    dayNum={date.getDate()} 
                    isToday={isToday} 
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-12 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Legenda:</h4>
            <div className="grid grid-cols-3 gap-y-3">
              {SENTIMENTS_CHILD.map(s => (
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
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <Baby className="w-6 h-6" />
            </div>
            <span className="text-slate-700 font-bold text-sm">Como seu filho está se sentindo?</span>
          </div>
          <ChevronRight className="w-6 h-6 text-purple-300" />
        </button>
      </div>

      {selectedDayDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Humor do Filho</h3>
              <button onClick={() => setSelectedDayDetail(null)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="text-center mb-8">
              <span className="text-purple-600 font-bold text-lg">
                {new Date(selectedDayDetail + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              </span>
            </div>

            <div className="flex justify-center gap-4 mb-10">
              {(state.childMoodHistory[selectedChild.id]?.[selectedDayDetail] || []).map(id => {
                const sentiment = SENTIMENTS_CHILD.find(s => s.id === id);
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
                onClick={() => { setSelectedDate(selectedDayDetail); navigate('child_mood_selection'); }}
                className="w-full bg-indigo-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
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
