import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { CalendarHeader } from '../components/CalendarHeader';
import { SOSButton } from '../components/SOSButton';
import { HeartCheckbox } from '../components/HeartCheckbox';
import { ConfirmModal } from '../components/ConfirmModal';
import { Plus, ArrowLeft, MoreVertical, Trash2, Pencil, LayoutGrid, X, Bell, Clock, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Activity } from '../types';

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const REPETITION_OPTIONS = ["Todos os dias", "Segunda a sexta", "Sábado e Domingo", "Personalizar"];

const CATEGORY_COLORS: Record<string, string> = {
  "Saúde emocional": "bg-pink-50/50 border-pink-100",
  "Corpo e bem-estar físico": "bg-green-50/50 border-green-100",
  "Relações e rede de apoio": "bg-indigo-50/50 border-indigo-100",
  "Organização e vida prática": "bg-amber-50/50 border-amber-100",
  "Criatividade e leveza": "bg-yellow-50/50 border-yellow-100",
  "Espiritualidade e auto conexão": "bg-blue-50/50 border-blue-100",
  "Propósito e realização pessoal": "bg-purple-50/50 border-purple-100",
  "Tempo para si": "bg-rose-50/50 border-rose-100"
};

export const RoutineDetail: React.FC = () => {
  const { state, goBack, navigate, toggleHabitCompletion, deleteHabitFromRoutine, updateHabitInRoutine } = useApp();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [editingHabit, setEditingHabit] = useState<Activity | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Activity | null>(null);

  const [tempPeriod, setTempPeriod] = useState<any>('A qualquer momento');
  const [tempReminder, setTempReminder] = useState(false);
  const [tempRepetition, setTempRepetition] = useState("Todos os dias");
  const [tempCustomDays, setTempCustomDays] = useState<number[]>([]);

  const routine = state.routines.find(r => r.id === state.selectedRoutineId);

  if (!routine) return <div className="p-10 text-center">Rotina não encontrada.</div>;

  const periods = ['A qualquer momento', 'Manhã', 'Tarde', 'Noite'];
  
  const dateCompletions = state.habitCompletions[state.selectedDate] || [];
  const completedCount = routine.habits.filter(h => dateCompletions.includes(h.id)).length;
  const totalCount = routine.habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isHabitCompleted = (id: string) => dateCompletions.includes(id);

  const handleOpenEdit = (habit: Activity) => {
    setEditingHabit(habit);
    setTempPeriod(habit.period || 'A qualquer momento');
    setTempReminder(!!habit.reminder);
    setTempRepetition(habit.repetition || 'Todos os dias');
    setTempCustomDays(habit.customDays || []);
    setActiveMenu(null);
  };

  const handleSaveEdit = () => {
    if (!editingHabit || !state.selectedRoutineId) return;
    
    const updated: Activity = {
      ...editingHabit,
      period: tempPeriod,
      reminder: tempReminder,
      repetition: tempRepetition,
      customDays: tempRepetition === 'Personalizar' ? tempCustomDays : undefined,
      completed: editingHabit.completed
    };

    updateHabitInRoutine(state.selectedRoutineId, updated);
    setEditingHabit(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingHabit && state.selectedRoutineId) {
      deleteHabitFromRoutine(state.selectedRoutineId, deletingHabit.id);
      setDeletingHabit(null);
    }
  };

  const toggleDay = (dayIdx: number) => {
    setTempCustomDays(prev => prev.includes(dayIdx) ? prev.filter(d => d !== dayIdx) : [...prev, dayIdx]);
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
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
                    const categoryColor = habit.category ? CATEGORY_COLORS[habit.category] : 'bg-white border-slate-100';
                    const [bgColor, borderColor] = categoryColor.split(' ');
                    
                    return (
                      <div key={habit.id} className="relative group">
                        <div className={`${bgColor} bg-white px-5 py-4 rounded-[1.8rem] border ${borderColor || 'border-slate-100'} shadow-sm flex items-center gap-4 transition-all ${completed ? 'opacity-50 grayscale-[0.3]' : ''}`}>
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
                             {habit.category && (
                               <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 opacity-60 block mt-1">{habit.category}</span>
                             )}
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
                                onClick={() => handleOpenEdit(habit)}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Pencil className="w-3.5 h-3.5" /> Editar
                              </button>
                              <button 
                                onClick={() => { setDeletingHabit(habit); setActiveMenu(null); }}
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

      {editingHabit && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto no-scrollbar max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Editar Hábito</h3>
              <button onClick={() => setEditingHabit(null)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-6 text-center mb-8 border border-slate-100">
               <span className="text-slate-700 font-bold text-sm leading-tight block">{editingHabit.title}</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 font-bold text-sm">Lembrete</span>
                </div>
                <div 
                  onClick={() => setTempReminder(!tempReminder)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${tempReminder ? 'bg-purple-600' : 'bg-slate-100'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${tempReminder ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 font-bold text-sm">Quando</span>
                </div>
                <div className="relative">
                  <select 
                    value={tempPeriod}
                    onChange={(e: any) => setTempPeriod(e.target.value)}
                    className="appearance-none bg-slate-50 text-slate-500 font-bold text-[11px] pr-12 pl-6 py-3 rounded-2xl border border-slate-100 focus:ring-2 ring-purple-500/20 outline-none cursor-pointer transition-all shadow-sm text-right min-w-[170px]"
                  >
                    <option value="A qualquer momento">A qualquer momento</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">Repetição</span>
                  </div>
                  <div className="relative">
                    <select 
                      value={tempRepetition}
                      onChange={(e) => setTempRepetition(e.target.value)}
                      className="appearance-none bg-slate-50 text-slate-500 font-bold text-[11px] pr-12 pl-6 py-3 rounded-2xl border border-slate-100 focus:ring-2 ring-purple-500/20 outline-none cursor-pointer transition-all shadow-sm text-right min-w-[170px]"
                    >
                      {REPETITION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                  </div>
                </div>

                {tempRepetition === 'Personalizar' && (
                  <div className="flex justify-between gap-1 py-2">
                    {WEEK_DAYS.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleDay(idx)}
                        className={`w-9 h-9 rounded-full text-[10px] font-black border-2 transition-all ${
                          tempCustomDays.includes(idx) 
                          ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                          : 'bg-white border-slate-100 text-slate-300'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleSaveEdit}
              className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-purple-100 mt-12 active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {deletingHabit && (
        <ConfirmModal 
          title="Excluir hábito?"
          message={`Tem certeza que deseja remover "${deletingHabit.title}" desta rotina?`}
          confirmText="Sim, excluir"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingHabit(null)}
        />
      )}
    </Layout>
  );
};