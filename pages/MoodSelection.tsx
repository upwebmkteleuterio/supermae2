
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS } from '../constants';
import { CalendarHeader } from '../components/CalendarHeader';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

export const MoodSelection: React.FC = () => {
  const { state, navigate, setTempMoodSelection, saveMoodRecord } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>(state.moodHistory[state.selectedDate] || []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Verifica se já existe um registro para esta data (modo edição)
  const isEditing = !!state.moodHistory[state.selectedDate];

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

  const handleContinue = async () => {
    if (selectedIds.length === 0) {
      setError("Por favor, selecione ao menos um sentimento.");
      return;
    }

    if (isEditing) {
      setLoading(true);
      // Se for edição, salva e aguarda antes de voltar para o diário
      const success = await saveMoodRecord(state.selectedDate, selectedIds);
      if (success) {
        navigate('mood_diary');
      } else {
        setError("Erro ao atualizar registro. Tente novamente.");
        setLoading(false);
      }
    } else {
      // Se for novo registro, segue para a tela de Aprofundamento (Áudio/Foto)
      setTempMoodSelection(selectedIds);
      navigate('mom_mood_challenge');
    }
  };

  return (
    <Layout title="Registro de humor" showBack themeColor="bg-[#F9F7FC]" headerTransparent={false}>
      <div className="px-6 pt-4 pb-4">
        <CalendarHeader disabled />
      </div>

      <div className="text-center mb-6 px-6">
        <h2 className="text-slate-800 font-bold text-base leading-tight">Escolha até 3 sentimentos</h2>
        <p className="text-[10px] font-black uppercase tracking-widest mt-1 animate-pulse-hint">
          {isEditing ? "Alterando seu registro" : "Como você está hoje?"}
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

      <main className="px-4 pb-48">
        <div className="grid grid-cols-4 gap-3">
          {SENTIMENTS.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <button 
                key={s.id}
                onClick={() => !loading && toggleSentiment(s.id)}
                disabled={loading}
                className={`flex flex-col items-center gap-2 group cursor-pointer outline-none active:scale-95 transition-all ${loading ? 'opacity-50' : ''}`}
              >
                <div className={`w-full aspect-square relative overflow-hidden shadow-sm rounded-[20px] border-2 transition-all ${
                  isSelected ? 'border-purple-500 ring-2 ring-purple-100' : 'border-transparent'
                }`}>
                  <img alt={s.label} className="w-full h-full object-cover" src={s.img} />
                  {isSelected && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                       <div className="bg-purple-600 rounded-full p-1 shadow-md">
                          <Check className="w-3 h-3 text-white" strokeWidth={4} />
                       </div>
                    </div>
                  )}
                </div>
                <span className={`text-[10px] leading-tight text-center font-bold break-words w-full transition-colors ${
                  isSelected ? 'text-purple-600' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-28 left-0 right-0 p-6 pointer-events-none z-30">
        <button 
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-200 pointer-events-auto active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? "Salvar Alterações" : "Continuar")}
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
    </Layout>
  );
};
