
import React from 'react';
import { LayoutGrid, MessageCircle, Calendar, Heart, Settings } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ViewState } from '../types';

export const BottomNav: React.FC = () => {
  const { state, navigate } = useApp();

  if (state.isBreathingActive) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
      <nav className="bg-[#A855F7] rounded-full p-2 flex justify-between items-center shadow-[0_20px_50px_rgba(168,85,247,0.3)] border border-white/10 backdrop-blur-md">
        <NavItem 
          icon={<LayoutGrid className="w-5 h-5" />} 
          label="Início" 
          active={state.currentPage === 'home'} 
          onClick={() => navigate('home')}
        />
        <NavItem 
          icon={<MessageCircle className="w-5 h-5" />} 
          label="Sentimentos" 
          active={state.currentPage === 'sentiment_analysis'} 
          onClick={() => navigate('sentiment_analysis')}
        />
        <NavItem 
          icon={<Calendar className="w-5 h-5" />} 
          label="Cuidados" 
          active={state.currentPage === 'care_agenda' || state.currentPage === 'mom_agenda' || state.currentPage === 'child_agenda' || state.currentPage === 'integrated_agenda'} 
          onClick={() => navigate('care_agenda')}
        />
        <NavItem 
          icon={<Heart className="w-5 h-5" />} 
          label="Autocuidado" 
          active={state.currentPage === 'self_care_selection' || state.currentPage === 'mom_self_care'} 
          onClick={() => navigate('self_care_selection')}
        />
        <NavItem 
          icon={<Settings className="w-5 h-5" />} 
          label="Config" 
          active={state.currentPage === 'settings' || state.currentPage === 'personal_data'} 
          onClick={() => navigate('settings')}
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 transition-all duration-500 py-2.5 rounded-full ${
      active 
      ? 'bg-white text-[#A855F7] px-5 shadow-lg scale-105' 
      : 'text-white/70 px-4 hover:text-white'
    }`}
  >
    <div className={active ? 'text-[#A855F7]' : ''}>{icon}</div>
    {active && <span className="text-[11px] font-bold whitespace-nowrap">{label}</span>}
  </button>
);
