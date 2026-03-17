"use client";

import React from 'react';
import { Home, Calendar, Heart, MessageSquare, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navigation = () => {
  const { state, navigate } = useApp();
  
  // Lista de páginas onde o menu inferior deve aparecer
  const visiblePages = [
    'HOME', 
    'ROUTINES', 
    'DIARY', 
    'SOCIAL', 
    'PROFILE', 
    'CARE_SCHEDULE', 
    'CHILD_AGENDA', 
    'INTEGRATED_AGENDA',
    'CARE_INSTANCE_LIST',
    'SPECIALIZED_DIARY'
  ];

  if (!visiblePages.includes(state.currentPage)) {
    return null;
  }

  const navItems = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'CARE_SCHEDULE', icon: Calendar, label: 'Agenda' },
    { id: 'CARE_INSTANCE_LIST', icon: Heart, label: 'Cuidado' }, // Ícone de coração agora leva para as 8 áreas
    { id: 'SOCIAL', icon: MessageSquare, label: 'Social' },
    { id: 'PROFILE', icon: User, label: 'Perfil' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            state.currentPage === item.id ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <item.icon size={24} strokeWidth={state.currentPage === item.id ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;