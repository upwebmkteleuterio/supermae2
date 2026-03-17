
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS, SENTIMENTS_CHILD } from '../constants';
import { ChevronDown } from 'lucide-react';
import { MonthlyWellbeing } from '../components/dashboard/MonthlyWellbeing';
import { MoodSummary } from '../components/dashboard/MoodSummary';
import { WeeklyCheckin } from '../components/dashboard/WeeklyCheckin';
import { AIDashTip } from '../components/dashboard/AIDashTip';

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
  const { state, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'mom' | 'child'>('mom');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const currentYear = new Date().getFullYear();
  
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

  // CÁLCULO MENSAL (PARA O TOP CARD)
  const monthlyStats = useMemo(() => {
    let good = 0, neutral = 0, diff = 0, total = 0;
    const mapping = activeTab === 'mom' ? MAPPING.mom : MAPPING.child;

    Object.entries(history).forEach(([date, ids]) => {
      const d = new Date(date + 'T12:00:00');
      if (d.getMonth() === selectedMonth && d.getFullYear() === currentYear) {
        total++;
        if (ids.some(id => mapping.difficult.includes(id))) diff++;
        else if (ids.some(id => mapping.good.includes(id))) good++;
        else neutral++;
      }
    });

    return {
      percents: {
        good: total ? Math.round((good / total) * 100) : 0,
        neutral: total ? Math.round((neutral / total) * 100) : 0,
        difficult: total ? Math.round((diff / total) * 100) : 0,
      },
      hasData: total > 0
    };
  }, [history, selectedMonth, activeTab, currentYear]);

  // CÁLCULO SEMANAL (PARA O DONUT E LINE CHART)
  const weeklyData = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toLocaleDateString('sv-SE');
    });

    const mapping = activeTab === 'mom' ? MAPPING.mom : MAPPING.child;
    const weeklyCounts: Record<string, number> = {};
    let weeklyTotalSentiments = 0;

    const scores = weekDays.map(date => {
      const ids = history[date] || [];
      if (ids.length === 0) return 0;

      ids.forEach(id => {
        weeklyCounts[id] = (weeklyCounts[id] || 0) + 1;
        weeklyTotalSentiments++;
      });

      if (ids.some(id => mapping.difficult.includes(id))) return 1;
      if (ids.some(id => mapping.good.includes(id))) return 3;
      return 2;
    });

    const sentimentsList = activeTab === 'mom' ? SENTIMENTS : SENTIMENTS_CHILD;
    const donutData = Object.entries(weeklyCounts)
      .map(([id, count]) => {
        const s = sentimentsList.find(item => item.id === id);
        return {
          id,
          label: s?.label || id,
          color: s?.color || '#ccc',
          count,
          percent: Math.round((count / weeklyTotalSentiments) * 100)
        };
      })
      .sort((a, b) => b.count - a.count);

    return { scores, donutData };
  }, [history, activeTab]);

  const getTargetName = () => {
    if (activeTab === 'mom') return 'Meu';
    return selectedChild ? `${selectedChild.name.split(' ')[0]}` : 'do Filho';
  };

  return (
    <Layout 
      title="Dashboard de emoções" 
      showBack 
      onBack={() => navigate('mood_diary_selection')}
      themeColor="bg-[#F8F9FE]"
    >
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

        {/* 1. Bem-estar Mensal no Topo */}
        <MonthlyWellbeing data={monthlyStats} targetName={activeTab === 'mom' ? 'Meu' : selectedChild?.name.split(' ')[0] || 'do Filho'} />

        {/* 2. Resumo do humor essa semana */}
        <MoodSummary data={weeklyData.donutData} targetName={activeTab === 'mom' ? 'Meu' : selectedChild?.name.split(' ')[0] || 'do Filho'} />

        {/* 3. Check-in emocional da semana */}
        <WeeklyCheckin scores={weeklyData.scores} />

        <AIDashTip hasData={monthlyStats.hasData} percentGood={monthlyStats.percents.good} />
      </div>
    </Layout>
  );
};
