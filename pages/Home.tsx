
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { AnimatedCalendarIcon } from '../components/AnimatedCalendarIcon';
import { 
  Heart, 
  ChevronRight, 
  MessageCircle, 
  Calendar, 
  Users, 
  LayoutGrid,
  Sparkles,
  Baby,
  CalendarDays,
  ExternalLink,
  LogOut
} from 'lucide-react';

export const Home: React.FC = () => {
  const { navigate, state, updateUserProfile } = useApp();
  const { userProfile } = state;

  const handleResetForClient = () => {
    updateUserProfile({ onboardingCompleted: false });
    navigate('welcome');
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      {/* Top Bar */}
      <div className="pt-6 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img 
              src={userProfile.avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-slate-800 font-bold text-lg leading-tight">Olá, {userProfile.name.split(' ')[0]}!</h2>
            <p className="text-slate-400 text-xs font-medium">Vamos juntas nessa.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-200 border border-slate-100 shadow-sm active:scale-95 transition-transform">
            <Heart className="w-6 h-6" />
          </button>
          <SOSButton />
        </div>
      </div>

      {/* Calendário Semanal Modular */}
      <div className="px-4 mb-6 relative">
        <div className="absolute -top-2 left-8 z-10 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border border-white">
          Em construção
        </div>
        <WeeklyCalendar />
      </div>

      {/* Grid Dashboard */}
      <div className="px-4 grid grid-cols-2 gap-4 mb-8">
        {/* Card Tarefas */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex flex-col">
          <h3 className="text-slate-400 text-sm font-bold mb-4">Tarefas</h3>
          <div className="flex-1 flex flex-col items-center justify-center py-2">
             <div className="relative w-24 h-16 overflow-hidden">
               <svg className="w-full h-full" viewBox="0 0 100 50">
                 <path 
                   d="M 10 50 A 40 40 0 0 1 90 50" 
                   fill="none" 
                   stroke="#F1F5F9" 
                   strokeWidth="12" 
                   strokeLinecap="round"
                 />
                 <path 
                   d="M 10 50 A 40 40 0 0 1 90 50" 
                   fill="none" 
                   stroke="url(#gradient-purple)" 
                   strokeWidth="12" 
                   strokeLinecap="round"
                   strokeDasharray="125.6"
                   strokeDashoffset={125.6 * (1 - 0.45)}
                   className="animate-[gauge-fill_1.5s_ease-out_forwards]"
                 />
                 <defs>
                   <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#A855F7" />
                     <stop offset="100%" stopColor="#C084FC" />
                   </linearGradient>
                 </defs>
               </svg>
               <div className="absolute inset-0 flex items-end justify-center pb-1">
                  <span className="text-sm font-black text-slate-700">45%</span>
               </div>
             </div>
             <p className="text-[10px] text-slate-400 font-bold mt-4">Seu progresso do dia</p>
          </div>
        </div>

        {/* Card Diário Emocional com Ícone Animado */}
        <button 
          onClick={() => navigate('sentiment_analysis')}
          className="group bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex flex-col active:scale-95 transition-all text-left relative overflow-hidden"
        >
          <div className="absolute -top-2 left-6 z-10 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border border-white">
            Em construção
          </div>
          <h3 className="text-slate-400 text-sm font-bold mb-4">Diário emocional</h3>
          <div className="flex-1 flex flex-col items-center justify-center py-2">
            <AnimatedCalendarIcon />
            <div className="flex items-center justify-between w-full mt-4">
               <p className="text-[10px] text-slate-400 font-bold leading-tight max-w-[80px]">Como você está se sentindo?</p>
               <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </button>
      </div>

      {/* Seção Explorar */}
      <div className="px-6 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Explorar</h3>
        
        <div className="space-y-4">
          <ExploreItem 
            onClick={() => navigate('sentiment_analysis')}
            icon={<MessageCircle className="w-7 h-7" />}
            title="Análise de sentimentos"
            subtitle="Precisa de ajuda em algo?"
            color="bg-[#F3F0FF]"
            iconColor="text-purple-300"
          />

          <ExploreItem 
            onClick={() => navigate('care_agenda')}
            icon={<Calendar className="w-7 h-7" />}
            title="Agenda de cuidados"
            subtitle="Planeje momentos para você"
            color="bg-[#F3F0FF]"
            iconColor="text-purple-300"
          />

          <ExploreItem 
            onClick={() => {}}
            icon={<Users className="w-7 h-7" />}
            title="Canais temáticos"
            subtitle="Conecte-se com outras mães"
            color="bg-[#F3F0FF]"
            iconColor="text-purple-300"
            isUnderConstruction
          />
        </div>
      </div>

      {/* Menu de Atalhos */}
      <div className="px-6 pb-4">
        <div className="bg-slate-100 rounded-[2.5rem] p-6 border border-slate-200/50">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <LayoutGrid className="w-3 h-3" /> Atalhos Rápidos
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink icon={<Sparkles className="w-4 h-4" />} label="Autocuidado IA" onClick={() => navigate('self_care_selection')} />
            <QuickLink icon={<CalendarDays className="w-4 h-4" />} label="Minha Agenda" onClick={() => navigate('mom_agenda')} />
            <QuickLink icon={<Baby className="w-4 h-4" />} label="Agenda Filho" onClick={() => navigate('children_selection')} />
            <QuickLink icon={<ExternalLink className="w-4 h-4" />} label="Integrada" onClick={() => navigate('integrated_agenda')} />
          </div>
        </div>
      </div>

      {/* Debug Section for Client */}
      <div className="px-6 pb-32 flex justify-center">
        <button 
          onClick={handleResetForClient}
          className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] hover:text-purple-400 transition-colors py-4 active:scale-95"
        >
          <LogOut className="w-3 h-3" /> Voltar para tela de boas-vindas
        </button>
      </div>

      <style>{`
        @keyframes gauge-fill {
          from { stroke-dashoffset: 125.6; }
          to { stroke-dashoffset: ${125.6 * (1 - 0.45)}; }
        }
      `}</style>
    </Layout>
  );
};

const ExploreItem: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  iconColor: string;
  isUnderConstruction?: boolean;
}> = ({ onClick, icon, title, subtitle, color, iconColor, isUnderConstruction }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[1.8rem] p-4 flex items-center gap-5 border border-slate-50 shadow-sm active:scale-[0.98] transition-all group relative"
  >
    {isUnderConstruction && (
      <div className="absolute -top-2 left-6 z-10 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border border-white">
        Em construção
      </div>
    )}
    <div className={`w-16 h-16 ${color} ${iconColor} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="text-left">
      <h4 className="font-bold text-slate-700 text-sm">{title}</h4>
      <p className="text-slate-300 text-xs font-medium">{subtitle}</p>
    </div>
  </button>
);

const QuickLink: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-2xl border border-slate-200 text-slate-500 hover:text-purple-600 transition-colors shadow-sm"
  >
    <div className="text-purple-400">{icon}</div>
    <span className="text-[10px] font-bold truncate">{label}</span>
  </button>
);
