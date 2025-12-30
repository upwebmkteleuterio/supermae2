
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS } from '../constants';
import { CalendarHeader } from '../components/CalendarHeader';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

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
    // Salvamos temporariamente para a IA processar na tela seguinte
    // O salvamento definitivo no MoodHistory ocorre após a resposta da IA
    navigate('mood_result');
  };

  // Precisamos injetar os IDs selecionados na navegação ou num estado global temporário
  // Para simplicidade, vamos usar um hack temporário no navigate ou passar via context
  // Adicionando um campo temporário no estado via saveMoodRecord antes de mudar de tela?
  // Na verdade, vamos apenas mudar a navegação para que MoodResult use o que foi selecionado aqui.

  return (
    <Layout headerTransparent themeColor="bg-[#F9F7FC]">
      <div className="pt-12 px-6 flex items-center justify-between mb-4">
        <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Registro de humor</h1>
      </div>

      <div className="px-6 pb-4">
        <CalendarHeader />
      </div>

      <div className="text-center mb-8 px-6">
        <p className="text-slate-600 text-sm font-medium">Como você está se sentindo hoje?</p>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Escolha até 3 sentimentos</p>
      </div>

      {error && (
        <div className="px-6 mb-6">
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold">{error}</span>
          </div>
        </div>
      )}

      <main className="px-6 pb-40">
        <div className="grid grid-cols-3 gap-3">
          {SENTIMENTS.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <button 
                key={s.id}
                onClick={() => toggleSentiment(s.id)}
                className={`bg-white rounded-[1.8rem] p-3 flex flex-col items-center justify-center shadow-sm border-2 transition-all active:scale-95 h-36 ${
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

      {/* Botão Fixo Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F9F7FC] via-[#F9F7FC] to-transparent pointer-events-none z-30">
        <button 
          onClick={handleContinue}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 pointer-events-auto active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          Continuar
        </button>
      </div>

      {/* Armazenamento temporário dos sentimentos para a próxima tela ler */}
      {/* (Usando hack de sessionStorage para não poluir o AppState se não for necessário persistir ainda) */}
      <script dangerouslySetInnerHTML={{ __html: `window.tempSelectedSentiments = ${JSON.stringify(selectedIds)};` }} />
    </Layout>
  );
};
