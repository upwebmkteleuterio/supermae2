import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  Calendar, 
  CalendarCheck, 
  Book, 
  BookOpen, 
  ChevronRight,
  ArrowLeft,
  Heart
} from 'lucide-react';

export const CareAgenda: React.FC = () => {
  const { navigate } = useApp();

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('home')} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Agenda de cuidados</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 space-y-4 pb-32">
        {/* ATUALIZADO: Agora leva para as 8 áreas de cuidado especializado */}
        <AgendaListItem 
          icon={<Heart className="w-6 h-6" />} 
          label="Registrar Rotinas (8 Áreas)" 
          description="Terapêutico, Sensorial, Comunicacional e mais."
          onClick={() => navigate('care_instances_list')} 
        />
        <AgendaListItem 
          icon={<Calendar className="w-6 h-6" />} 
          label="Minha Agenda" 
          description="Gerencie seus compromissos e lembretes."
          onClick={() => navigate('mom_agenda')} 
        />
        <AgendaListItem 
          icon={<Book className="w-6 h-6" />} 
          label="Ver agenda do meu filho" 
          description="Acompanhe as terapias e atividades do seu pequeno."
          onClick={() => navigate('children_selection')} 
        />
        <AgendaListItem 
          icon={<BookOpen className="w-6 h-6" />} 
          label="Ver agenda integrada" 
          description="Visão unificada das agendas com análise da IA."
          onClick={() => navigate('integrated_agenda')} 
        />
      </div>
    </Layout>
  );
};

const AgendaListItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  description: string;
  onClick: () => void;
}> = ({ icon, label, description, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[1.8rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
  >
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
        {icon}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-slate-700 font-bold text-sm">{label}</span>
        <span className="text-slate-400 text-[10px] font-medium leading-tight mt-0.5">{description}</span>
      </div>
    </div>
    <ChevronRight className="w-6 h-6 text-purple-300 shrink-0" />
  </button>
);