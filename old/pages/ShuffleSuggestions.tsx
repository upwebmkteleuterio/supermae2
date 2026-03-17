
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { GoogleGenAI } from "@google/genai";
import { SENTIMENTS, MOOD_CONFIG } from '../constants';
import { Heart, X, RefreshCw, Sparkles, Wind, CheckCircle2, Loader2 } from 'lucide-react';

interface Suggestion {
  title: string;
  description: string;
  duration: string;
}

export const ShuffleSuggestions: React.FC = () => {
  const { state, goBack, updateMomSelfCare, addReward } = useApp();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [flowerOpen, setFlowerOpen] = useState(false);
  
  // Audio ref para o som de vento (placeholder visual por enquanto)
  const soundRef = useRef<boolean>(false);

  const getTodayMoods = () => {
    const today = new Date().toLocaleDateString('sv-SE');
    const moodIds = state.moodHistory[today] || [];
    return moodIds.map(id => SENTIMENTS.find(s => s.id === id)?.label).join(', ');
  };

  const shuffle = async () => {
    setLoading(true);
    setFlowerOpen(false);
    setSuggestion(null);
    
    // Simula som de vento e delay visual
    setTimeout(async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const moods = getTodayMoods();
        
        const prompt = `Gere UMA única sugestão de autocuidado muito curta e afetiva para uma mãe.
        Contexto emocional de hoje: ${moods || 'Cansaço comum de mãe'}.
        Perfil: Mãe atípica buscando acolhimento.
        
        REQUISITOS:
        - Frase realista (ex: "Beba um café quente sem telas", "Respire fundo 3 vezes").
        - Duração de 1 a 5 minutos.
        - Retorne APENAS um JSON: {"title": "Título Curto", "description": "Frase de incentivo curta", "duration": "X min"}`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || "{}");
        setSuggestion(data);
        setFlowerOpen(true);
      } catch (e) {
        setSuggestion({
          title: "Pausa para Respirar",
          description: "Feche os olhos por um minuto e sinta apenas o seu coração.",
          duration: "1 min"
        });
        setFlowerOpen(true);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  useEffect(() => {
    shuffle();
  }, []);

  const handleAccept = () => {
    if (suggestion) {
      const newActivity = {
        id: Math.random().toString(36).substr(2, 9),
        title: suggestion.title,
        description: suggestion.description,
        duration: suggestion.duration,
        completed: false
      };
      updateMomSelfCare([...state.momSelfCareAgenda, newActivity]);
      addReward('seed');
      goBack();
    }
  };

  return (
    <Layout headerTransparent themeColor="bg-slate-900">
      <div className="fixed inset-0 z-0 opacity-20">
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <button 
          onClick={goBack}
          className="absolute top-12 right-6 p-2 bg-white/10 rounded-full text-white active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>

        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
           <h2 className="text-2xl font-black text-white mb-2">Momento Respiro</h2>
           <p className="text-purple-200 text-sm font-medium">Sintonizando algo especial para você...</p>
        </header>

        {/* Visual da Flor do Cuidado */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
           {/* Pétalas de fundo (Animação) */}
           {[...Array(6)].map((_, i) => (
             <div 
               key={i}
               className={`absolute w-32 h-32 bg-gradient-to-br from-purple-400/40 to-indigo-500/40 rounded-full blur-md transition-all duration-1000 ease-out ${
                 flowerOpen ? 'opacity-100 scale-150' : 'opacity-0 scale-50'
               }`}
               style={{ 
                 transform: flowerOpen 
                   ? `rotate(${i * 60}deg) translateY(-40px) scale(1.2)` 
                   : 'rotate(0deg) translateY(0px) scale(0.5)',
                 transitionDelay: `${i * 100}ms`
               }}
             />
           ))}

           {/* Core da Flor */}
           <div className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${
             loading ? 'bg-white/10 scale-90 animate-pulse' : 'bg-white scale-100'
           }`}>
             {loading ? (
                <Wind className="w-10 h-10 text-purple-300 animate-spin-slow" />
             ) : (
                <Sparkles className="w-12 h-12 text-purple-600" />
             )}
           </div>
        </div>

        {/* Card de Sugestão */}
        <div className={`w-full max-w-sm transition-all duration-700 transform ${
          flowerOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
        }`}>
          {suggestion && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl text-center border-t-4 border-purple-500">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-4 block">Sugestão da Mentora</span>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{suggestion.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium italic">"{suggestion.description}"</p>
              
              <div className="flex items-center justify-center gap-2 mb-8">
                 <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold">Duração: {suggestion.duration}</div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleAccept}
                  className="w-full bg-[#A855F7] text-white py-4 rounded-full font-bold shadow-lg shadow-purple-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Quero tentar isso!
                </button>
                <button 
                  onClick={shuffle}
                  disabled={loading}
                  className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:opacity-60"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Não hoje, me mostre outra
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </Layout>
  );
};