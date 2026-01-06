
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface MoodDataItem {
  id: string;
  label: string;
  color: string;
  count: number;
  percent: number;
}

interface MoodSummaryProps {
  data: MoodDataItem[];
  targetName: string;
}

export const MoodSummary: React.FC<MoodSummaryProps> = ({ data, targetName }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 mb-8">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        <h3 className="font-bold text-slate-800">Resumo de humor {targetName}</h3>
      </div>
      <div className="flex flex-col items-center">
        {data.length > 0 ? (
          <>
            <div className="relative w-48 h-48 mb-10">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Círculo de fundo (Track) */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                />
                {/* Segmentos de dados */}
                {data.reduce((acc, item) => {
                  const start = acc.offset;
                  const dashOffset = -start;
                  acc.offset += item.percent;
                  acc.elements.push(
                    <circle
                      key={item.id}
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="12"
                      strokeDasharray={`${item.percent} 100`}
                      strokeDashoffset={dashOffset}
                      pathLength="100"
                      className="transition-all duration-1000"
                    />
                  );
                  return acc;
                }, { offset: 0, elements: [] as any[] }).elements}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-700">{data[0].percent}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data[0].label}</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-3">
              {data.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-500 truncate">{item.label} ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 text-center flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 mb-4">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
            </svg>
            <p className="text-slate-300 text-sm font-medium italic">Nenhum registro emocional neste mês.</p>
          </div>
        )}
      </div>
    </div>
  );
};
