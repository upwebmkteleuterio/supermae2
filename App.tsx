"use client";

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Home } from './pages/Home';
import { Welcome } from './pages/Welcome';
import { Onboarding } from './pages/Onboarding';
import { ResetPassword } from './pages/ResetPassword';
import { SelfCareSelection } from './pages/SelfCareSelection';
import { MomSelfCare } from './pages/MomSelfCare';
import { MomAgenda } from './pages/MomAgenda';
import { ChildAgenda } from './pages/ChildAgenda';
import { IntegratedAgenda } from './pages/IntegratedAgenda';
import { BreathingExercise } from './components/BreathingExercise';
import { SentimentAnalysis } from './pages/SentimentAnalysis';
import { Settings } from './pages/Settings';
import { PersonalData } from './pages/PersonalData';
import { CareAgenda } from './pages/CareAgenda';
import { ChildrenSelection } from './pages/ChildrenSelection';
import { AddChild } from './pages/AddChild';
import { RoutinesList } from './pages/RoutinesList';
import { RoutineDetail } from './pages/RoutineDetail';
import { HabitSelection } from './pages/HabitSelection';
import { MoodDiary } from './pages/MoodDiary';
import { MoodSelection } from './pages/MoodSelection';
import { MomMoodChallenge } from './pages/MomMoodChallenge';
import { MoodResult } from './pages/MoodResult';
import { MoodDiarySelection } from './pages/MoodDiarySelection';
import { ChildMoodChildrenSelection } from './pages/ChildMoodChildrenSelection';
import { ChildMoodDiary } from './pages/ChildMoodDiary';
import { ChildMoodSelection } from './pages/ChildMoodSelection';
import { ChildMoodChallenge } from './pages/ChildMoodChallenge';
import { ChildMoodResult } from './pages/ChildMoodResult';
import { MoodDashboard } from './pages/MoodDashboard';
import { ChannelsList } from './pages/ChannelsList';
import { ChannelChat } from './pages/ChannelChat';
import { CareInstancesTarget } from './pages/CareInstancesTarget';
import { CareInstancesList } from './pages/CareInstancesList';
import { CareInstancesIntensity } from './pages/CareInstancesIntensity';
import { CareInstancesTasks } from './pages/CareInstancesTasks';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import { LocalSupportMural } from './pages/LocalSupportMural';
import { NotificationsList } from './pages/NotificationsList';
import { ShuffleSuggestions } from './pages/ShuffleSuggestions';
import { IndicationsHub } from './pages/IndicationsHub';
import { AnimationPreview } from './pages/AnimationPreview';
import { BottomNav } from './components/BottomNav';
import { Loader2 } from 'lucide-react';

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[999] overflow-hidden">
    {/* Fundo com bolhas idêntico ao Welcome/Login */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute top-[5%] -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] animate-float-slow"></div>
      <div className="absolute top-[35%] -right-32 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px] animate-float-reverse"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-pink-300/10 rounded-full blur-[90px] animate-float-slow"></div>
    </div>

    <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[280px]">
      {/* Logo Centralizada */}
      <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-50 duration-700">
        <img src="/logo.png" alt="Super Mãe Logo" className="w-full h-full object-cover" />
      </div>

      {/* Barra de Carregamento e Texto */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-purple-600 rounded-full"
            style={{ 
              animation: 'loadingProgress 5s linear forwards'
            }}
          />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
          carregando experiência
        </p>
      </div>
    </div>

    <style>{`
      @keyframes loadingProgress {
        from { width: 0%; }
        to { width: 100%; }
      }
    `}</style>
  </div>
);

const AppRouter: React.FC = () => {
  const { state, navigate } = useApp();
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    // Timer de 5 segundos para a splash screen
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 5000);

    if (window.location.pathname === '/animacao') {
      navigate('animation_preview');
    }

    return () => clearTimeout(timer);
  }, [navigate]);

  // Enquanto a splash estiver visível ou o auth ainda estiver carregando (apenas se for a primeira vez)
  if (splashVisible || state.isAuthLoading) return <SplashScreen />;
  
  if (state.isBreathingActive) return <BreathingExercise />;
  if (state.currentPage === 'animation_preview') return <AnimationPreview />;

  if (!state.isAuthenticated && state.currentPage !== 'welcome' && state.currentPage !== 'onboarding' && state.currentPage !== 'reset_password') {
    return <Welcome />;
  }

  switch (state.currentPage) {
    case 'welcome': return <Welcome />;
    case 'onboarding': return <Onboarding />;
    case 'reset_password': return <ResetPassword />;
    case 'home': return <Home />;
    case 'self_care_selection': return <SelfCareSelection />;
    case 'mom_self_care': return <MomSelfCare />;
    case 'mom_agenda': return <MomAgenda />;
    case 'children_selection': return <ChildrenSelection />;
    case 'add_child': return <AddChild />;
    case 'child_agenda': return <ChildAgenda />;
    case 'integrated_agenda': return <IntegratedAgenda />;
    case 'breathing_exercise': return <BreathingExercise />;
    case 'sentiment_analysis': return <SentimentAnalysis />;
    case 'settings': return <Settings />;
    case 'personal_data': return <PersonalData />;
    case 'care_agenda': return <CareAgenda />;
    case 'routines_list': return <RoutinesList />;
    case 'routine_detail': return <RoutineDetail />;
    case 'habit_selection': return <HabitSelection />;
    case 'mood_diary': return <MoodDiary />;
    case 'mood_selection': return <MoodSelection />;
    case 'mom_mood_challenge': return <MomMoodChallenge />;
    case 'mood_result': return <MoodResult />;
    case 'mood_diary_selection': return <MoodDiarySelection />;
    case 'child_mood_children_selection': return <ChildMoodChildrenSelection />;
    case 'child_mood_diary': return <ChildMoodDiary />;
    case 'child_mood_selection': return <ChildMoodSelection />;
    case 'child_mood_challenge': return <ChildMoodChallenge />;
    case 'child_mood_result': return <ChildMoodResult />;
    case 'mood_dashboard': return <MoodDashboard />;
    case 'channels_list': return <ChannelsList />;
    case 'channel_chat': return <ChannelChat />;
    case 'care_instances_target': return <CareInstancesTarget />;
    case 'care_instances_list': return <CareInstancesList />;
    case 'care_instances_intensity': return <CareInstancesIntensity />;
    case 'care_instances_tasks': return <CareInstancesTasks />;
    case 'local_support_mural': return <LocalSupportMural />;
    case 'notifications_list': return <NotificationsList />;
    case 'shuffle_suggestions': return <ShuffleSuggestions />;
    case 'indications_hub': return <IndicationsHub />;
    case 'subscription_plans':
    case 'payment_selection':
      return <SubscriptionPlans />;
    default: return state.isAuthenticated ? <Home /> : <Welcome />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="relative min-h-screen">
        <AppRouter />
        <BottomNav />
      </div>
    </AppProvider>
  );
};

export default App;