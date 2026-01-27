
import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RefreshCw } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const BreathingExercise: React.FC = () => {
  const { toggleBreathing, goBack, addReward } = useApp();
  const [phase, setPhase] = useState<'Inale' | 'Segure' | 'Exale'>('Inale');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const cycle = seconds % 12;
    if (cycle < 4) setPhase('Inale');
    else if (cycle < 8) setPhase('Segure');
    else setPhase('Exale');
  }, [seconds]);

  const handleFinish = () => {
    addReward('butterfly');
    toggleBreathing(false);
    goBack();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-teal-900 flex flex-col items-center justify-center p-6 text-white text-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-400 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <button 
        onClick={() => { toggleBreathing(false); goBack(); }}
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
