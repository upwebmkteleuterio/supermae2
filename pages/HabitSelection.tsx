
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { Plus, ArrowLeft, ChevronRight, Check, X, Bell, Clock, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Activity } from '../types';

const CATEGORIES = ["Todos", "Saúde Emocional", "Corpo e bem-estar físico", "Esportes"];
const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const REPETITION_OPTIONS = ["Todos os dias", "Segunda a sexta", "Sábado e Domingo", "Personalizar"];

const PRESET_HABITS: Activity[] = [
  // Saúde Emocional
  { id: 'h1', title: 'Fazer check-in emocional no app', description: '', duration: '', completed: false, category: 'Saúde Emocional' },
  { id: 'h2', title: 'Escolher uma frase de acolhimento no dia', description: '', duration: '', completed: false, category: 'Saúde Emocional' },
  { id: 'h3', title: 'Respirar fundo 3 vezes com presença', description: '', duration: '', completed: false, category: 'Saúde Emocional' },
  { id: 'h4', title: 'Registrar uma emoção no diário do app', description: '', duration: '', completed: false, category: 'Saúde Emocional' },
  { id: 'h5', title: 'Nomear o que está sentindo sem tentar resolver', description: '', duration: '', completed: false, category: 'Saúde Emocional' },
  // Corpo
  { id: 'h6', title: 'Beber um copo de água com intenção', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'h7', title: 'Alongar o pescoço e ombros por 2 minutos', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'h8', title: 'Fazer uma caminhada ou atividade física preferida', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'h9', title: 'Dormir 15 minutos mais cedo (ou cochilar)', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'h10', title: 'Comer algo gostoso e nutritivo com calma', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  // Esportes
  { id: 'h11', title: 'Sessão de Yoga Matinal', description: '', duration: '', completed: false, category: 'Esportes' },
  { id: 'h12', title: 'Treino de Fortalecimento', description: '', duration: '', completed: false, category: 'Esportes' },
];

export const HabitSelection: React.FC = () => {
  const { state, goBack, addHabitToRoutine } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showConfigModal, setShowConfigModal] = useState<Activity | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Config do Hábito a ser adicionado
  const [habitPeriod, setHabitPeriod] = useState<'Manhã' | 'Tarde' | 'Noite' | 'A qualquer momento'>('A qualquer momento');
  const [habitReminder, setHabitReminder] = useState(false);
  const [repetition, setRepetition] = useState("Todos os dias");
  const [customDays, setCustomDays] = useState<number[]>([]);

  const [customHabitName, setCustomHabitName] = useState('');
  const [customHabitCat, setCustomHabitCat] = useState(CATEGORIES[1]);

  const filteredHabits = selectedCategory === "Todos" 
    ? PRESET_HABITS 
    : PRESET_HABITS.filter(h => h.category === selectedCategory);

  const handleAddHabit = () => {
    if (!showConfigModal || !state.selectedRoutineId) return;

    const newHabit: Activity = {
      ...showConfigModal,
      id: Math.random().toString(36).substr(2, 9),
      period: habitPeriod,
      repetition: repetition,
      customDays: repetition === 'Personalizar' ? customDays : undefined,
      completed: false
    };

    addHabitToRoutine(state.selectedRoutineId, newHabit);
    setShowConfigModal(null);
    setSuccessMsg(true);
    setRepetition("Todos os dias");
    setCustomDays([]);
    setTimeout(() => setSuccessMsg(false), 2000);
  };

  const handleCreateCustom = () => {
    if (!customHabitName.trim()) return;
    const customHabit: Activity = {
      id: 'custom-' + Math.random(),
      title: customHabitName,
      description: '',
      duration: '',
      completed: false,
      category: customHabitCat
    };
    setCustomHabitName('');
    setShowCustomModal(false);
    setShowConfigModal(customHabit);
  };

  const toggleDay = (dayIdx: number) => {
    setCustomDays(prev => prev.includes(dayIdx) ? prev.filter(d => d !== dayIdx) : [...prev, dayIdx]);
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      {/* Header */}
      <div className="pt-12 px-6 flex items-center justify-between mb-6">
        <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <SOSButton />
      </div>

      <div className="px-6 pb-32">
        {/* Banner Criar Hábito */}
        <button 
          onClick={() => setShowCustomModal(true)}
          className="w-full bg-white rounded-[2rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all mb-8 group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-slate-700 font-bold text-sm">Criar um hábito personalizado</span>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-300" />
        </button>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 -mx-6 px-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? 'bg-purple-600 text-white shadow-md border-transparent' 
                : 'bg-white text-slate-400 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de Hábitos Pre-cadastrados */}
        <div className="space-y-6">
          {CATEGORIES.filter(c => c !== "Todos").map(cat => {
            const habits = filteredHabits.filter(h => h.category === cat);
            if (habits.length === 0) return null;

            return (
              <div key={cat} className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{cat}</h4>
                <div className="space-y-3">
                  {habits.map(h => (
                    <div 
                      key={h.id}
                      className={`flex items-center justify-between p-4 rounded-[1.5rem] transition-all shadow-sm border border-slate-50 ${
                        cat === 'Saúde Emocional' ? 'bg-pink-50/50' : 
                        cat === 'Corpo e bem-estar físico' ? 'bg-green-50/50' : 'bg-blue-50/50'
                      }`}
                    >
                      <span className="text-slate-700 font-bold text-xs flex-1 pr-4">{h.title}</span>
                      <button 
                        onClick={() => setShowConfigModal(h)}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-purple-400 shadow-sm active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mensagem de Sucesso */}
      {successMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl z-[200] flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check className="w-4 h-4" /> <span className="text-xs font-bold">Hábito adicionado à rotina!</span>
        </div>
      )}

      {/* Modal Configuração do Hábito (Redenhado Profissionalmente) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto no-scrollbar max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Configurar Hábito</h3>
              <button onClick={() => setShowConfigModal(null)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-6 text-center mb-8 border border-slate-100">
               <span className="text-slate-700 font-bold text-sm leading-tight block">{showConfigModal.title}</span>
            </div>

            <div className="space-y-6">
              {/* Lembrete Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 font-bold text-sm">Lembrete</span>
                </div>
                <div 
                  onClick={() => setHabitReminder(!habitReminder)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${habitReminder ? 'bg-purple-600' : 'bg-slate-100'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${habitReminder ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>

              {/* Seletor Quando - MODERNO */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 font-bold text-sm">Quando</span>
                </div>
                <div className="relative">
                  <select 
                    value={habitPeriod}
                    onChange={(e: any) => setHabitPeriod(e.target.value)}
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

              {/* Repetição Selecionável */}
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
                      value={repetition}
                      onChange={(e) => setRepetition(e.target.value)}
                      className="appearance-none bg-slate-50 text-slate-500 font-bold text-[11px] pr-12 pl-6 py-3 rounded-2xl border border-slate-100 focus:ring-2 ring-purple-500/20 outline-none cursor-pointer transition-all shadow-sm text-right min-w-[170px]"
                    >
                      {REPETITION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                  </div>
                </div>

                {/* Seletor de Dias Personalizados */}
                {repetition === 'Personalizar' && (
                  <div className="flex justify-between gap-1 animate-in zoom-in-95 duration-200 py-2">
                    {WEEK_DAYS.map((day, idx) => {
                      const selected = customDays.includes(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleDay(idx)}
                          className={`w-9 h-9 rounded-full text-[10px] font-black border-2 transition-all ${
                            selected 
                            ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                            : 'bg-white border-slate-100 text-slate-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleAddHabit}
              className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-purple-100 mt-12 active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
              Adicionar ao dia
            </button>
          </div>
        </div>
      )}

      {/* Modal Criar Hábito Personalizado */}
      {showCustomModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Hábito Personalizado</h3>
              <button onClick={() => setShowCustomModal(false)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Hábito</label>
                <input 
                  type="text" 
                  autoFocus
                  value={customHabitName}
                  onChange={(e) => setCustomHabitName(e.target.value)}
                  placeholder="Ex: Meditação Guiada" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 focus:ring-2 ring-purple-500/20 outline-none shadow-sm font-bold text-slate-700 text-sm placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Categoria</label>
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES.filter(c => c !== "Todos").map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCustomHabitCat(cat)}
                      className={`w-full text-left p-4 rounded-[1.5rem] border transition-all text-xs font-bold ${
                        customHabitCat === cat 
                        ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' 
                        : 'bg-white border-slate-100 text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={!customHabitName.trim()}
                onClick={handleCreateCustom}
                className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 mt-4 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-30"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
