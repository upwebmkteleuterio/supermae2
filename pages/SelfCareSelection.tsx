
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { MOOD_CONFIG } from '../constants';
import { MoodType } from '../types';
import { Sparkles, Dices } from 'lucide-react';

export const SelfCareSelection: React.FC = () => {
  const { navigate, setMood, state } = useApp();

  const handleSelectMood = (mood: MoodType) => {
    setMood(mood);
    if (mood === 'breathe') {
      navigate('breathing_exercise');
    } else {
      // FIX: Agora redireciona corretamente para MomSelfCare (IA)
      navigate('mom_self_care');
    }
  };

  return (
    <Layout title="Autocuidado IA" showBack themeColor="bg-purple-50/50">
      <div className="px-6 pb-8">
        <header className="mb-10 mt-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-[2rem] mb-6 text-purple-600 shadow-inner">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Como você quer se cuidar hoje?</h2>
          <p className="text-slate-500 mt-2 px-4 leading-relaxed">Escolha a energia que você tem disponível agora para sua pausa.</p>
        </header>

        <div className="space-y-4">
          {(Object.keys(MOOD_CONFIG) as MoodType[]).map((mood) => {
            const config = MOOD_CONFIG[mood];
            return (
              <button
                key={mood}
                onClick={() => handleSelectMood(mood)}
                className={`w-full p-6 rounded-[2.5rem] border-2 flex flex-col items-start gap-1 transition-all active:scale-[0.97] shadow-sm hover:shadow-md ${config.color} ${state.selectedMood === mood ? 'ring-4 ring-purple-200' : 'border-transparent'}`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shadow-sm">
                    {config.icon}
                  </div>
                  <span className="font-bold text-lg">{config.label}</span>
                </div>
                <p className="opacity-70 text-sm font-medium ml-13 text-left">{config.description}</p>
              </button>
            );
          })}

          <button 
            className="w-full flex items-center justify-center gap-2 py-5 text-purple-600 font-bold hover:bg-purple-100 rounded-full transition-colors mt-6 border-2 border-dashed border-purple-200"
            onClick={() => {
              const moods: MoodType[] = ['light', 'strong', 'breathe'];
              handleSelectMood(moods[Math.floor(Math.random() * moods.length)]);
            }}
          >
            <Dices className="w-5 h-5" />
            Embaralhar Sugestões
          </button>
        </div>
      </div>
    </Layout>
  );
};
