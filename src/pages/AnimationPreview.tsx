"use client";

import React, { useState } from 'react';

export const AnimationPreview: React.FC = () => {
  // O estado controla em qual das 4 etapas estamos:
  // 0: Invisível (Aguardando)
  // 1: Pequena (Botão fechado)
  // 2: Fica maior (Começa a soltar)
  // 3: Desabrocha (Abre redondinha com topo e base preenchidos)
  const [stage, setStage] = useState(0);
  const [theme, setTheme] = useState('purple'); // Novo controle do tema (purple ou red)

  const handleNextStage = () => {
    setStage(prev => (prev < 3 ? prev + 1 : 0));
  };

  const btnLabels: Record<number, string> = {
    0: "Concluir Ação 1 (Surge pequena)",
    1: "Concluir Ação 2 (Fica maior)",
    2: "Concluir Ação 3 (Desabrocha)",
    3: "Reiniciar Animação"
  };

  // --- CONFIGURAÇÃO ATUALIZADA (Mais Redonda) ---
  const config: Record<number, any> = {
    0: { 
      stemH: 0, flowY: 60, flowS: 0, leafS: 0,
      pTop: "rotate(0deg) scale(0)",
      pBotL: "rotate(0deg) scale(0)", pBotR: "rotate(0deg) scale(0)",
      pBL: "rotate(0deg) scale(0)", pBR: "rotate(0deg) scale(0)",
      pML: "rotate(0deg) scale(0)", pMR: "rotate(0deg) scale(0)",
      pFL: "rotate(0deg) scale(0)", pFR: "rotate(0deg) scale(0)",
      pCL: "rotate(0deg) scale(0)", pCR: "rotate(0deg) scale(0)",
      sepL: "rotate(160deg) scale(0)", sepR: "rotate(-160deg) scale(0)",
      swirlS: "rotate(-180deg) scale(0)", swirlO: 0
    },
    1: { 
      stemH: 0.4, flowY: 36, flowS: 0.6, leafS: 0.4,
      pTop: "rotate(0deg) scaleX(0.5) scaleY(0.7)",
      pBotL: "rotate(-5deg) scaleX(0.4) scaleY(0.6)", pBotR: "rotate(5deg) scaleX(0.4) scaleY(0.6)",
      pBL: "rotate(-4deg) scaleX(0.4) scaleY(0.7)", pBR: "rotate(4deg) scaleX(0.4) scaleY(0.7)",
      pML: "rotate(-2deg) scaleX(0.5) scaleY(0.8)", pMR: "rotate(2deg) scaleX(0.5) scaleY(0.8)",
      pFL: "rotate(-1deg) scaleX(0.6) scaleY(0.9)", pFR: "rotate(1deg) scaleX(0.6) scaleY(0.9)",
      pCL: "rotate(0deg) scaleX(0.7) scaleY(1)",   pCR: "rotate(0deg) scaleX(0.7) scaleY(1)",
      sepL: "rotate(80deg) scale(0.9)", sepR: "rotate(-80deg) scale(0.9)",
      swirlS: "rotate(-90deg) scale(0)", swirlO: 0
    },
    2: { 
      stemH: 0.7, flowY: 18, flowS: 0.85, leafS: 0.7,
      pTop: "rotate(0deg) scaleX(0.8) scaleY(0.9)",
      pBotL: "rotate(-60deg) scaleX(0.6) scaleY(0.8)", pBotR: "rotate(60deg) scaleX(0.6) scaleY(0.8)",
      pBL: "rotate(-25deg) scaleX(0.6) scaleY(0.85)", pBR: "rotate(25deg) scaleX(0.6) scaleY(0.85)",
      pML: "rotate(-15deg) scaleX(0.7) scaleY(0.9)",  pMR: "rotate(15deg) scaleX(0.7) scaleY(0.9)",
      pFL: "rotate(-5deg) scaleX(0.8) scaleY(0.95)",  pFR: "rotate(5deg) scaleX(0.8) scaleY(0.95)",
      pCL: "rotate(-2deg) scaleX(0.9) scaleY(1)",     pCR: "rotate(2deg) scaleX(0.9) scaleY(1)",
      sepL: "rotate(30deg) scale(1)", sepR: "rotate(-30deg) scale(1)",
      swirlS: "rotate(-45deg) scale(0.4)", swirlO: 0.5
    },
    3: { 
      stemH: 1, flowY: 0, flowS: 1.1, leafS: 1,
      pTop: "rotate(0deg) scale(1.2)", // Pétala enorme no topo
      pBotL: "rotate(-125deg) scale(1)", pBotR: "rotate(125deg) scale(1)", // Pétalas que fecham a base
      pBL: "rotate(-75deg) scale(1.15)", pBR: "rotate(75deg) scale(1.15)", // As pontas mantidas!
      pML: "rotate(-45deg) scale(1.05)", pMR: "rotate(45deg) scale(1.05)",
      pFL: "rotate(-20deg) scale(0.95)", pFR: "rotate(20deg) scale(0.95)",
      pCL: "rotate(-5deg) scale(0.8)",   pCR: "rotate(5deg) scale(0.8)",
      sepL: "rotate(-15deg) scale(1.1)", sepR: "rotate(15deg) scale(1.1)",
      swirlS: "rotate(0deg) scale(1.1)", swirlO: 1
    }
  };

  const curr = config[stage];
  
  const baseTransition = "transform 1.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.4s ease-in-out";
  const bounceTransition = "transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)";

  const colorOutline = "#ffffff";

  // Variáveis dinâmicas de cor baseadas no tema escolhido
  const isPurple = theme === 'purple';
  const petalFill = isPurple ? "#9B51E0" : "url(#redGradient)";
  const stemLeafColor = isPurple ? "#9B51E0" : "#2E8B57"; // Verde SeaGreen natural
  const bgGlowClass = isPurple ? "bg-[#9B51E0]" : "bg-red-500";
  const bgContainerClass = isPurple ? "bg-purple-50/30" : "bg-red-50/30";
  const btnClass = isPurple ? "bg-[#9B51E0] hover:bg-[#8A2BE2] shadow-purple-500/30" : "bg-red-500 hover:bg-red-600 shadow-red-500/30";

  // --- FORMATOS DAS PÉTALAS ---
  const pathRound = "M 100 120 C 35 100, 30 5, 100 0 C 170 5, 165 100, 100 120 Z";
  const pathPointy = "M 100 120 C 40 100, 40 30, 85 15 C 95 12, 100 25, 100 35 C 100 25, 105 12, 115 15 C 160 30, 160 100, 100 120 Z";
  const pathStd = "M 100 120 C 50 105, 50 40, 100 25 C 150 40, 150 105, 100 120 Z";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-4">
      
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative z-10">
        <h2 className="text-gray-500 text-sm font-medium mb-2">Bem vinda ao</h2>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Super Mãe</h1>
        <p className="text-gray-500 mb-6">Cuidando de quem <span className={`font-bold transition-colors ${isPurple ? 'text-[#9B51E0]' : 'text-red-500'}`}>Ama</span></p>

        {/* --- SELETOR DE TEMA --- */}
        <div className="flex justify-center gap-3 mb-6">
          <button 
            onClick={() => setTheme('purple')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${isPurple ? 'bg-[#9B51E0] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            💜 Lilás
          </button>
          <button 
            onClick={() => setTheme('red')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${!isPurple ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            🌹 Vermelha
          </button>
        </div>

        {/* --- ÁREA DA ANIMAÇÃO --- */}
        <div className={`w-full h-72 ${bgContainerClass} rounded-2xl flex flex-col items-center justify-center mb-6 relative overflow-hidden transition-colors duration-500`}>
           
           <div
             className={`absolute inset-0 ${bgGlowClass} blur-[40px] rounded-full transition-all duration-1000 pointer-events-none`}
             style={{ opacity: stage === 3 ? 0.25 : 0 }}
           ></div>

           <svg viewBox="-50 -40 300 280" className="w-72 h-72 relative z-10 overflow-visible transition-all">
             <defs>
               <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" stopColor="#ff4d4d" />
                 <stop offset="100%" stopColor="#b30000" />
               </linearGradient>
             </defs>

             <path
               d="M 100 130 Q 100 170 90 210"
               stroke={stemLeafColor} strokeWidth="5" strokeLinecap="round" fill="none"
               style={{ transformOrigin: '100px 210px', transform: `scaleY(${curr.stemH})`, transition: bounceTransition }}
             />

             <g style={{ transformOrigin: '100px 160px', transform: `scale(${curr.leafS})`, transition: bounceTransition }}>
               <path d="M 100 160 Q 70 170 50 140 Q 80 130 100 160 Z" fill={stemLeafColor} stroke={colorOutline} strokeWidth="2.5" strokeLinejoin="round" />
               <path d="M 100 160 Q 75 150 55 142" fill="none" stroke={colorOutline} strokeWidth="2" strokeLinecap="round" />
             </g>
             <g style={{ transformOrigin: '100px 140px', transform: `scale(${curr.leafS})`, transition: bounceTransition }}>
               <path d="M 100 140 Q 130 150 150 120 Q 120 110 100 140 Z" fill={stemLeafColor} stroke={colorOutline} strokeWidth="2.5" strokeLinejoin="round" />
               <path d="M 100 140 Q 125 130 145 122" fill="none" stroke={colorOutline} strokeWidth="2" strokeLinecap="round" />
             </g>

             <g style={{ transformOrigin: '100px 120px', transform: `translateY(${curr.flowY}px) scale(${curr.flowS})`, transition: bounceTransition }}>
               <path d="M 100 120 Q 60 120 40 150 Q 70 135 100 120 Z" fill={stemLeafColor} stroke={colorOutline} strokeWidth="2.5" style={{ transform: curr.sepL, transformOrigin: '100px 120px', transition: baseTransition }} />
               <path d="M 100 120 Q 140 120 160 150 Q 130 135 100 120 Z" fill={stemLeafColor} stroke={colorOutline} strokeWidth="2.5" style={{ transform: curr.sepR, transformOrigin: '100px 120px', transition: baseTransition }} />

               <path d="M 85 120 C 85 140, 115 140, 115 120 Z" fill={stemLeafColor} stroke={colorOutline} strokeWidth="2.5" style={{ transition: baseTransition }} />

               <path d={pathRound} fill={petalFill} stroke={colorOutline} strokeWidth="3" style={{ transform: curr.pTop, transformOrigin: '100px 120px', transition: baseTransition }} />
               <path d={pathRound} fill={petalFill} stroke={colorOutline} strokeWidth="3" style={{ transform: curr.pBotL, transformOrigin: '100px 120px', transition: baseTransition }} />
               <path d={pathRound} fill={petalFill} stroke={colorOutline} strokeWidth="3" style={{ transform: curr.pBotR, transformOrigin: '100px 120px', transition: baseTransition }} />

               <path d={pathPointy} fill={petalFill} stroke={colorOutline} strokeWidth="3" style={{ transform: curr.pBL, transformOrigin: '100px 120px', transition: baseTransition }} />
               <path d={pathPointy} fill={petalFill} stroke={colorOutline} strokeWidth="3" style={{ transform: curr.pBR, transformOrigin: '100px 120px', transition: baseTransition }} />

               <path d={pathStd} fill={petalFill} stroke={colorOutline} strokeWidth="2.5" style={{ transform: curr.pML, transformOrigin: '100px 120px', transition: baseTransition }} />
               <path d={pathStd} fill={petalFill} stroke={colorOutline} strokeWidth="2.5" style={{ transform: curr.pMR, transformOrigin: '100px 120px', transition: baseTransition }} />

               <path d={pathStd} fill={petalFill} stroke={colorOutline} strokeWidth="2.5" style={{ transform: curr.pFL, transformOrigin: '100px 120px', transition: baseTransition }} />
               <path d={pathStd} fill={petalFill} stroke={colorOutline} strokeWidth="2.5" style={{ transform: curr.pFR, transformOrigin: '100px 120px', transition: baseTransition }} />

               <path d="M 100 120 C 70 115, 75 60, 100 55 C 125 60, 130 115, 100 120 Z" fill={petalFill} stroke={colorOutline} strokeWidth="2" style={{ transform: curr.pCL, transformOrigin: '100px 120px', transition: baseTransition }} />
               <path d="M 100 120 C 70 115, 75 60, 100 55 C 125 60, 130 115, 100 120 Z" fill={petalFill} stroke={colorOutline} strokeWidth="2" style={{ transform: curr.pCR, transformOrigin: '100px 120px', transition: baseTransition }} />

               <path 
                 d="M 100 70 C 105 70, 110 75, 110 82 C 110 90, 100 95, 90 92 C 80 88, 75 75, 85 65 C 95 55, 115 60, 125 75 C 135 90, 120 110, 100 115 C 75 120, 60 100, 65 80" 
                 fill="none" stroke={colorOutline} strokeWidth="3" strokeLinecap="round" 
                 style={{ transform: curr.swirlS, opacity: curr.swirlO, transformOrigin: '100px 85px', transition: baseTransition }} 
               />
             </g>
           </svg>

        </div>

        <div className="flex justify-center gap-2 mb-6">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-2 rounded-full transition-all duration-500 ${stage >= i ? (isPurple ? 'bg-[#9B51E0]' : 'bg-red-500') + ' w-6' : (isPurple ? 'bg-purple-100' : 'bg-red-100') + ' w-2'}`} />
           ))}
        </div>

        <button 
          onClick={handleNextStage}
          className={`w-full text-white font-bold py-4 px-6 rounded-full transition-all active:scale-95 shadow-lg ${btnClass}`}
        >
          {btnLabels[stage]}
        </button>

      </div>
    </div>
  );
};