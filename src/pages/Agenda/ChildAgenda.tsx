"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Plus, 
  BookOpen,
  ChevronRight,
  Clock,
  Filter
} from 'lucide-react';

const ChildAgenda = () => {
  const { navigate, state } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = [
    {
      id: 1,
      title: 'Terapia Ocupacional',
      time: '14:00 - 15:00',
      category: 'Terapia',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 2,
      title: 'Fonoaudiologia',
      time: '16:30 - 17:30',
      category: 'Saúde',
      color: 'bg-blue-100 text-blue-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate('CARE_SCHEDULE')} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="font-bold text-gray-900 text-lg">Agenda do {state.currentChild?.name || 'Filho'}</h1>
        <button className="p-2 -mr-2 text-blue-600">
          <Filter size={20} />
        </button>
      </div>

      {/* Calendário Simples */}
      <div className="bg-white p-4 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-4">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i}
              className={`flex-shrink-0 w-12 py-3 rounded-2xl flex flex-col items-center gap-1 ${
                i === 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500'
              }`}
            >
              <span className="text-[10px] uppercase font-bold">{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i]}</span>
              <span className="font-bold text-lg">{15 + i}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Card do Diário - ATUALIZADO */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-pink-100 p-2.5 rounded-xl text-pink-600">
                <BookOpen size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Diário Especializado</h3>
                <p className="text-xs text-gray-500">Registrar conquistas e alertas</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('SPECIALIZED_DIARY')} // LINK CORRIGIDO PARA O NOVO DIÁRIO
              className="w-full bg-pink-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-100 active:scale-95 transition-transform"
            >
              Acessar Diário
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Lista de Eventos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Compromissos de Hoje</h3>
            <button className="text-blue-600 text-sm font-semibold">Ver todos</button>
          </div>
          
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                <div className={`w-2 h-12 rounded-full ${event.color.split(' ')[0]}`} />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{event.title}</h4>
                  <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon size={12} />
                      Presencial
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botão Flutuante */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform">
        <Plus size={28} />
      </button>
    </div>
  );
};

export default ChildAgenda;