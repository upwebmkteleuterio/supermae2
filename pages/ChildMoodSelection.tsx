
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS_CHILD } from '../constants';
import { CalendarHeader } from '../components/CalendarHeader';
import { Check, AlertCircle } from 'lucide-react';

export const ChildMoodSelection: React.FC = () => {
  const { state, navigate, setTempMoodSelection, saveChildMoodRecord } = useApp();
  
  const selectedChild = state.children.find(c => c.id === state.selectedChildId);
  const initialSelection = selectedChild ? (state.childMoodHistory[selectedChild.id]?.[state.selectedDate] || []) : [];
  
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelection);
  const [error, setError] = useState<string | null>(null);

  const isEditing = initialSelection.length > 0;

  useEffect(() => {
    if (selectedChild) {
      setSelectedIds(state.childMoodHistory[selectedChild.id]?.[state.selectedDate] || []);
    }
  }, [state.selectedDate, selectedChild]);

  if (!selectedChild) return null;

  const toggleSentiment = (id: string) => {
    setError(null);
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 3) {
        setError("Escolha até 3 sentimentos para facilitar o acompanhamento.");
        return;
      }
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleContinue = () => {
    if (selectedIds.length === 0) {
      setError("Selecione ao menos um sentimento do seu filho.");
      return;
    }

    if (isEditing) {
      saveChildMoodRecord(selectedChild.id, state.selectedDate, selectedIds);
      navigate('child_mood_diary');
    } else {
      setTempMoodSelection(selectedIds);
      navigate('child_mood_result');
    }
  };

  const formattedDate = new Date(state.selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  return (
    <Layout title="Humor do Filho" showBack themeColor="bg-[#FAF5FF]" headerTransparent={false}>
      <div className="px-6 pt-4 pb-2 text-center">
         <h1 className="text-purple-600 text-lg font-bold tracking-wide mb-4">{formattedDate}</h1>
         
         <div className="bg-[#F3F4F6] rounded-full py-4 px-6 w-full text-center shadow-sm mb-4">
            <p className="text-slate-800 font-bold text-lg leading-tight">
                Como seu filho está se sentindo hoje?
            </p>
         </div>
         
         <p className="text-slate-400 text-sm font-medium mb-6">
            Escolha um ou mais sentimentos
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

      <main className="px-5 pb-48">
        <div className="grid grid-cols-3 gap-3">
          {SENTIMENTS_CHILD.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <button 
                key={s.id}
                onClick={() => toggleSentiment(s.id)}
                className={`bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm transition-all duration-200 aspect-[4/5] border-2 ${
                  isSelected ? 'border-purple-500 ring-2 ring-purple-100 shadow-md scale-[1.02]' : 'border-transparent'
                }`}
              >
                <div className="w-[60px] h-[60px] mb-2 relative">
                  <img alt={s.label} className="w-full h-full object-contain rounded-full" src={s.img} />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full p-0.5 border-2 border-white">
                      <Check className="w-3 h-3 text-white" strokeWidth={4} />
                    </div>
                  )}
                </div>
                <span className={`font-bold text-[13px] leading-tight text-center transition-colors ${
                  isSelected ? 'text-purple-700' : 'text-slate-800'
                }`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Botão Fixo Bottom */}
      <div className="fixed bottom-28 left-0 right-0 p-6 pointer-events-none z-30">
        <button 
          onClick={handleContinue}
          className="w-full bg-[#7C3AED] hover:bg-purple-700 text-white py-5 rounded-full font-bold shadow-xl shadow-purple-100 pointer-events-auto active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          {isEditing ? "Salvar Registro" : "Continuar"}
        </button>
      </div>
    </Layout>
  );
};
