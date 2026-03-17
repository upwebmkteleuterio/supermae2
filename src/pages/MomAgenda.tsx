"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Circle, Clock, MoreVertical } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MomAgenda = () => {
  const { navigate } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock tasks
  const tasks = [
    { id: 1, time: '08:00', title: 'Meditação Matinal', category: 'Bem-estar', completed: true },
    { id: 2, time: '09:00', title: 'Reunião de Equipe', category: 'Trabalho', completed: false },
    { id: 3, time: '14:00', title: 'Atividade Física', category: 'Saúde', completed: false },
    { id: 4, time: '16:00', title: 'Leitura', category: 'Pessoal', completed: false },
  ];

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

        {/* Calendar Strip (Simplified) */}
        <div className="flex justify-between items-center bg-rose-50 p-3 rounded-2xl">
          <button className="text-rose-400"><ChevronLeft size={20} /></button>
          <div className="text-center">
            <p className="text-xs font-bold text-rose-400 uppercase">Março 2024</p>
            <p className="text-lg font-bold text-rose-900">Terça, 19</p>
          </div>
          <button className="text-rose-400"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Task List */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-rose-900">Tarefas de Hoje</h2>
          <button className="bg-rose-500 text-white p-1 rounded-lg">
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className={`bg-white p-4 rounded-2xl border ${task.completed ? 'border-green-100 bg-green-50/30' : 'border-rose-100'} shadow-sm flex items-center gap-4`}>
              <button className={`${task.completed ? 'text-green-500' : 'text-rose-200'}`}>
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-rose-400 mb-1">
                  <Clock size={12} />
                  <span>{task.time}</span>
                  <span className="mx-1">•</span>
                  <span>{task.category}</span>
                </div>
                <h3 className={`font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-rose-900'}`}>
                  {task.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MomAgenda;