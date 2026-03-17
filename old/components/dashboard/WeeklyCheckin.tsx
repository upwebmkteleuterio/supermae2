
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface WeeklyCheckinProps {
  scores: number[];
}

export const WeeklyCheckin: React.FC<WeeklyCheckinProps> = ({ scores }) => {
  const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  // Cores baseadas na legenda do Bem-estar
  const COLORS = {
    good: "#F2A4A4",
    neutral: "#E2E8F0",
    difficult: "#D6CCE6"
  };

  // Mapeia os pontos: Se não houver registro (score 0), o ponto fica na linha de base (y=48)
  const allPoints = scores.map((s, i) => {
    const x = (i / 6) * 100;
    const y = s === 0 ? 48 : 40 - ((s - 1) * 15);
    return { x, y, hasData: s > 0 };
  });

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 mb-8">
      <h3 className="font-bold text-slate-800 text-base mb-6 flex items-center gap-2">
        Check-in emocional da semana
        <TrendingUp className="w-4 h-4 text-purple-400" />
      </h3>

      <div className="w-full mt-4">
        <div className="w-full h-32 relative">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
             <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                </linearGradient>
             </defs>

             {/* Linhas de fundo de referência */}
             <line x1="0" y1="10" x2="100" y2="10" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="2 2" />
             <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="2 2" />
             <line x1="0" y1="40" x2="100" y2="40" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="2 2" />

             {/* Preenchimento de Área (Gradient) */}
             <path 
                d={generateAreaPath(allPoints)}
                fill="url(#areaGradient)"
                className="transition-all duration-1000 ease-in-out"
             />

             {/* Curva Suave (Bézier) */}
             <path 
                d={generateSmoothPath(allPoints)}
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-1000 ease-in-out"
             />

             {/* Pontos com cores baseadas no score real */}
             {scores.map((score, i) => {
               if (score === 0) return null;
               const color = score === 3 ? COLORS.good : score === 2 ? COLORS.neutral : COLORS.difficult;
               return (
                 <g key={i}>
                   <circle 
                     cx={(i / 6) * 100} 
                     cy={40 - ((score - 1) * 15)} 
                     r="3" 
                     fill={color}
                     className="shadow-sm transition-all duration-500"
                   />
                   <circle 
                     cx={(i / 6) * 100} 
                     cy={40 - ((score - 1) * 15)} 
                     r="5" 
                     fill={color}
                     fillOpacity="0.2"
                     className="animate-pulse"
                   />
                 </g>
               );
             })}
          </svg>
        </div>

        {/* Labels dos Dias */}
        <div className="flex justify-between mt-4 px-1">
           {labels.map(d => (
             <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>
           ))}
        </div>

        {/* Legenda de Estados */}
        <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-slate-50">
           <LegendItem color={COLORS.good} label="Bom" />
           <LegendItem color={COLORS.neutral} label="Neutro" />
           <LegendItem color={COLORS.difficult} label="Difícil" />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

/**
 * Gera uma curva suave (Cardinal Spline/Bézier) através de todos os pontos da semana.
 */
function generateSmoothPath(points: {x: number, y: number}[]): string {
  if (points.length < 2) return "";
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    
    // Calcula pontos de controle para suavização
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    
    path += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  
  return path;
}

/**
 * Gera o caminho fechado para o preenchimento de gradiente.
 */
function generateAreaPath(points: {x: number, y: number}[]): string {
  const linePath = generateSmoothPath(points);
  if (!linePath) return "";
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Fecha o polígono descendo até o fundo do SVG (y=50)
  return `${linePath} L ${last.x} 50 L ${first.x} 50 Z`;
}
