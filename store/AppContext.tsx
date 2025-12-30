
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AppState, ViewState, MoodType, Child, Activity, AgendaItem, DailyMission, ChatMessage, UserProfile, Routine } from '../types';

interface AppContextProps {
  state: AppState;
  navigate: (page: ViewState) => void;
  goBack: () => void;
  setSelectedDate: (date: string) => void;
  setMood: (mood: MoodType) => void;
  addChild: (child: Child) => void;
  selectChild: (id: string | null) => void;
  toggleBreathing: (active: boolean) => void;
  addAgendaItem: (item: AgendaItem) => void;
  updateAgendaItem: (item: AgendaItem) => void;
  deleteAgendaItem: (id: string) => void;
  toggleAgendaItemCompletion: (id: string, owner: 'mãe' | 'filho') => void;
  updateMomSelfCare: (activities: Activity[]) => void;
  addRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  selectRoutine: (id: string | null) => void;
  addHabitToRoutine: (routineId: string, habit: Activity) => void;
  updateHabitInRoutine: (routineId: string, habit: Activity) => void;
  registerHabitTemplate: (habit: Activity) => void;
  deleteCategory: (oldCategory: string, migrateToCategory: string) => void;
  toggleHabitCompletion: (routineId: string, habitId: string, date: string) => void;
  deleteHabitFromRoutine: (routineId: string, habitId: string) => void;
  setDailyMission: (mission: DailyMission) => void;
  completeDailyMission: () => void;
  addReward: (reward: string) => void;
  resetState: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChatHistory: () => void;
  setVoice: (voice: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  saveMoodRecord: (date: string, sentimentIds: string[]) => void;
  setTempMoodSelection: (ids: string[]) => void;
}

const STORAGE_KEY = 'super_mae_app_state_v21';

const getTodayStr = () => {
  return new Date().toLocaleDateString('sv-SE');
};

const INITIAL_STATE: AppState = {
  currentPage: 'welcome',
  navigationStack: ['welcome'],
  selectedDate: getTodayStr(),
  selectedMood: null,
  lastMoodSelectedDate: null,
  children: [],
  selectedChildId: null,
  isBreathingActive: false,
  isSilentMode: false,
  momSelfCareAgenda: [],
  manualMomAgenda: [],
  manualChildAgenda: [],
  routines: [
    { id: 'r1', name: 'Rotina Acolhedora', subtitle: 'Abraço de Mãe', image: '/images/frame1.png', habits: [] },
    { id: 'r2', name: 'Rotina Enérgica', subtitle: 'Super Mãe em Movimento!', image: '/images/frame2.png', habits: [] }
  ],
  customHabitTemplates: [],
  customCategories: [],
  habitCompletions: {},
  moodHistory: {},
  tempMoodSelection: [],
  selectedRoutineId: null,
  completedRewards: [],
  dailyMission: null,
  chatHistory: [],
  selectedVoice: 'Kore',
  userProfile: {
    name: 'Maria Helena',
    email: 'maria.helena@gmail.com',
    phone: '(11) 99999-9999',
    state: 'SP',
    city: 'São Paulo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    onboardingCompleted: false
  }
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : INITIAL_STATE;
    if (!parsed.userProfile?.onboardingCompleted && parsed.currentPage !== 'welcome' && parsed.currentPage !== 'onboarding') {
       return { ...parsed, currentPage: 'welcome', navigationStack: ['welcome'] };
    }
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const navigate = useCallback((page: ViewState) => {
    setState(prev => ({
      ...prev,
      currentPage: page,
      navigationStack: [...prev.navigationStack, page]
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      if (prev.navigationStack.length <= 1) return prev;
      const newStack = [...prev.navigationStack];
      newStack.pop();
      return { ...prev, navigationStack: newStack, currentPage: newStack[newStack.length - 1] as ViewState };
    });
  }, []);

  const setSelectedDate = (date: string) => setState(prev => ({ ...prev, selectedDate: date }));

  const setMood = useCallback((mood: MoodType) => {
    const today = getTodayStr();
    setState(prev => ({ 
      ...prev, 
      selectedMood: mood, 
      lastMoodSelectedDate: today,
      momSelfCareAgenda: prev.selectedMood !== mood ? [] : prev.momSelfCareAgenda 
    }));
  }, []);

  const addChild = (child: Child) => setState(prev => ({ ...prev, children: [...prev.children, child] }));
  const selectChild = (id: string | null) => setState(prev => ({ ...prev, selectedChildId: id }));
  const toggleBreathing = (active: boolean) => setState(prev => ({ ...prev, isBreathingActive: active }));

  const addAgendaItem = (item: AgendaItem) => {
    setState(prev => {
      const newState = { ...prev };
      const participants = item.participantIds || [];
      if (participants.includes('mom')) newState.manualMomAgenda = [...newState.manualMomAgenda, { ...item, owner: 'mãe' }];
      participants.filter(p => p !== 'mom').forEach(cid => {
        newState.manualChildAgenda = [...newState.manualChildAgenda, { ...item, owner: 'filho', childId: cid }];
      });
      return newState;
    });
  };

  const updateAgendaItem = (item: AgendaItem) => {
    setState(prev => ({
      ...prev,
      manualMomAgenda: prev.manualMomAgenda.map(i => i.id === item.id ? { ...item, owner: 'mãe' } : i),
      manualChildAgenda: prev.manualChildAgenda.map(i => i.id === item.id ? { ...item, owner: 'filho' } : i)
    }));
  };

  const deleteAgendaItem = (id: string) => {
    setState(prev => ({
      ...prev,
      manualMomAgenda: prev.manualMomAgenda.filter(i => i.id !== id),
      manualChildAgenda: prev.manualChildAgenda.filter(i => i.id !== id)
    }));
  };

  const toggleAgendaItemCompletion = (id: string, owner: 'mãe' | 'filho') => {
    setState(prev => ({
      ...prev,
      manualMomAgenda: prev.manualMomAgenda.map(i => i.id === id ? { ...i, completed: !i.completed } : i),
      manualChildAgenda: prev.manualChildAgenda.map(i => i.id === id ? { ...i, completed: !i.completed } : i)
    }));
  };

  const updateMomSelfCare = (activities: Activity[]) => setState(prev => ({ ...prev, momSelfCareAgenda: activities }));
  
  const addRoutine = (routine: Routine) => setState(prev => ({ ...prev, routines: [...prev.routines, routine] }));
  const deleteRoutine = (id: string) => setState(prev => ({ ...prev, routines: prev.routines.filter(r => r.id !== id) }));
  const selectRoutine = (id: string | null) => setState(prev => ({ ...prev, selectedRoutineId: id }));

  const addHabitToRoutine = (routineId: string, habit: Activity) => {
    setState(prev => ({
      ...prev,
      routines: prev.routines.map(r => r.id === routineId ? { ...r, habits: [...r.habits, habit] } : r)
    }));
  };

  const updateHabitInRoutine = (routineId: string, habit: Activity) => {
    setState(prev => ({
      ...prev,
      routines: prev.routines.map(r => r.id === routineId 
        ? { ...r, habits: r.habits.map(h => h.id === habit.id ? habit : h) } 
        : r)
    }));
  };

  const registerHabitTemplate = (habit: Activity) => {
    setState(prev => {
      const isAlreadyIn = prev.customHabitTemplates.some(h => h.title === habit.title && h.category === habit.category);
      if (isAlreadyIn) return prev;
      const updatedCategories = habit.category && !INITIAL_STATE.customCategories.includes(habit.category) && !prev.customCategories.includes(habit.category)
        ? [...prev.customCategories, habit.category]
        : prev.customCategories;
      return {
        ...prev,
        customHabitTemplates: [...prev.customHabitTemplates, habit],
        customCategories: updatedCategories
      };
    });
  };

  const deleteCategory = (oldCategory: string, migrateToCategory: string) => {
    setState(prev => {
      const updatedTemplates = prev.customHabitTemplates.map(h => 
        h.category === oldCategory ? { ...h, category: migrateToCategory } : h
      );
      const updatedRoutines = prev.routines.map(r => ({
        ...r,
        habits: r.habits.map(h => h.category === oldCategory ? { ...h, category: migrateToCategory } : h)
      }));
      const updatedCustomCategories = prev.customCategories.filter(c => c !== oldCategory);
      return {
        ...prev,
        customHabitTemplates: updatedTemplates,
        routines: updatedRoutines,
        customCategories: updatedCustomCategories
      };
    });
  };

  const toggleHabitCompletion = (routineId: string, habitId: string, date: string) => {
    setState(prev => {
      const completions = { ...prev.habitCompletions };
      const dateCompletions = [...(completions[date] || [])];
      if (dateCompletions.includes(habitId)) {
        completions[date] = dateCompletions.filter(id => id !== habitId);
      } else {
        completions[date] = [...dateCompletions, habitId];
      }
      return { ...prev, habitCompletions: completions };
    });
  };

  const deleteHabitFromRoutine = (routineId: string, habitId: string) => {
    setState(prev => ({
      ...prev,
      routines: prev.routines.map(r => r.id === routineId ? { ...r, habits: r.habits.filter(h => h.id !== habitId) } : r)
    }));
  };

  const setDailyMission = (mission: DailyMission) => setState(prev => ({ ...prev, dailyMission: mission }));
  const completeDailyMission = () => setState(prev => ({ ...prev, dailyMission: prev.dailyMission ? { ...prev.dailyMission, completed: true } : null }));
  const addReward = (reward: string) => setState(prev => ({ ...prev, completedRewards: [...prev.completedRewards, reward] }));
  const resetState = () => setState(INITIAL_STATE);
  const addChatMessage = (msg: ChatMessage) => setState(prev => ({ ...prev, chatHistory: [...prev.chatHistory, msg] }));
  const clearChatHistory = () => setState(prev => ({ ...prev, chatHistory: [] }));
  const setVoice = (voice: string) => setState(prev => ({ ...prev, selectedVoice: voice }));
  const updateUserProfile = (profile: Partial<UserProfile>) => setState(prev => ({ ...prev, userProfile: { ...prev.userProfile, ...profile } }));

  const saveMoodRecord = (date: string, sentimentIds: string[]) => {
    setState(prev => ({
      ...prev,
      moodHistory: {
        ...prev.moodHistory,
        [date]: sentimentIds
      }
    }));
  };

  const setTempMoodSelection = (ids: string[]) => setState(prev => ({ ...prev, tempMoodSelection: ids }));

  return (
    <AppContext.Provider value={{ 
      state, navigate, goBack, setSelectedDate, setMood, addChild, selectChild,
      toggleBreathing, addAgendaItem, updateAgendaItem, deleteAgendaItem, toggleAgendaItemCompletion,
      updateMomSelfCare, addRoutine, deleteRoutine, selectRoutine, addHabitToRoutine, updateHabitInRoutine, registerHabitTemplate, deleteCategory, toggleHabitCompletion, deleteHabitFromRoutine,
      setDailyMission, completeDailyMission, addReward, resetState,
      addChatMessage, clearChatHistory, setVoice, updateUserProfile, saveMoodRecord, setTempMoodSelection
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
