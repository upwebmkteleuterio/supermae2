
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface WeeklyData {
  scores: number[];
  percents: {
    good: number;
    neutral: number;
    difficult: number;
  };
}

interface WeeklyWellbeingProps {
  data: WeeklyData;
  targetName: string;
}

export const WeeklyWellbeing: React.FC<WeeklyWellbeingProps> = ({ data, targetName }) => {
  const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <div className="bg-[#FFF8F8] rounded-[2.5rem] p-8 border border-pink-50 shadow-sm mb-8">
      <h3 className="font-bold text-slate-800 text-base mb-8">Bem-estar semanal {targetName}</h3>
      
      <div className="flex items-center gap-8 mb-12">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#FDEFEF" strokeWidth="12" />
            <circle 
              cx="50" cy="50" r="42" fill="none" stroke="#F2A4A4" strokeWidth="12" 
              strokeDasharray={`${data.percents.good} 100`}
              pathLength="100"
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-xl font-black text-slate-700">{data.percents.good}%</span>
          </div>
        </div>
        <div className="space-y-3 flex-1">
           <SummaryLine color="#F2A4A4" label="dias bons" percent={data.percents.good} />
           <SummaryLine color="#FDEFEF" label="dias neutros" percent={data.percents.neutral} />
           <SummaryLine color="#D6CCE6" label="dias difíceis" percent={data.percents.difficult} />
        </div>
      </div>

      <h3 className="font-bold text-slate-800 text-base mb-6 flex items-center gap-2">
        Check-in emocional
        <TrendingUp className="w-4 h-4 text-purple-400" />
      </h3>

      <div className="w-full h-40 relative mt-4">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
           <line x1="0" y1="10" x2="100" y2="10" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="2 2" />
           <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="2 2" />
           <line x1="0" y1="40" x2="100" y2="40" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="2 2" />
           <path 
              d={generatePath(data.scores)}
              fill="none"
              stroke="#D6CCE6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
           />
           {data.scores.map((score, i) => score > 0 && (
             <circle 
               key={i} 
               cx={(i / 6) * 100} 
               cy={40 - ((score - 1) * 15)} 
               r="1.5" 
               fill="#A855F7" 
             />
           ))}
        </svg>
        <div className="flex justify-between mt-4 px-1">
           {labels.map(d => (
             <span key={d} className="text-[9px] font-bold text-slate-400">{d}</span>
           ))}
        </div>
      </div>
    </div>
  );
};

const SummaryLine: React.FC<{ color: string, label: string, percent: number }> = ({ color, label, percent }) => (
  <div className="flex items-center gap-3">
    <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: color }} />
    <span className="text-sm font-bold text-slate-700">{percent}%</span>
    <span className="text-sm font-medium text-slate-400">{label}</span>
  </div>
);

function generatePath(scores: number[]): string {
  const points = scores.map((s, i) => {
    if (s === 0) return null;
    return { x: (i / 6) * 100, y: 40 - ((s - 1) * 15) };
  }).filter(p => p !== null) as {x: number, y: number}[];
  
  if (points.length < 2) return "";
  
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i+1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    path += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}
