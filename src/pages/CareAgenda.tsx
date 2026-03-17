"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutGrid, 
  RefreshCw, 
  Calendar, 
  Baby, 
  BookOpen, 
  ChevronRight,
  Info,
  Heart,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoutineSelectionCards } from '../components/RoutineSelectionCards';
import { Toaster } from 'react-hot-toast';

const CareAgenda = () => {
  const { navigate, repeatPreviousDayRoutine } = useApp();
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#FFF5F5] pb-20 overflow-y-auto">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-6 border-b border-rose-100">
        <h1 className="text-2xl font-bold text-rose-900 flex items-center gap-2">
          <Heart className="text-rose-500 fill-rose-500" size={24} />
          Cuidados e Rotina
        </h1>
        <p className="text-rose-600 mt-1">Escolha como organizar o seu dia</p>
      </div>

      <div className="px-4 space-y-4">
        
        {/* OPÇÃO 1: ESCOLHER ROTINA PRONTA */}
        <div className="space-y-3">
          <button 
            onClick={() => setShowTemplates(!showTemplates)} 
            className={`w-full p-5 rounded-2xl shadow-sm border transition-all text-left flex items-center justify-between group ${
              showTemplates ? 'bg-rose-600 border-transparent' : 'bg-white border-rose-100 hover:bg-rose-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`${showTemplates ? 'bg-white/20' : 'bg-rose-100'} p-3 rounded-xl transition-colors`}>
                <Sparkles className={showTemplates ? 'text-white' : 'text-rose-600'} size={24} />
              </div>
              <div>
                <h3 className={`font-bold ${showTemplates ? 'text-white' : 'text-rose-900'}`}>Escolher Rotina Pronta</h3>
                <p className={`text-xs ${showTemplates ? 'text-rose-100' : 'text-rose-500'}`}>Abraço de Mãe e Super Mãe</p>
              </div>
            </div>
            <ChevronDown className={`transition-transform duration-300 ${showTemplates ? 'rotate-180 text-white' : 'text-rose-300'}`} size={20} />
          </button>

          {showTemplates && (
            <div className="animate-in slide-in-from-top-4 duration-300 pb-2">
               <RoutineSelectionCards />
            </div>
          )}
        </div>

        {/* OPÇÃO 2: MONTAR MINHA ROTINA */}
        <button 
          onClick={() => navigate('routines')} 
          className="w-full bg-white p-5 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-between hover:bg-rose-50 transition-colors text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-rose-100 p-3 rounded-xl group-hover:bg-rose-200 transition-colors">
              <LayoutGrid className="text-rose-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-rose-900">Montar Minha Rotina</h3>
              <p className="text-xs text-rose-500">Personalize seus próprios hábitos</p>
            </div>
          </div>
          <ChevronRight className="text-rose-300" size={20} />
        </button>

        {/* OPÇÃO 3: REPETIR DIA ANTERIOR */}
        <button 
          onClick={async () => {
            await repeatPreviousDayRoutine();
            navigate('mom-agenda');
          }}
          className="w-full bg-white p-5 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-between hover:bg-rose-50 transition-colors text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-rose-100 p-3 rounded-xl group-hover:bg-rose-200 transition-colors">
              <RefreshCw className="text-rose-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-rose-900">Repetir dia anterior</h3>
              <p className="text-xs text-rose-500">Copia as tarefas de ontem</p>
            </div>
          </div>
          <ChevronRight className="text-rose-300" size={20} />
        </button>

        {/* SEÇÃO SECUNDÁRIA: AGENDAS */}
        <div className="pt-6 border-t border-rose-100 mt-4">
          <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-4 ml-2">Agendas Individuais</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('mom-agenda')}
              className="bg-white p-4 rounded-2xl shadow-sm border border-rose-50 flex flex-col items-center gap-2 text-center hover:bg-rose-50 transition-colors"
            >
              <div className="bg-rose-50 p-2 rounded-lg text-rose-500">
                <Calendar size={20} />
              </div>
              <span className="text-xs font-bold text-rose-900">Minha Agenda</span>
            </button>

            <button 
              onClick={() => navigate('child-agenda')}
              className="bg-white p-4 rounded-2xl shadow-sm border border-rose-50 flex flex-col items-center gap-2 text-center hover:bg-rose-50 transition-colors"
            >
              <div className="bg-rose-50 p-2 rounded-lg text-rose-500">
                <Baby size={20} />
              </div>
              <span className="text-xs font-bold text-rose-900">Agenda do Filho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareAgenda;