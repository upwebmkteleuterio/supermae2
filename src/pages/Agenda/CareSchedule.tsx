"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Baby, 
  LayoutDashboard,
  ChevronRight,
  Plus
} from 'lucide-react';

const CareSchedule = () => {
  const { navigate } = useApp();

  const options = [
    {
      id: 'routines',
      title: 'Registrar Rotinas (8 Áreas)',
      subtitle: 'Terapêutico, Sensorial, Social...',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
      action: () => navigate('CARE_INSTANCE_LIST') // Link para as 8 categorias
    },
    {
      id: 'personal',
      title: 'Minha Agenda',
      subtitle: 'Seus compromissos e autocuidado',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      action: () => navigate('PERSONAL_AGENDA')
    },
    {
      id: 'child',
      title: 'Ver agenda do meu filho',
      subtitle: 'Terapias, médicos e atividades',
      icon: Baby,
      color: 'bg-pink-100 text-pink-600',
      action: () => navigate('CHILD_AGENDA')
    },
    {
      id: 'integrated',
      title: 'Ver agenda integrada',
      subtitle: 'Visão 360° da IA e rotinas',
      icon: LayoutDashboard,
      color: 'bg-teal-100 text-teal-600',
      action: () => navigate('INTEGRATED_AGENDA')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Agenda de cuidados</h1>
        <p className="text-gray-500 mt-1">Gerencie sua jornada e a do seu filho</p>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={option.action}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-200 transition-colors group"
          >
            <div className={`p-3 rounded-xl ${option.color}`}>
              <option.icon size={24} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {option.title}
              </h3>
              <p className="text-sm text-gray-500">{option.subtitle}</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-blue-400 transition-colors" size={20} />
          </button>
        ))}

        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-blue-900">Adicionar Compromisso</h3>
            <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm">
              <Plus size={20} />
            </div>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            Adicione uma nova terapia, consulta médica ou atividade recorrente na agenda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareSchedule;