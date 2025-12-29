
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { CalendarHeader } from '../components/CalendarHeader';
import { SOSButton } from '../components/SOSButton';
import { HeartCheckbox } from '../components/HeartCheckbox';
import { Plus, ArrowLeft, MoreVertical, Trash2, Pencil, LayoutGrid } from 'lucide-react';
import { Activity } from '../types';

export const RoutineDetail: React.FC = () => {
  const { state, goBack, navigate, toggleHabitCompletion, deleteHabitFromRoutine } = useApp();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const routine = state.routines.find(r => r.id === state.selectedRoutineId);

  if (!routine) return <div className="p-10 text-center">Rotina não encontrada.</div>;

  const periods = ['A qualquer momento', 'Manhã', 'Tarde', 'Noite'];
  
  // Lógica de progresso baseada na data selecionada
  const dateCompletions = state.habitCompletions[state.selectedDate] || [];
  const completedCount = routine.habits.filter(h => dateCompletions.includes(h.id)).length;
  const totalCount = routine.habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isHabitCompleted = (id: string) => dateCompletions.includes(id);

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      {/* Header */}
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{routine.name}</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 pb-32">
        {/* Nova Barra de Progresso Ponta a Ponta */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 mb-10 flex flex-col items-center">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 text-center w-full">Progresso do dia</h3>
          
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative mb-4 shadow-inner">
            <div 
              className="absolute inset-y-0 left-0 bg-purple-600 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-xl font-black text-slate-800">{progressPercent}%</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{completedCount}/{totalCount} tarefas</span>
          </div>
        </div>

        <CalendarHeader />

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Hábitos desta rotina</h3>
          <button 
            onClick={() => navigate('habit_selection')}
            className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Lista Dividida por Períodos */}
        <div className="space-y-8">
          {periods.map(period => {
            const habits = routine.habits.filter(h => h.period === period);
            if (habits.length === 0 && period !== 'A qualquer momento') return null;

            return (
              <div key={period} className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-300" /> {period}
                </h4>
                
                {habits.length === 0 ? (
                  <div className="ml-4 py-8 border border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                    <LayoutGrid className="w-8 h-8 opacity-20 mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Nenhum hábito aqui</p>
                  </div>
                ) : (
                  habits.map(habit => {
                    const completed = isHabitCompleted(habit.id);
                    return (
                      <div key={habit.id} className="relative group">
                        <div className={`bg-white px-5 py-4 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center gap-4 transition-all ${completed ? 'opacity-50 grayscale-[0.3]' : ''}`}>
                          <div className="shrink-0 scale-75 -ml-2">
                            <HeartCheckbox 
                              checked={completed} 
                              onChange={() => toggleHabitCompletion(routine.id, habit.id, state.selectedDate)} 
                            />
                          </div>
                          
                          <div className="flex-1 cursor-pointer" onClick={() => toggleHabitCompletion(routine.id, habit.id, state.selectedDate)}>
                             <h5 className={`font-bold text-slate-700 text-sm ${completed ? 'line-through text-slate-400' : ''}`}>
                               {habit.title}
                             </h5>
                          </div>

                          <button 
                            onClick={() => setActiveMenu(activeMenu === habit.id ? null : habit.id)}
                            className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {activeMenu === habit.id && (
                          <>
                            <div className="fixed inset-0 z-[55]" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-[60] min-w-[110px] animate-in zoom-in-95 duration-200">
                              <button 
                                onClick={() => { setActiveMenu(null); }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Pencil className="w-3.5 h-3.5" /> Editar
                              </button>
                              <button 
                                onClick={() => { deleteHabitFromRoutine(routine.id, habit.id); setActiveMenu(null); }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
