
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  Plus, 
  ChevronRight, 
  ArrowLeft, 
  X, 
  Sun, 
  Moon, 
  Coffee, 
  Heart, 
  Smile, 
  Star, 
  Music, 
  BookOpen, 
  Dumbbell, 
  Zap, 
  Cloud, 
  Sparkles,
  Timer,
  Brush,
  LucideIcon
} from 'lucide-react';
import { Routine } from '../types';

// Galeria de Ícones Disponíveis
const ICON_GALLERY: { id: string; icon: LucideIcon }[] = [
  { id: 'Sun', icon: Sun },
  { id: 'Moon', icon: Moon },
  { id: 'Coffee', icon: Coffee },
  { id: 'Heart', icon: Heart },
  { id: 'Smile', icon: Smile },
  { id: 'Star', icon: Star },
  { id: 'Music', icon: Music },
  { id: 'BookOpen', icon: BookOpen },
  { id: 'Dumbbell', icon: Dumbbell },
  { id: 'Zap', icon: Zap },
  { id: 'Cloud', icon: Cloud },
  { id: 'Sparkles', icon: Sparkles },
  { id: 'Timer', icon: Timer },
  { id: 'Brush', icon: Brush },
];

export const RoutinesList: React.FC = () => {
  const { state, goBack, addRoutine, selectRoutine, navigate } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedIconId, setSelectedIconId] = useState('Sparkles');

  const handleCreateRoutine = () => {
    if (!newRoutineName.trim()) return;
    
    const routine: Routine = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRoutineName,
      subtitle: 'Minha rotina personalizada',
      image: '',
      icon: selectedIconId,
      habits: []
    };
    
    addRoutine(routine);
    setNewRoutineName('');
    setSelectedIconId('Sparkles');
    setShowModal(false);
  };

  const handleOpenRoutine = (id: string) => {
    selectRoutine(id);
    navigate('routine_detail');
  };

  const renderIcon = (iconId: string | undefined, className: string = "w-6 h-6") => {
    const iconObj = ICON_GALLERY.find(i => i.id === iconId) || ICON_GALLERY[ICON_GALLERY.length - 1];
    const IconComponent = iconObj.icon;
    return <IconComponent className={className} />;
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      {/* Header */}
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Agenda de cuidados</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 pb-32">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Sua rotina personalizada</h2>

        {/* Botão Criar Rotina (Seguindo padrão CareAgenda) */}
        <button 
          onClick={() => setShowModal(true)}
          className="w-full bg-white rounded-[1.8rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all mb-10 group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-slate-700 font-bold text-sm">Criar minha rotina</span>
          </div>
          <ChevronRight className="w-6 h-6 text-purple-300" />
        </button>

        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Sua rotina personalizada</h2>
        
        {/* Listagem de Rotinas */}
        <div className="space-y-4">
          {state.routines.map((routine) => (
            <div 
              key={routine.id}
              onClick={() => handleOpenRoutine(routine.id)}
              className="bg-white rounded-[2rem] flex overflow-hidden border border-slate-50 shadow-sm active:scale-[0.98] transition-all group h-28 cursor-pointer"
            >
              {/* Área Visual (Imagem ou Ícone) */}
              <div className="w-[32%] bg-[#F5E6D3] flex items-center justify-center relative overflow-hidden shrink-0">
                {routine.image ? (
                  <img 
                    src={routine.image} 
                    className="w-full h-full object-cover"
                    alt={routine.name}
                    onError={(e) => {
                      // Fallback elegante
                      (e.target as any).style.display = 'none';
                      (e.target as any).parentElement.classList.add('bg-slate-50');
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-400">
                    {renderIcon(routine.icon, "w-8 h-8")}
                  </div>
                )}
              </div>
              
              <div className="flex-1 px-5 flex flex-col justify-center text-left">
                <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{routine.name}</h3>
                <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tight">{routine.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Criar Rotina */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Cadastre uma nova Rotina</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>

            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Uma rotina é uma lista de hábitos, antes de escolher sua lista de hábitos dê um nome para essa rotina.
            </p>

            <div className="space-y-6">
              {/* Input de Nome */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome da Rotina</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  placeholder="Ex: Rotina Matinal" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500 outline-none shadow-sm font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                />
              </div>

              {/* Seletor de Ícone */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Escolha um Ícone</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_GALLERY.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = selectedIconId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedIconId(item.id)}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                          isSelected 
                          ? 'bg-purple-600 text-white shadow-lg scale-110' 
                          : 'bg-slate-50 text-slate-400 hover:bg-purple-50'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                disabled={!newRoutineName.trim()}
                onClick={handleCreateRoutine}
                className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
              >
                Confirmar e Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
