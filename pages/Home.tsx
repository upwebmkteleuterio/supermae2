
import React, { useMemo, useState, useEffect } from 'react';
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
  LogOut,
  Info
} from 'lucide-react';

export const Home: React.FC = () => {
  const { navigate, state, updateUserProfile } = useApp();
  const { userProfile, routines, habitCompletions, selectedDate } = state;
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (userProfile.onboardingCompleted && !userProfile.hasSeenWelcomeModal) {
      setShowWelcome(true);
    }
  }, [userProfile.onboardingCompleted, userProfile.hasSeenWelcomeModal]);

  const handleResetForClient = () => {
    updateUserProfile({ onboardingCompleted: false, hasSeenWelcomeModal: false });
    navigate('welcome');
  };

  const closeWelcome = () => {
    updateUserProfile({ hasSeenWelcomeModal: true });
    setShowWelcome(false);
  };

  const habitsData = useMemo(() => {
    let totalHabits = 0;
    let completedHabits = 0;
    const todayCompletions = habitCompletions[selectedDate] || [];

    routines.forEach(r => {
      r.habits.forEach(h => {
        totalHabits++;
        if (todayCompletions.includes(h.id)) {
          completedHabits++;
        }
      });
    });

    return {
      progress: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0,
      total: totalHabits
    };
  }, [routines, habitCompletions, selectedDate]);

  const isAtypical = userProfile.welcomingGoal?.toLowerCase().includes('atípico');

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-6 px-6 flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('personal_data')}
          className="flex items-center gap-3 text-left active:opacity-70 transition-all group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 group-active:scale-90 transition-transform">
            <img 
              src={userProfile.avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-slate-800 font-bold text-lg leading-tight truncate group-active:text-purple-600 transition-colors">Olá, {userProfile.name.split(' ')[0]}!</h2>
            <p className="text-slate-400 text-xs font-medium truncate">Ver meu perfil</p>
          </div>
        </button>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => navigate('self_care_selection')}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-200 border border-slate-100 shadow-sm active:scale-95 transition-transform"
          >
            <Heart className="w-6 h-6" />
          </button>
          <SOSButton />
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-purple-50 rounded-2xl p-3 flex items-start gap-3 border border-purple-100/50">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-purple-600 font-medium leading-relaxed">
            Aqui está o resumo do seu dia. Acompanhe seu progresso e acesse suas ferramentas de cuidado rapidamente.
          </p>
        </div>
      </div>

      <div className="px-4 mb-6 relative">
        <WeeklyCalendar />
      </div>

      <div className="px-4 grid grid-cols-2 gap-4 mb-8">
        <div 
          onClick={() => navigate('routines_list')}
          className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex flex-col relative overflow-hidden active:scale-95 transition-all cursor-pointer"
        >
          <h3 className="text-slate-400 text-sm font-bold mb-4">Hábitos</h3>
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
                   style={{ 
                     strokeDashoffset: 125.6 * (1 - (habitsData.progress / 100)),
                     transition: 'stroke-dashoffset 1s ease-out'
                   }}
                 />
                 <defs>
                   <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#A855F7" />
                     <stop offset="100%" stopColor="#C084FC" />
                   </linearGradient>
                 </defs>
               </svg>
               <div className="absolute inset-0 flex items-end justify-center pb-1">
                  <span className="text-sm font-black text-slate-700">{habitsData.progress}%</span>
               </div>
             </div>
             <p className="text-[10px] text-slate-400 font-bold mt-4">
               {habitsData.total === 0 ? 'Sem tarefas hoje' : 'Concluído hoje'}
             </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('mood_diary_selection')}
          className="group bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex flex-col active:scale-95 transition-all text-left relative overflow-hidden"
        >
          <h3 className="text-slate-400 text-sm font-bold mb-4">Diário emocional</h3>
          <div className="flex-1 flex flex-col items-center justify-center py-2">
            <AnimatedCalendarIcon className="w-14 h-14" />
            <div className="flex items-center justify-between w-full mt-4">
               <p className="text-[10px] text-slate-400 font-bold leading-tight max-w-[80px]">Como você está se sentindo?</p>
               <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </button>
      </div>

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
            onClick={() => navigate('channels_list')}
            icon={<Users className="w-7 h-7" />}
            title="Canais temáticos"
            subtitle="Conecte-se com outras mães"
            color="bg-[#F3F0FF]"
            iconColor="text-purple-300"
          />
        </div>
      </div>

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

      <div className="px-6 pb-32 flex justify-center">
        <button 
          onClick={handleResetForClient}
          className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] hover:text-purple-400 transition-colors py-4 active:scale-95"
        >
          <LogOut className="w-3 h-3" /> Voltar para tela de boas-vindas
        </button>
      </div>

      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-300" style={{ backgroundColor: 'rgba(30, 31, 41, 0.85)' }}>
          {isAtypical ? (
            <article className="bg-white rounded-[16px] shadow-2xl p-[30px] flex flex-col items-center text-center w-full max-w-[340px] animate-in zoom-in-95 duration-300">
              <div className="mb-6">
                <img 
                  alt="Envelope with flowers" 
                  className="w-[220px] h-auto object-contain" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv0BfWiRm4mMwYuQAet7wGM2CEKn4eTRh7QvxYRWe8Td4FFcyOK3x813RvQmulCdNTS1z5_hfceBNW3wR1MS-9PNW88VmskejMlL54xylClASWeQ7tpR86qsx0-cwsXEthx4Gxcxv6LYSqMhafb10vvqbsZQ0rdMBCf0uqw-euSNnEtaaNaOwJOezHdfL8WMskXQytkPxG16jOw-LP-BXikn7zuDLE3-bt6A4InJKqIfWIVP6nK8WamWSFVelAVHrfRBuXMgWgvnOB" 
                />
              </div>
              <section className="mb-8">
                <h1 className="text-[#2D2D2D] font-bold leading-[1.3] text-[22px] mb-0">
                  Bem-vinda à sua rede de apoio personalizada, Mãe Atípica!
                </h1>
                <p className="text-[#6B6B6B] font-medium leading-[1.5] px-2 mt-[15px] text-[16px]">
                  Aqui você não precisa dar conta de tudo. Aqui você será cuidada também.
                </p>
              </section>
              <button 
                onClick={closeWelcome}
                className="w-full bg-[#8e54a9] hover:bg-purple-600 text-white font-bold rounded-[25px] transition duration-300 ease-in-out transform active:scale-95 shadow-md h-[50px] mt-[10px]"
              >
                Vamos lá!
              </button>
            </article>
          ) : (
            <main className="bg-white rounded-[32px] shadow-2xl w-full max-w-[340px] flex flex-col items-center text-center px-[32px] py-[40px] animate-in zoom-in-95 duration-300">
              <div className="flex justify-center w-full mb-[20px]">
                <img 
                  alt="Flowers in a pot" 
                  className="w-[140px] h-auto object-contain block mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkVUSzNrIYiYzblKCpuiwNULUcBYnM8yrc7aqP4bsDhmQsRX_fMaDX1BD9bobo3MDgYleZU_BUtUUqEA4EjT7JCe_xZF-rBZ4IqfCE4CGx2n1SsOxOZQbPPzeoKRbKmt449CNxNpWRdIMvJrxZ8I-SetWBGtATABAN_nRLBTlcEkWLLkIbTOIgYYW3oQ4zTToE9zWIOW5Wj3lgGRpTpjwchPr-EuFQz5lw--YdN92VntmhdgU6_8Pbfbyw-r3gSSjd9dXbKAYimtdx" 
                />
              </div>
              <section className="space-y-4 mb-[32px]">
                <h1 className="text-[22px] font-bold leading-snug tracking-tight text-[#1F2937]">
                  Bem-vinda ao seu espaço de cuidado, Super Mãe!
                </h1>
                <p className="text-[16px] text-[#6B7280] leading-[1.5] font-normal px-2">
                  A maternidade não precisa ser solitária. Aqui você encontra leveza e apoio.
                </p>
              </section>
              <button 
                onClick={closeWelcome}
                className="w-full hover:bg-[#4b3791] active:scale-95 transition-all duration-200 text-white font-bold text-base py-3.5 rounded-full bg-[#6A4BC1] shadow-[0_10px_20px_-5px_rgba(106,75,193,0.5)]"
              >
                Vamos lá!
              </button>
            </main>
          )}
        </div>
      )}
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
      <div className="absolute top-3 left-5 z-10 bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border border-white">
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
