"use client";

import React from 'react';
import { ChevronLeft, Plus, CheckCircle2, Circle, Clock, MoreVertical, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MomAgenda = () => {
  const { navigate, state, toggleAgendaItemCompletion } = useApp();

  // Filtramos apenas as tarefas manuais que NÃO são as rotinas automáticas indesejadas
  const tasks = state.manualMomAgenda.filter(t => {
    const isTemplate = t.title.includes('Abraço de Mãe') || t.title.includes('Super Mãe');
    return t.date === state.selectedDate && !isTemplate;
  });

  return (
    <div className="flex flex-col h-full bg-[#FFF5F5] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-4 border-b border-rose-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('care-agenda')} className="text-rose-500">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-rose-900">Minha Agenda</h1>
          <button className="text-rose-500">
            <MoreVertical size={24} />
          </button>
        </div>

        <div className="text-center bg-rose-50 p-3 rounded-2xl border border-rose-100">
          <p className="text-xs font-bold text-rose-400 uppercase tracking-tighter">Agenda Diária</p>
          <p className="text-lg font-bold text-rose-900">Suas Tarefas e Compromissos</p>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-rose-100 flex items-start gap-3 shadow-sm">
          <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-rose-500 text-[10px] leading-relaxed">
            As rotinas prontas foram removidas desta tela. Use o menu "Cuidados" para ativá-las quando desejar.
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <h2 className="text-lg font-bold text-rose-900">Tarefas de Hoje</h2>
          <button className="bg-rose-500 text-white p-1 rounded-lg shadow-sm">
            <Plus size={20} />
          </button>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className={`bg-white p-4 rounded-2xl border ${task.completed ? 'border-green-100 bg-green-50/20' : 'border-rose-100'} shadow-sm flex items-center gap-4`}>
                <button 
                  onClick={() => toggleAgendaItemCompletion(task.id, 'mãe')}
                  className={`${task.completed ? 'text-green-500' : 'text-rose-200'}`}
                >
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 mb-0.5 uppercase tracking-wider">
                    <Clock size={10} />
                    <span>{task.time}</span>
                  </div>
                  <h3 className={`font-bold text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-rose-900'}`}>
                    {task.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-rose-200">
            <p className="text-rose-300 text-sm">Nenhuma tarefa manual agendada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomAgenda;