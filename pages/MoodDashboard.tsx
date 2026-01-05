
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS, SENTIMENTS_CHILD } from '../constants';
import { SOSButton } from '../components/SOSButton';
import { ChevronDown, BarChart3, TrendingUp, Calendar, Sparkles } from 'lucide-react';

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const MAPPING = {
  mom: {
    good: ['proud', 'hopeful', 'happy', 'supported', 'euphoric', 'grateful', 'secure', 'calm', 'enthusiastic', 'inspired'],
    neutral: ['confused'],
    difficult: ['lonely', 'anxious', 'exhausted', 'sad', 'guilty', 'irritated', 'angry', 'insecure', 'frustrated']
  },
  child: {
    good: ['c_calm', 'c_stable', 'c_affectionate'],
    neutral: ['c_support'],
    difficult: ['c_agitated', 'c_crisis', 'c_hyperactive', 'c_aggressive', 'c_crying', 'c_exhausted', 'c_anxious', 'c_isolated']
  }
};

export const MoodDashboard: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'mom' | 'child'>('mom');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const [selectedChildId, setSelectedChildId] = useState<string>(() => 
    state.children.length > 0 ? state.children[0].id : ''
  );

  useEffect(() => {
    if (activeTab === 'child' && !selectedChildId && state.children.length > 0) {
      setSelectedChildId(state.children[0].id);
    }
  }, [activeTab, state.children, selectedChildId]);

  const selectedChild = useMemo(() => 
    state.children.find(c => c.id === selectedChildId), 
    [selectedChildId, state.children]
  );

  const history: Record<string, string[]> = useMemo(() => {
    if (activeTab === 'mom') return state.moodHistory;
    return (selectedChildId && state.childMoodHistory[selectedChildId]) || {};
  }, [activeTab, selectedChildId, state.moodHistory, state.childMoodHistory]);

  const currentYear = new Date().getFullYear();

  const donutData = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    Object.entries(history).forEach(([date, ids]) => {
      const d = new Date(date + 'T12:00:00');
      if (d.getMonth() === selectedMonth && d.getFullYear() === currentYear) {
        (ids as string[]).forEach(id => {
          counts[id] = (counts[id] || 0) + 1;
          total++;
        });
      }
    });

    const sentimentsList = activeTab === 'mom' ? SENTIMENTS : SENTIMENTS_CHILD;
    
    return Object.entries(counts)
      .map(([id, count]) => {
        const s = sentimentsList.find(item => item.id === id);
        return {
          id,
          label: s?.label || id,
          color: s?.color || '#ccc',
          count,
          percent: Math.round((count / total) * 100)
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [history, selectedMonth, activeTab, currentYear]);

  const weeklyData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toLocaleDateString('sv-SE');
    });

    let goodCount = 0;
    let neutralCount = 0;
    let diffCount = 0;
    let totalDaysWithRecord = 0;

    const scores = last7Days.map(date => {
      const ids = history[date] || [];
      if (ids.length === 0) return 0;

      totalDaysWithRecord++;
      const mapping = activeTab === 'mom' ? MAPPING.mom : MAPPING.child;
      
      const hasDiff = ids.some(id => mapping.difficult.includes(id));
      const hasGood = ids.some(id => mapping.good.includes(id));

      if (hasDiff) {
        diffCount++;
        return 1;
      }
      if (hasGood) {
        goodCount++;
        return 3;
      }
      neutralCount++;
      return 2;
    });

    return {
      scores,
      totalDays: totalDaysWithRecord,
      percents: {
        good: totalDaysWithRecord ? Math.round((goodCount / totalDaysWithRecord) * 100) : 0,
        neutral: totalDaysWithRecord ? Math.round((neutralCount / totalDaysWithRecord) * 100) : 0,
        difficult: totalDaysWithRecord ? Math.round((diffCount / totalDaysWithRecord) * 100) : 0,
      }
    };
  }, [history, activeTab]);

  const getTargetName = () => {
    if (activeTab === 'mom') return 'Meu';
    return selectedChild ? `de ${selectedChild.name.split(' ')[0]}` : 'do Filho';
  };

  return (
    <Layout title="Dashboard de emoções" showBack themeColor="bg-[#F8F9FE]">
      <div className="px-6 pt-4 pb-32">
        <div className="flex items-center justify-between mb-8">
           <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 shadow-inner">
              <button 
                onClick={() => setActiveTab('mom')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'mom' ? 'bg-[#A855F7] text-white shadow-md' : 'text-slate-400'}`}
              >
                Mãe
              </button>
              <button 
                onClick={() => setActiveTab('child')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'child' ? 'bg-[#A855F7] text-white shadow-md' : 'text-slate-400'}`}
              >
                Filho
              </button>
           </div>
           <div className="relative">
             <select 
               value={selectedMonth}
               onChange={(e) => setSelectedMonth(Number(e.target.value))}
               className="appearance-none bg-white border border-purple-100 rounded-2xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-600 focus:ring-2 ring-purple-500/20 outline-none shadow-sm"
             >
               {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
           </div>
        </div>

        {activeTab === 'child' && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-3">Filho(a) selecionado:</p>
            {state.children.length > 0 ? (
              <div className="-mx-6 px-6 overflow-x-auto no-scrollbar flex gap-3 pb-2">
                {state.children.map(child => (
                  <button 
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all whitespace-nowrap shadow-sm ${
                      selectedChildId === child.id 
                      ? 'bg-purple-50 border-purple-500 text-purple-700' 
                      : 'bg-white border-transparent text-slate-400'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-100 shrink-0">
                      <img src={child.avatar} className="w-full h-full object-cover" alt={child.name} />
                    </div>
                    <span className="text-xs font-bold">{child.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 text-center border border-dashed border-slate-200">
                <p className="text-slate-400 text-xs font-bold">Nenhum filho cadastrado.</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 mb-8">
           <div className="flex items-center gap-3 mb-8">
             <BarChart3 className="w-5 h-5 text-purple-400" />
             <h3 className="font-bold text-slate-800">Resumo de humor {getTargetName()}</h3>
           </div>
           <div className="flex flex-col items-center">
              {donutData.length > 0 ? (
                <>
                  <div className="relative w-48 h-48 mb-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {donutData.reduce((acc, item, i) => {
                        const start = acc.offset;
                        const dashArray = `${item.percent} 100`;
                        const dashOffset = -start;
                        acc.offset += item.percent;
                        acc.elements.push(
                          <circle
                            key={item.id}
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="14"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            strokeLinecap={item.percent > 2 ? "round" : "butt"}
                            className="transition-all duration-1000"
                          />
                        );
                        return acc;
                      }, { offset: 0, elements: [] as any[] }).elements}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-black text-slate-700">{donutData[0].percent}%</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{donutData[0].label}</span>
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-x-4 gap-y-3">
                    {donutData.map(item => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-bold text-slate-500 truncate">{item.label} ({item.percent}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                   <p className="text-slate-300 text-sm font-medium italic">Nenhum registro emocional neste mês.</p>
                </div>
              )}
           </div>
        </div>

        <div className="bg-[#FFF8F8] rounded-[2.5rem] p-8 border border-pink-50 shadow-sm mb-8">
           <h3 className="font-bold text-slate-800 text-base mb-8">Bem-estar semanal {getTargetName()}</h3>
           <div className="flex items-center gap-8 mb-12">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#FDEFEF" strokeWidth="12" />
                  <circle 
                    cx="50" cy="50" r="42" fill="none" stroke="#F2A4A4" strokeWidth="12" 
                    strokeDasharray={`${weeklyData.percents.good * 2.64} 264`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-xl font-black text-slate-700">{weeklyData.percents.good}%</span>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                 <SummaryLine color="#F2A4A4" label="dias bons" percent={weeklyData.percents.good} />
                 <SummaryLine color="#FDEFEF" label="dias neutros" percent={weeklyData.percents.neutral} />
                 <SummaryLine color="#D6CCE6" label="dias difíceis" percent={weeklyData.percents.difficult} />
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
                    d={generatePath(weeklyData.scores)}
                    fill="none"
                    stroke="#D6CCE6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                 />
                 {weeklyData.scores.map((score, i) => score > 0 && (
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
                 {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(d => (
                   <span key={d} className="text-[9px] font-bold text-slate-400">{d}</span>
                 ))}
              </div>
           </div>
        </div>

        {weeklyData.totalDays > 0 ? (
          <div className="bg-purple-600 rounded-[2rem] p-6 text-white text-center shadow-lg shadow-purple-100 flex items-center gap-4">
             <Calendar className="w-10 h-10 opacity-50 shrink-0" />
             <div className="text-left">
               <p className="text-xs font-bold opacity-80 mb-1">Dica da IA:</p>
               <p className="text-sm font-bold leading-tight">
                 {weeklyData.percents.good >= 50 
                   ? `Você teve ${weeklyData.percents.good}% de dias bons! Que tal planejar uma rotina leve para manter esse ritmo?`
                   : `Identificamos alguns dias desafiadores. Lembre-se que o autocuidado não é egoísmo, é necessário para seu equilíbrio.`}
               </p>
             </div>
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-6 text-slate-400 text-center shadow-sm flex items-center gap-4">
             <Sparkles className="w-10 h-10 opacity-30 shrink-0" />
             <div className="text-left">
               <p className="text-xs font-bold opacity-80 mb-1">Dica da IA:</p>
               <p className="text-sm font-bold leading-tight">Registre o humor diariamente para que eu possa te dar dicas personalizadas de bem-estar!</p>
             </div>
          </div>
        )}
      </div>
    </Layout>
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
