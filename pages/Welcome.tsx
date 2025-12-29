
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';

const ROTATING_WORDS = ['Cuida', 'Ama', 'Protege'];

export const Welcome: React.FC = () => {
  const { navigate, updateUserProfile } = useApp();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    updateUserProfile({ onboardingCompleted: true });
    navigate('home');
  };

  return (
    <div className="bg-white text-gray-900 antialiased font-sans min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Animated Bubbles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] animate-float-slow"></div>
        <div className="absolute top-[35%] -right-32 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px] animate-float-reverse"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-pink-300/10 rounded-full blur-[90px] animate-float-slow"></div>
      </div>

      <main className="flex-grow flex flex-col justify-between items-center w-full max-w-md mx-auto px-6 py-12 relative z-10">
        {/* IllustrationSection */}
        <section className="flex-grow flex items-center justify-center w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative w-full max-w-[320px]">
            {/* Brilho orgânico atrás da imagem */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-100 to-orange-100 rounded-full opacity-40 blur-[60px] scale-110"></div>
            
            <img 
              alt="Mãe atípica e criança" 
              className="w-full h-auto object-contain relative z-10" 
              src="https://saltonaweb.sh27.com.br/maeatipica/imagemboasvindas.png"
            />
          </div>
        </section>

        {/* ContentSection */}
        <section className="w-full flex flex-col items-center text-center space-y-8">
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-both">
            <h2 className="text-gray-400 font-medium tracking-tight text-xl">Bem vinda ao</h2>
            <h1 className="leading-tight font-extrabold text-gray-900 text-5xl tracking-tight">Super Mãe</h1>
            <p className="text-gray-500 text-lg mt-2 font-medium">
              Cuidando de quem{' '}
              <span 
                key={wordIndex} 
                className="text-purple-600 font-black inline-block min-w-[90px] text-left animate-in fade-in slide-in-from-top-1 duration-500"
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            </p>
          </div>

          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500 fill-mode-both pt-4">
            <button 
              onClick={() => navigate('onboarding')}
              className="w-full py-5 px-6 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-full shadow-lg shadow-purple-200 transition-all duration-300 transform active:scale-95"
            >
              Criar uma conta
            </button>
            <button 
              onClick={handleSkip}
              className="w-full py-5 px-6 bg-white border border-gray-100 text-purple-600 hover:bg-gray-50 text-lg font-bold rounded-full shadow-sm transition-all duration-300 transform active:scale-95"
            >
              Já tenho uma conta
            </button>
            
            <button 
              onClick={handleSkip}
              className="mt-6 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] hover:text-purple-400 transition-colors"
            >
              Saltar para home
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
