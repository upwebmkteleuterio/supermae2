"use client";

import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { RoutineSelectionCards } from '../components/RoutineSelectionCards';
import { 
  Sparkles, 
  LayoutGrid, 
  RefreshCw, 
  Calendar, 
  Baby, 
  BookOpen, 
  ChevronRight,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export const CareAgenda: React.FC = () => {
  const { navigate, repeatPreviousDayRoutine } = useApp();
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <Toaster position="top-center" />
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('home')} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Cuidado e Rotina</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 space-y-4 pb-32">
        
        {/* OPÇÃO 1: ESCOLHER ROTINA PRONTA */}
        <div className="space-y-3">
          <AgendaOption 
            icon={<Sparkles className="w-5 h-5" />} 
            label="Escolher Rotina Pronta" 
            active={showTemplates}
            onClick={() => setShowTemplates(!showTemplates)}
          />
          
          {showTemplates && (
            <div className="animate-in slide-in-from-top-4 duration-300">
               <RoutineSelectionCards />
            </div>
          )}
        </div>

        {/* OPÇÃO 2: MONTAR MINHA ROTINA */}
        <AgendaOption 
          icon={<LayoutGrid className="w-5 h-5" />} 
          label="Montar Minha Rotina (por áreas)" 
          onClick={() => navigate('routines_list')}
        />

        {/* OPÇÃO 3: REPETIR DIA ANTERIOR */}
        <AgendaOption 
          icon={<RefreshCw className="w-5 h-5" />} 
          label="Repetir rotina do dia anterior" 
          onClick={repeatPreviousDayRoutine}
        />

        <div className="py-4 border-t border-slate-100 mt-6">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 ml-2">Agendas Individuais</p>
           <div className="space-y-3">
              <AgendaListItem 
                icon={<Calendar className="w-5 h-5" />} 
                label="Minha Agenda" 
                onClick={() => navigate('mom_agenda')} 
              />
              <AgendaListItem 
                icon={<Baby className="w-5 h-5" />} 
                label="Agenda do meu filho" 
                onClick={() => navigate('children_selection')} 
              />
              <AgendaListItem 
                icon={<BookOpen className="w-5 h-5" />} 
                label="Ver agenda integrada" 
                onClick={() => navigate('integrated_agenda')} 
              />
           </div>
        </div>

        <div className="bg-indigo-50 rounded-[2rem] p-6 mt-4 border border-indigo-100 flex items-start gap-4 shadow-sm">
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
            Escolha uma rotina pronta para preencher seu dia automaticamente ou personalize seus hábitos por áreas.
          </p>
        </div>
      </div>
    </Layout>
  );
};

const AgendaOption = ({ icon, label, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-5 rounded-[1.8rem] flex items-center justify-between border transition-all active:scale-[0.98] ${
      active ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-white text-slate-700 border-slate-50 shadow-sm'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${active ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
        {icon}
      </div>
      <span className="font-bold text-sm">{label}</span>
    </div>
    <ChevronRight className={`w-5 h-5 transition-transform ${active ? 'rotate-90 text-white' : 'text-slate-300'}`} />
  </button>
);

const AgendaListItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[1.5rem] p-4 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-slate-600 font-bold text-sm">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
  </button>
);