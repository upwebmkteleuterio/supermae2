
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AppState, ViewState, MoodType, Child, Activity, AgendaItem, DailyMission, ChatMessage, UserProfile, Routine, CareTask } from '../types';
import { supabase } from '../lib/supabase';

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
  addChannelMessage: (channelId: string, msg: ChatMessage) => void;
  clearChatHistory: () => void;
  setVoice: (voice: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  persistUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string | null>;
  saveMoodRecord: (date: string, sentimentIds: string[], note?: string) => Promise<boolean>;
  saveChildMoodRecord: (childId: string, date: string, sentimentIds: string[], note?: string) => Promise<boolean>;
  fetchMoodLogs: () => Promise<void>;
  setTempMoodSelection: (ids: string[]) => void;
  setTempMoodNote: (note: string) => void;
  setSelectedChannel: (id: string | null) => void;
  setSelectedCareCategory: (id: string | null) => void;
  setSelectedCareIntensity: (intensity: 'light' | 'strong' | null) => void;
  setCareTasks: (tasks: CareTask[]) => void;
  toggleCareTask: (taskId: string) => void;
  logout: () => Promise<void>;
}

const STORAGE_KEY = 'super_mae_app_state_v28';

const getTodayStr = () => new Date().toLocaleDateString('sv-SE');

const INITIAL_STATE: AppState = {
  isAuthLoading: true,
  isProfileLoading: false,
  isAuthenticated: false,
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
  childMoodHistory: {},
  tempMoodSelection: [],
  tempMoodNote: '',
  selectedRoutineId: null,
  selectedChannelId: null,
  completedRewards: [],
  dailyMission: null,
  chatHistory: [],
  channelMessages: {},
  selectedVoice: 'Kore',
  userProfile: {
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    onboardingCompleted: false,
    hasSeenWelcomeModal: false
  },
  selectedCareCategoryId: null,
  selectedCareIntensity: null,
  careTasks: []
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...JSON.parse(saved), isAuthLoading: true, isProfileLoading: false } : INITIAL_STATE;
  });

  const fetchMoodLogs = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: logs } = await supabase.from('mood_logs').select('*').eq('user_id', user.id);
    if (!logs) return;

    const newMoodHistory: Record<string, string[]> = {};
    const newChildMoodHistory: Record<string, Record<string, string[]>> = {};

    logs.forEach(log => {
      if (log.child_id) {
        if (!newChildMoodHistory[log.child_id]) newChildMoodHistory[log.child_id] = {};
        newChildMoodHistory[log.child_id][log.date] = log.sentiment_ids;
      } else {
        newMoodHistory[log.date] = log.sentiment_ids;
      }
    });

    setState(prev => ({ ...prev, moodHistory: newMoodHistory, childMoodHistory: newChildMoodHistory }));
  }, []);

  const fetchFullProfile = useCallback(async (userId: string) => {
    setState(prev => ({ ...prev, isProfileLoading: true }));
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        setState(prev => ({
          ...prev,
          isProfileLoading: false,
          userProfile: {
            ...prev.userProfile,
            name: profile.name || prev.userProfile.name,
            email: profile.email || prev.userProfile.email,
            phone: profile.phone || prev.userProfile.phone,
            state: profile.state || prev.userProfile.state,
            city: profile.city || prev.userProfile.city,
            avatar: profile.avatar_url || prev.userProfile.avatar,
            welcomingGoal: profile.welcoming_goal || prev.userProfile.welcomingGoal,
            appInterests: profile.app_interests || prev.userProfile.appInterests,
            hasSeenWelcomeModal: profile.has_seen_welcome_modal || false,
            onboardingCompleted: !!profile.welcoming_goal
          }
        }));
        fetchMoodLogs();
      }
    } catch (e) {
      console.error("Erro ao carregar perfil (Background):", e);
    } finally {
      setState(prev => ({ ...prev, isProfileLoading: false }));
    }
  }, [fetchMoodLogs]);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setState(prev => ({ 
          ...prev, 
          isAuthenticated: true, 
          isAuthLoading: false,
          currentPage: prev.currentPage === 'welcome' ? 'home' : prev.currentPage 
        }));
        fetchFullProfile(session.user.id);
      } else {
        setState(prev => ({ ...prev, isAuthLoading: false, isAuthenticated: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setState(prev => ({ 
          ...prev, 
          isAuthenticated: true, 
          isAuthLoading: false,
          currentPage: 'home' 
        }));
        fetchFullProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setState({ ...INITIAL_STATE, isAuthLoading: false });
        localStorage.removeItem(STORAGE_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchFullProfile]);

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
      const updatedCategories = habit.category && !prev.customCategories.includes(habit.category)
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
  const addChannelMessage = (channelId: string, msg: ChatMessage) => setState(prev => ({
    ...prev,
    channelMessages: {
      ...prev.channelMessages,
      [channelId]: [...(prev.channelMessages[channelId] || []), msg]
    }
  }));
  const clearChatHistory = () => setState(prev => ({ ...prev, chatHistory: [] }));
  const setVoice = (voice: string) => setState(prev => ({ ...prev, selectedVoice: voice }));
  
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, userProfile: { ...prev.userProfile, ...profile } }));
  };

  const persistUserProfile = async (profile: Partial<UserProfile>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const updateData: any = {};
    if (profile.name !== undefined) updateData.name = profile.name;
    if (profile.state !== undefined) updateData.state = profile.state;
    if (profile.city !== undefined) updateData.city = profile.city;
    if (profile.avatar !== undefined) updateData.avatar_url = profile.avatar;
    if (profile.welcomingGoal !== undefined) updateData.welcoming_goal = profile.welcomingGoal;
    if (profile.appInterests !== undefined) updateData.app_interests = profile.appInterests;
    if (profile.phone !== undefined) updateData.phone = profile.phone;
    if (profile.hasSeenWelcomeModal !== undefined) updateData.has_seen_welcome_modal = profile.hasSeenWelcomeModal;

    const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);
    if (error) return false;

    updateUserProfile(profile);
    return true;
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
    if (uploadError) return null;
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return publicUrl;
  };

  const saveMoodRecord = async (date: string, sentimentIds: string[], note: string = ''): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Atualização Otimista local
    setState(prev => ({ ...prev, moodHistory: { ...prev.moodHistory, [date]: sentimentIds } }));

    // Tentativa de upsert no banco
    // Removemos o 'onConflict' explícito para deixar o Supabase usar o índice UNIQUE (SQL)
    const { error } = await supabase.from('mood_logs').upsert({
        user_id: user.id, 
        date, 
        sentiment_ids: sentimentIds, 
        note,
        child_id: null 
      });
    
    if (error) {
      console.error("Erro ao salvar no banco:", error);
      return false;
    }
    return true;
  };

  const saveChildMoodRecord = async (childId: string, date: string, sentimentIds: string[], note: string = ''): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Atualização Otimista local
    setState(prev => {
      const childHistory = { ...prev.childMoodHistory };
      if (!childHistory[childId]) childHistory[childId] = {};
      childHistory[childId][date] = sentimentIds;
      return { ...prev, childMoodHistory: childHistory };
    });

    const { error } = await supabase.from('mood_logs').upsert({
        user_id: user.id, 
        child_id: childId, 
        date, 
        sentiment_ids: sentimentIds, 
        note
      });
    
    if (error) {
      console.error("Erro ao salvar humor da criança no banco:", error);
      return false;
    }
    return true;
  };

  const setTempMoodSelection = (ids: string[]) => setState(prev => ({ ...prev, tempMoodSelection: ids }));
  const setTempMoodNote = (note: string) => setState(prev => ({ ...prev, tempMoodNote: note }));
  const setSelectedChannel = (id: string | null) => setState(prev => ({ ...prev, selectedChannelId: id }));
  const setSelectedCareCategory = (id: string | null) => setState(prev => ({ ...prev, selectedCareCategoryId: id }));
  const setSelectedCareIntensity = (intensity: 'light' | 'strong' | null) => setState(prev => ({ ...prev, selectedCareIntensity: intensity }));
  const setCareTasks = (tasks: CareTask[]) => setState(prev => ({ ...prev, careTasks: tasks }));
  const toggleCareTask = (taskId: string) => setState(prev => ({
    ...prev,
    careTasks: prev.careTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
  }));

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContext.Provider value={{ 
      state, navigate, goBack, setSelectedDate, setMood, addChild, selectChild,
      toggleBreathing, addAgendaItem, updateAgendaItem, deleteAgendaItem, toggleAgendaItemCompletion,
      updateMomSelfCare, addRoutine, deleteRoutine, selectRoutine, addHabitToRoutine, updateHabitInRoutine, registerHabitTemplate, deleteCategory, toggleHabitCompletion, deleteHabitFromRoutine,
      setDailyMission, completeDailyMission, addReward, resetState,
      addChatMessage, addChannelMessage, clearChatHistory, setVoice, updateUserProfile, persistUserProfile, uploadAvatar, saveMoodRecord, saveChildMoodRecord, fetchMoodLogs, setTempMoodSelection, setTempMoodNote,
      setSelectedChannel, setSelectedCareCategory, setSelectedCareIntensity, setCareTasks, toggleCareTask, logout
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
