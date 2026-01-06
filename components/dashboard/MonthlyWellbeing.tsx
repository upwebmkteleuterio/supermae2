
import React from 'react';

interface MonthlyData {
  percents: {
    good: number;
    neutral: number;
    difficult: number;
  };
}

interface MonthlyWellbeingProps {
  data: MonthlyData;
  targetName: string;
}

export const MonthlyWellbeing: React.FC<MonthlyWellbeingProps> = ({ data, targetName }) => {
  return (
    <div className="bg-[#FFF8F8] rounded-[2.5rem] p-8 border border-pink-50 shadow-sm mb-8">
      <h3 className="font-bold text-slate-800 text-base mb-1">Bem-estar Mensal: {targetName}</h3>
      <p className="text-slate-400 text-[10px] font-medium mb-8">Você teve um total esse mês de:</p>
      
      <div className="flex items-center gap-8">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="12" />
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
           <SummaryLine color="#E2E8F0" label="dias neutros" percent={data.percents.neutral} />
           <SummaryLine color="#D6CCE6" label="dias difíceis" percent={data.percents.difficult} />
        </div>
      </div>
    </div>
  );
};

const SummaryLine: React.FC<{ color: string, label: string, percent: number }> = ({ color, label, percent }) => (
  <div className="flex items-center gap-3">
    <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
    <span className="text-xs font-bold text-slate-700">{percent}%</span>
    <span className="text-xs font-medium text-slate-400">{label}</span>
  </div>
);
