
import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RefreshCw, Sparkles, Wind, BookOpen, Users } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const BreathingExercise: React.FC = () => {
  const { toggleBreathing, goBack, addReward, navigate } = useApp();
  const [phase, setPhase] = useState<'Inale' | 'Segure' | 'Exale'>('Inale');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showResources, setShowResources] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && !showResources) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, showResources]);

  useEffect(() => {
    const cycle = seconds % 12;
    if (cycle < 4) setPhase('Inale');
    else if (cycle < 8) setPhase('Segure');
    else setPhase('Exale');
  }, [seconds]);

  const handleFinish = () => {
    addReward('butterfly');
    setShowResources(true);
  };

  const closeExercise = () => {
    toggleBreathing(false);
    goBack();
  };

  if (showResources) {
    return (
      <div className="fixed inset-0 z-[110] bg-[#F8F9FE] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 overflow-y-auto">
        <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" />
        </div>

        <div className="text-center mb-10 max-w-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Respiro concluído!</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Esperamos que você esteja se sentindo mais leve. Recursos que podem te ajudar agora:
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4 mb-12">
          <ResourceItem 
            icon={<Wind className="w-5 h-5 text-blue-400" />} 
            label="Respiração Guiada" 
            onClick={() => { setShowResources(false); setSeconds(0); setIsActive(true); }}
            color="bg-white"
          />
          <ResourceItem 
            icon={<BookOpen className="w-5 h-5 text-emerald-400" />} 
            label="Diário Emocional" 
            onClick={() => { toggleBreathing(false); navigate('mood_selection'); }}
            color="bg-white"
          />
          <ResourceItem 
            icon={<Users className="w-5 h-5 text-purple-400" />} 
            label="Canal de Desabafo" 
            onClick={() => { toggleBreathing(false); navigate('channels_list'); }}
            color="bg-white"
          />
          <ResourceItem 
            icon={<Sparkles className="w-5 h-5 text-amber-400" />} 
            label="Áudio Afetivo por IA" 
            onClick={() => { toggleBreathing(false); navigate('sentiment_analysis'); }}
            color="bg-white"
          />
        </div>

        <button 
          onClick={closeExercise}
          className="w-full max-w-sm bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-200 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          Voltar para o início
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-teal-900 flex flex-col items-center justify-center p-6 text-white text-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-400 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <button 
        onClick={closeExercise}
        className="absolute top-12 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative mb-12">
        {/* Breathing Circle */}
        <div className={`w-48 h-48 rounded-full border-4 border-teal-300 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
          phase === 'Inale' ? 'scale-125 opacity-100' : 
          phase === 'Segure' ? 'scale-125 opacity-80' : 'scale-90 opacity-50'
        }`}>
          <div className="w-32 h-32 bg-teal-300/30 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold tracking-widest uppercase">{phase}</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4">Apenas Respire</h2>
      <p className="text-teal-100 max-w-xs mb-8">
        Siga o ritmo do círculo. Deixe o ar entrar e sair com calma. Você está segura.
      </p>

      <div className="flex gap-4">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="bg-white text-teal-900 px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl active:scale-95 transition-transform"
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isActive ? 'Pausar' : 'Continuar'}
        </button>
        <button 
          onClick={handleFinish}
          className="bg-teal-700 text-white px-8 py-4 rounded-full font-bold shadow-xl active:scale-95 transition-transform"
        >
          Concluir
        </button>
      </div>

      <div className="mt-12 text-teal-300/60 text-sm flex items-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin-slow" />
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')} decorridos
      </div>
    </div>
  );
};

const ResourceItem = ({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick: () => void, color: string }) => (
  <button 
    onClick={onClick}
    className="w-full h-[64px] flex items-center gap-5 px-6 bg-white shadow-sm border border-slate-50 text-slate-700 text-[14px] font-bold rounded-[1.5rem] transition-all active:scale-95 group"
  >
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
      {icon}
    </div>
    <span className="flex-1 text-left">{label}</span>
  </button>
);
