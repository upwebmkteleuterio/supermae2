
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  Calendar, 
  CalendarCheck, 
  Book, 
  BookOpen, 
  Settings, 
  ChevronRight 
} from 'lucide-react';

export const CareAgenda: React.FC = () => {
  const { navigate } = useApp();

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-slate-800">Agenda de cuidados</h1>
        <SOSButton />
      </div>

      <div className="px-6 space-y-3 pb-32">
        <AgendaListItem 
          icon={<CalendarCheck className="w-6 h-6" />} 
          label="Ver rotinas" 
          onClick={() => navigate('routines_list')} 
        />
        <AgendaListItem 
          icon={<Calendar className="w-6 h-6" />} 
          label="Minha Agenda" 
          onClick={() => navigate('mom_agenda')} 
        />
        <AgendaListItem 
          icon={<Book className="w-6 h-6" />} 
          label="Ver agenda do meu filho" 
          onClick={() => navigate('children_selection')} 
        />
        <AgendaListItem 
          icon={<BookOpen className="w-6 h-6" />} 
          label="Ver agenda integrada" 
          onClick={() => navigate('integrated_agenda')} 
        />
        <AgendaListItem 
          icon={<Settings className="w-6 h-6" />} 
          label="Atividades" 
          onClick={() => navigate('self_care_selection')} 
          isUnderConstruction
        />
      </div>
    </Layout>
  );
};

const AgendaListItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  isUnderConstruction?: boolean;
}> = ({ icon, label, onClick, isUnderConstruction }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[1.8rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all group relative"
  >
    {isUnderConstruction && (
      <div className="absolute -top-2 left-8 z-10 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border border-white">
        Em construção
      </div>
    )}
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
        {icon}
      </div>
      <span className="text-slate-700 font-bold text-sm">{label}</span>
    </div>
    <ChevronRight className="w-6 h-6 text-purple-300" />
  </button>
);
