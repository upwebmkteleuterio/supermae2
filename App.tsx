
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Home } from './pages/Home';
import { Welcome } from './pages/Welcome';
import { Onboarding } from './pages/Onboarding';
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
import { MoodResult } from './pages/MoodResult';
import { MoodDiarySelection } from './pages/MoodDiarySelection';
import { ChildMoodChildrenSelection } from './pages/ChildMoodChildrenSelection';
import { ChildMoodDiary } from './pages/ChildMoodDiary';
import { ChildMoodSelection } from './pages/ChildMoodSelection';
import { ChildMoodResult } from './pages/ChildMoodResult';
import { MoodDashboard } from './pages/MoodDashboard';
import { ChannelsList } from './pages/ChannelsList';
import { CareInstancesTarget } from './pages/CareInstancesTarget';
import { CareInstancesList } from './pages/CareInstancesList';
import { CareInstancesIntensity } from './pages/CareInstancesIntensity';
import { CareInstancesTasks } from './pages/CareInstancesTasks';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import { BottomNav } from './components/BottomNav';

const AppRouter: React.FC = () => {
  const { state } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [state.currentPage]);

  if (state.isBreathingActive) return <BreathingExercise />;

  switch (state.currentPage) {
    case 'welcome': return <Welcome />;
    case 'onboarding': return <Onboarding />;
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
    case 'mood_result': return <MoodResult />;
    case 'mood_diary_selection': return <MoodDiarySelection />;
    case 'child_mood_children_selection': return <ChildMoodChildrenSelection />;
    case 'child_mood_diary': return <ChildMoodDiary />;
    case 'child_mood_selection': return <ChildMoodSelection />;
    case 'child_mood_result': return <ChildMoodResult />;
    case 'mood_dashboard': return <MoodDashboard />;
    case 'channels_list': return <ChannelsList />;
    case 'care_instances_target': return <CareInstancesTarget />;
    case 'care_instances_list': return <CareInstancesList />;
    case 'care_instances_intensity': return <CareInstancesIntensity />;
    case 'care_instances_tasks': return <CareInstancesTasks />;
    case 'subscription_plans':
    case 'payment_selection':
      return <SubscriptionPlans />;
    default: return <Welcome />;
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
