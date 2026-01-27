import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Layout } from '../components/Layout';
import { ArrowLeft } from 'lucide-react';

const SUGGESTIONS = [
  "Conciliar terapias e trabalho",
  "Sentir que não consigo dar conta de tudo",
  "Comportamento difícil do meu filho(a)",
  "Me senti julgada ou incompreendida",
  "Me senti muito sozinha hoje",
  "Cansaço extremo, físico ou emocional",
  "Medo do futuro ou da evolução do meu filho(a)",
  "Me faltou tempo para cuidar de mim",
  "Insegurança sobre estar fazendo o melhor"
];

export const ChildMoodChallenge: React.FC = () => {
  const { state, navigate, goBack, setTempMoodNote } = useApp();
  const [note, setNote] = useState('');

  const handleContinue = () => {
    setTempMoodNote(note);
    navigate('child_mood_result');
  };

  const handleSelectSuggestion = (s: string) => {
    setNote(s);
  };

  const formattedDate = new Date(state.selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  return (
    <Layout title="Registro de humor" showBack themeColor="bg-[#F8F9FE]" headerTransparent={false}>
      <div className="px-6 pt-4 pb-32">
        <div className="text-center mb-6">
          <span className="text-purple-500 font-bold text-sm tracking-wide">
            {formattedDate}
          </span>
        </div>

        <div className="bg-[#F3F4F6] rounded-2xl py-4 px-6 w-full text-center shadow-sm mb-6 border border-slate-100">
          <p className="text-slate-800 font-bold text-lg leading-tight">
            Qual foi o maior desafio do seu dia como mãe atípica?
          </p>
        </div>

        <div className="mb-8">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Descreva o que está sentindo...."
            className="w-full h-40 bg-white border border-purple-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none shadow-sm font-medium text-slate-700 resize-none text-sm placeholder:text-slate-300"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-slate-700 font-bold text-sm mb-4">Se preferir, escolha uma sugestão nossa</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSelectSuggestion(s)}
                className={`bg-white rounded-2xl p-4 flex items-center justify-center text-center shadow-sm transition-all border-2 aspect-square ${
                  note === s ? 'border-purple-500 ring-2 ring-purple-50 shadow-md' : 'border-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold leading-tight text-slate-600">
                  {s}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botão Fixo Bottom */}
      <div className="fixed bottom-28 left-0 right-0 p-6 pointer-events-none z-30">
        <button 
          onClick={handleContinue}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-200 pointer-events-auto active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          Continuar
        </button>
      </div>
    </Layout>
  );
};