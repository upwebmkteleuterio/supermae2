
import React from 'react';
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
import { BottomNav } from './components/BottomNav';

const AppRouter: React.FC = () => {
  const { state } = useApp();

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
