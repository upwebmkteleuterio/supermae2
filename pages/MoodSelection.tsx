
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS } from '../constants';
import { CalendarHeader } from '../components/CalendarHeader';
import { Check, AlertCircle } from 'lucide-react';

export const MoodSelection: React.FC = () => {
  const { state, goBack, navigate, setSelectedDate } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>(state.moodHistory[state.selectedDate] || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIds(state.moodHistory[state.selectedDate] || []);
  }, [state.selectedDate]);

  const toggleSentiment = (id: string) => {
    setError(null);
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 3) {
        setError("Você pode escolher no máximo 3 sentimentos.");
        return;
      }
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleContinue = () => {
    if (selectedIds.length === 0) {
      setError("Por favor, selecione ao menos um sentimento.");
      return;
    }
    navigate('mood_result');
  };

  return (
    <Layout title="Registro de humor" showBack themeColor="bg-[#F9F7FC]" headerTransparent={false}>
      <div className="px-6 pt-4 pb-4">
        <CalendarHeader />
      </div>

      <div className="text-center mb-8 px-6">
        <p className="text-slate-600 text-sm font-medium">Como você está se sentindo hoje?</p>
        <p className="text-[10px] font-black uppercase tracking-widest mt-1 animate-pulse-hint">
          Escolha até 3 sentimentos
        </p>
      </div>

      {error && (
        <div className="px-6 mb-6">
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold">{error}</span>
          </div>
        </div>
      )}

      <main className="px-6 pb-48">
        <div className="grid grid-cols-3 gap-3">
          {SENTIMENTS.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <button 
                key={s.id}
                onClick={() => toggleSentiment(s.id)}
                className={`bg-white rounded-[1.8rem] p-3 flex flex-col items-center justify-center shadow-sm border-2 transition-all active:scale-95 h-36 relative ${
                  isSelected ? 'border-purple-500 ring-4 ring-purple-100' : 'border-transparent'
                }`}
              >
                <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                  <img alt={s.label} className="w-full h-full object-cover" src={s.img} />
                </div>
                <span className={`text-[10px] font-black text-center leading-tight uppercase tracking-tight ${isSelected ? 'text-purple-600' : 'text-slate-600'}`}>
                  {s.label}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Botão Fixo Bottom - Ajustado para bottom-28 para ficar acima da nav bar */}
      <div className="fixed bottom-28 left-0 right-0 p-6 pointer-events-none z-30">
        <button 
          onClick={handleContinue}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-200 pointer-events-auto active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          Continuar
        </button>
      </div>

      <style>{`
        @keyframes pulse-hint {
          0%, 100% { color: #94a3b8; }
          50% { color: #A855F7; }
        }
        .animate-pulse-hint {
          animation: pulse-hint 2s infinite ease-in-out;
        }
      `}</style>

      <script dangerouslySetInnerHTML={{ __html: `window.tempSelectedSentiments = ${JSON.stringify(selectedIds)};` }} />
    </Layout>
  );
};
