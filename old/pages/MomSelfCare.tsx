
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { MOOD_CONFIG, AI_CONFIG } from '../constants';
import { Clock, Sparkles, RefreshCcw, Heart, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { HeartCheckbox } from '../components/HeartCheckbox';

export const MomSelfCare: React.FC = () => {
  const { state, updateMomSelfCare, addReward } = useApp();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<string>("");
  
  const mood = state.selectedMood || 'light';
  const config = MOOD_CONFIG[mood] || MOOD_CONFIG.light;
  const activities = state.momSelfCareAgenda;

  const generate = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // FIX: Agora injetamos o perfil da mãe no prompt para IA personalizar as sugestões
      const activityPrompt = AI_CONFIG.PROMPTS.getContextualPrompt(mood, state.userProfile);
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: activityPrompt,
        config: { systemInstruction: AI_CONFIG.SYSTEM_INSTRUCTION, responseMimeType: "application/json" }
      });
      
      const parsedData = JSON.parse(response.text || "[]");
      updateMomSelfCare(parsedData);
      
      const resQuote = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: AI_CONFIG.PROMPTS.QUOTE,
        config: { systemInstruction: AI_CONFIG.SYSTEM_INSTRUCTION }
      });
      setQuote(resQuote.text || "");
    } catch (e) { 
      console.error(e); 
      updateMomSelfCare([
        { id: '1', title: 'Respiração 4-7-8', description: 'Inale por 4, segure por 7 e exale por 8.', duration: '2 min', completed: false },
        { id: '2', title: 'Chá da Calma', description: 'Prepare um chá e beba sem telas.', duration: '5 min', completed: false }
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { 
    if (activities.length === 0) {
      generate(); 
    }
  }, [mood]);

  const handleToggleActivity = (id: string) => {
    const updated = activities.map(a => a.id === id ? { ...a, completed: !a.completed } : a);
    updateMomSelfCare(updated);
    if (updated.find(a => a.id === id)?.completed) {
      addReward(mood === 'light' ? 'seed' : 'flower');
    }
  };

  return (
    <Layout title="Autocuidado IA" showBack themeColor="bg-purple-50/30">
      <div className="px-6 pt-8 pb-10">
        <div className={`p-7 rounded-[2.5rem] mb-10 ${config.color} shadow-xl backdrop-blur-md relative overflow-hidden border`}>
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/20">{config.rewardIcon}</div>
            <div>
              <h2 className="font-bold text-xl tracking-tight">{config.label}</h2>
              <p className="text-sm opacity-80 font-medium">{mood === 'light' ? 'Foco em pequenos gestos' : 'Foco em fortalecimento'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" /> 
            IA recomenda para {state.userProfile.name.split(' ')[0]}:
          </h3>
          <button 
            onClick={generate} 
            disabled={loading} 
            className="p-2 text-slate-400 hover:text-purple-600 disabled:opacity-30 transition-all active:rotate-180"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="h-24 bg-white/60 animate-pulse rounded-[2.5rem] border border-slate-50 flex items-center px-5 gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : (
            activities.map(a => (
              <div 
                key={a.id} 
                className={`bg-white p-5 rounded-[2.5rem] border transition-all duration-300 flex items-center gap-4 shadow-sm ${
                  a.completed ? 'opacity-80 bg-slate-50 border-purple-100' : 'border-slate-100 hover:border-purple-200'
                }`}
              >
                <div className="shrink-0">
                  <HeartCheckbox 
                    id={`heart-${a.id}`}
                    checked={a.completed} 
                    onChange={() => handleToggleActivity(a.id)} 
                  />
                </div>
                
                <div className="flex-1" onClick={() => handleToggleActivity(a.id)}>
                  <h4 className={`font-bold text-slate-800 transition-all ${a.completed ? 'line-through text-slate-400' : ''}`}>{a.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3"/>{a.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {quote && !loading && (
          <div className="mt-12 bg-gradient-to-br from-white to-purple-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-md text-center italic">
             <Heart className="w-6 h-6 text-pink-400 mx-auto mb-3" />
             <p className="text-sm text-slate-600 leading-relaxed">"{quote}"</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
