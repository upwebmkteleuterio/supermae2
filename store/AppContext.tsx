
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AppState, ViewState, MoodType, Child, Activity, AgendaItem, DailyMission, ChatMessage, UserProfile, Routine, CareTask, LocalSupportPost, AppNotification } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextProps {
  state: AppState;
  navigate: (page: ViewState) => void;
  goBack: () => void;
  setSelectedDate: (date: string) => void;
  setMood: (mood: MoodType) => void;
  addChild: (child: Child) => Promise<boolean>;
  selectChild: (id: string | null) => void;
  toggleBreathing: (active: boolean) => void;
  addAgendaItem: (item: AgendaItem) => Promise<boolean>;
  updateAgendaItem: (item: AgendaItem) => Promise<boolean>;
  deleteAgendaItem: (id: string) => Promise<boolean>;
  toggleAgendaItemCompletion: (id: string, owner: 'mãe' | 'filho') => Promise<void>;
  updateMomSelfCare: (activities: Activity[]) => void;
  addRoutine: (routine: Routine) => Promise<boolean>;
  deleteRoutine: (id: string) => Promise<boolean>;
  selectRoutine: (id: string | null) => void;
  addHabitToRoutine: (routineId: string, habit: Activity) => Promise<boolean>;
  updateHabitInRoutine: (routineId: string, habit: Activity) => Promise<boolean>;
  registerHabitTemplate: (habit: Activity) => void;
  deleteCategory: (oldCategory: string, migrateToCategory: string) => void;
  toggleHabitCompletion: (routineId: string, habitId: string, date: string) => Promise<void>;
  deleteHabitFromRoutine: (routineId: string, habitId: string) => Promise<boolean>;
  setDailyMission: (mission: DailyMission) => void;
  completeDailyMission: () => void;
  addReward: (reward: string) => void;
  resetState: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  addChannelMessage: (channelId: string, msg: ChatMessage) => void;
  clearChatHistory: () => void;
  setVoice: (voice: string) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  persistUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string | null>;
  uploadMoodPhoto: (file: File) => Promise<string | null>;
  saveMoodRecord: (date: string, sentimentIds: string[], note?: string, photoUrl?: string) => Promise<boolean>;
  saveChildMoodRecord: (childId: string, date: string, sentimentIds: string[], note?: string) => Promise<boolean>;
  fetchMoodLogs: () => Promise<void>;
  fetchChildren: () => Promise<void>;
  fetchAgendaItems: () => Promise<void>;
  fetchRoutines: () => Promise<void>;
  fetchHabitCompletions: () => Promise<void>;
  setTempMoodSelection: (ids: string[]) => void;
  setTempMoodNote: (note: string) => void;
  setTempMoodPhotoUrl: (url: string) => void;
  setSelectedChannel: (id: string | null) => void;
  setSelectedCareCategory: (id: string | null) => void;
  setSelectedCareIntensity: (intensity: 'light' | 'strong' | null) => void;
  setCareTasks: (tasks: CareTask[]) => void;
  toggleCareTask: (taskId: string) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  
  // Logística Comunitária
  fetchLocalSupportPosts: () => Promise<void>;
  createLocalSupportPost: (post: Partial<LocalSupportPost>) => Promise<boolean>;
  updateLocalSupportPost: (postId: string, post: Partial<LocalSupportPost>) => Promise<boolean>;
  deleteLocalSupportPost: (postId: string) => Promise<boolean>;
  markInterestInPost: (post: LocalSupportPost) => Promise<boolean>;
  markPostAsCompleted: (postId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const STORAGE_KEY = 'super_mae_app_state_v31';
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
  routines: [],
  customHabitTemplates: [],
  customCategories: [],
  habitCompletions: {},
  moodHistory: {},
  childMoodHistory: {},
  tempMoodSelection: [],
  tempMoodNote: '',
  tempMoodPhotoUrl: '',
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
    avatar: 'https://images.icon-icons.com/2859/PNG/512/avatar_face_girl_female_woman_profile_smiley_happy_people_icon_181665.png',
    onboardingCompleted: false,
    hasSeenWelcomeModal: false
  },
  selectedCareCategoryId: null,
  selectedCareIntensity: null,
  careTasks: [],
  localSupportPosts: [],
  notifications: []
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

  const fetchChildren = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('children').select('*').eq('parent_id', user.id);
    if (data) {
      setState(prev => ({ ...prev, children: data.map(c => ({
        id: c.id,
        name: c.name,
        birthDate: c.birth_date,
        age: c.birth_date ? `${new Date().getFullYear() - new Date(c.birth_date).getFullYear()} anos` : '?',
        avatar: c.avatar_url || '',
        hasDiagnosis: c.has_diagnosis,
        // Fix: Use diagnosisStatus instead of diagnosis_status (interface vs mapping mismatch)
        diagnosisStatus: c.diagnosis_status
      })) }));
    }
  }, []);

  const fetchAgendaItems = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('agenda_items').select('*').eq('user_id', user.id);
    if (data) {
      const momItems: AgendaItem[] = [];
      const childItems: AgendaItem[] = [];
      data.forEach(item => {
        // Fix: Use participantIds instead of participant_ids (interface vs mapping mismatch)
        const base = { id: item.id, time: item.time.substring(0, 5), title: item.title, date: item.date, category: item.category, participantIds: item.participant_ids, description: item.description, completed: item.completed, reminder: item.reminder };
        if (item.participant_ids.includes('mom')) momItems.push({ ...base, owner: 'mãe' } as AgendaItem);
        item.participant_ids.filter((id: string) => id !== 'mom').forEach((cid: string) => {
          childItems.push({ ...base, owner: 'filho', childId: cid } as AgendaItem);
        });
      });
      setState(prev => ({ ...prev, manualMomAgenda: momItems, manualChildAgenda: childItems }));
    }
  }, []);

  const fetchRoutines = useCallback(async () => {
    console.log("[AppContext] Buscando rotinas...");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("[AppContext] Usuário não autenticado ao buscar rotinas.");
      return;
    }
    const { data: routinesData, error } = await supabase.from('routines').select(`*, habits(*)`).eq('user_id', user.id);
    
    if (error) {
      console.error("[AppContext] Erro ao buscar rotinas:", error);
      return;
    }

    if (routinesData) {
      console.log("[AppContext] Rotinas encontradas no Supabase:", routinesData);
      const mapped: Routine[] = routinesData.map(r => ({
        id: r.id,
        name: r.name,
        subtitle: r.subtitle,
        image: r.image_url,
        icon: r.icon,
        habits: r.habits ? r.habits.map((h: any) => ({
          id: h.id,
          title: h.title,
          description: h.description,
          category: h.category,
          period: h.period,
          reminder: h.reminder,
          repetition: h.repetition,
          customDays: h.custom_days,
          completed: false
        })) : []
      }));
      setState(prev => ({ ...prev, routines: mapped }));
    }
  }, []);

  const fetchHabitCompletions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('habit_logs').select('*').eq('user_id', user.id);
    if (data) {
      const completions: Record<string, string[]> = {};
      data.forEach(log => {
        if (!completions[log.date]) completions[log.date] = [];
        completions[log.date].push(log.habit_id);
      });
      setState(prev => ({ ...prev, habitCompletions: completions }));
    }
  }, []);

  const fetchLocalSupportPosts = useCallback(async () => {
    const { data } = await supabase
      .from('local_support_posts')
      .select('*')
      .eq('status', 'open')
      .order('date_time', { ascending: true });
    if (data) {
      setState(prev => ({ ...prev, localSupportPosts: data.map(p => ({
        id: p.id,
        userId: p.user_id,
        userName: p.user_name,
        userAvatar: p.user_avatar,
        type: p.type,
        category: p.category,
        locationCity: p.location_city,
        locationNeighborhood: p.location_neighborhood,
        destination: p.destination,
        dateTime: p.date_time,
        status: p.status,
        latitude: p.latitude,
        longitude: p.longitude,
        createdAt: p.created_at
      })) }));
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('app_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) {
      setState(prev => ({ ...prev, notifications: data }));
    }
  }, []);

  const fetchFullProfile = useCallback(async (userId: string) => {
    setState(prev => ({ ...prev, isProfileLoading: true }));
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profile) {
        setState(prev => ({
          ...prev,
          isProfileLoading: false,
          selectedVoice: profile.selected_voice || prev.selectedVoice,
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
        await Promise.all([
          fetchMoodLogs(), 
          fetchChildren(), 
          fetchAgendaItems(), 
          fetchRoutines(), 
          fetchHabitCompletions(),
          fetchLocalSupportPosts(),
          fetchNotifications()
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setState(prev => ({ ...prev, isProfileLoading: false }));
    }
  }, [fetchMoodLogs, fetchChildren, fetchAgendaItems, fetchRoutines, fetchHabitCompletions, fetchLocalSupportPosts, fetchNotifications]);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setState(prev => ({ ...prev, isAuthenticated: true, isAuthLoading: false, currentPage: prev.currentPage === 'welcome' ? 'home' : prev.currentPage }));
        fetchFullProfile(session.user.id);
        
        const channel = supabase.channel('app_realtime_v1')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'local_support_posts' }, () => fetchLocalSupportPosts())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'app_notifications', filter: `user_id=eq.${session.user.id}` }, () => fetchNotifications())
          .subscribe();
          
        return () => { supabase.removeChannel(channel); };
      } else {
        setState(prev => ({ ...prev, isAuthLoading: false, isAuthenticated: false }));
      }
    };
    initAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setState(prev => ({ ...prev, isAuthenticated: true, isAuthLoading: false, currentPage: 'home' }));
        fetchFullProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setState({ ...INITIAL_STATE, isAuthLoading: false });
        localStorage.removeItem(STORAGE_KEY);
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchFullProfile, fetchLocalSupportPosts, fetchNotifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const navigate = useCallback((page: ViewState) => setState(prev => ({ ...prev, currentPage: page, navigationStack: [...prev.navigationStack, page] })), []);
  const goBack = useCallback(() => setState(prev => {
    if (prev.navigationStack.length <= 1) return prev;
    const newStack = [...prev.navigationStack];
    newStack.pop();
    return { ...prev, navigationStack: newStack, currentPage: newStack[newStack.length - 1] as ViewState };
  }), []);

  const setSelectedDate = (date: string) => setState(prev => ({ ...prev, selectedDate: date }));
  const setMood = useCallback((mood: MoodType) => setState(prev => ({ ...prev, selectedMood: mood, lastMoodSelectedDate: getTodayStr() })), []);

  const addChild = async (child: Child) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data, error } = await supabase.from('children').insert({ parent_id: user.id, name: child.name, birth_date: child.birthDate, avatar_url: child.avatar, has_diagnosis: child.hasDiagnosis, diagnosis_status: child.diagnosisStatus }).select().single();
    if (error) return false;
    setState(prev => ({ ...prev, children: [...prev.children, { ...child, id: data.id }] }));
    return true;
  };

  const selectChild = (id: string | null) => setState(prev => ({ ...prev, selectedChildId: id }));
  const toggleBreathing = (active: boolean) => setState(prev => ({ ...prev, isBreathingActive: active }));

  const addAgendaItem = async (item: AgendaItem) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    // Fix: Corrected property access to item.participantIds
    const { error } = await supabase.from('agenda_items').insert({ user_id: user.id, title: item.title, time: item.time, date: item.date, category: item.category, participant_ids: item.participantIds, reminder: item.reminder, description: item.description });
    if (error) return false;
    await fetchAgendaItems();
    return true;
  };

  const updateAgendaItem = async (item: AgendaItem) => {
    // Fix: Corrected property access to item.participantIds
    const { error } = await supabase.from('agenda_items').update({ title: item.title, time: item.time, date: item.date, category: item.category, participant_ids: item.participantIds, reminder: item.reminder, description: item.description, completed: item.completed }).eq('id', item.id);
    if (error) return false;
    await fetchAgendaItems();
    return true;
  };

  const deleteAgendaItem = async (id: string) => {
    const { error } = await supabase.from('agenda_items').delete().eq('id', id);
    if (error) return false;
    await fetchAgendaItems();
    return true;
  };

  const toggleAgendaItemCompletion = async (id: string, owner: 'mãe' | 'filho') => {
    const task = [...state.manualMomAgenda, ...state.manualChildAgenda].find(t => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    setState(prev => ({
      ...prev,
      manualMomAgenda: prev.manualMomAgenda.map(i => i.id === id ? { ...i, completed: newCompleted } : i),
      manualChildAgenda: prev.manualChildAgenda.map(i => i.id === id ? { ...i, completed: newCompleted } : i)
    }));
    await supabase.from('agenda_items').update({ completed: newCompleted }).eq('id', id);
  };

  const updateMomSelfCare = (activities: Activity[]) => setState(prev => ({ ...prev, momSelfCareAgenda: activities }));

  const addRoutine = async (routine: Routine) => {
    console.log("[AppContext] Iniciando addRoutine:", routine);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("[AppContext] Usuário não encontrado no addRoutine.");
      return false;
    }
    
    const { data, error } = await supabase.from('routines').insert({ 
      user_id: user.id, 
      name: routine.name, 
      subtitle: routine.subtitle, 
      icon: routine.icon, 
      image_url: routine.image 
    }).select().single();

    if (error) {
      console.error("[AppContext] Erro ao inserir rotina no Supabase:", error);
      return false;
    }

    console.log("[AppContext] Rotina inserida com sucesso:", data);
    await fetchRoutines();
    return true;
  };

  const deleteRoutine = async (id: string) => {
    const { error } = await supabase.from('routines').delete().eq('id', id);
    if (error) return false;
    await fetchRoutines();
    return true;
  };

  const selectRoutine = (id: string | null) => setState(prev => ({ ...prev, selectedRoutineId: id }));

  const addHabitToRoutine = async (routineId: string, habit: Activity) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    // Fix: Corrected property access to habit.customDays
    const { error } = await supabase.from('habits').insert({ routine_id: routineId, user_id: user.id, title: habit.title, description: habit.description, category: habit.category, period: habit.period, reminder: habit.reminder, repetition: habit.repetition, custom_days: habit.customDays });
    if (error) return false;
    await fetchRoutines();
    return true;
  };

  const updateHabitInRoutine = async (routineId: string, habit: Activity) => {
    // Fix: Corrected property access to habit.customDays
    const { error } = await supabase.from('habits').update({ title: habit.title, description: habit.description, category: habit.category, period: habit.period, reminder: habit.reminder, repetition: habit.repetition, custom_days: habit.customDays }).eq('id', habit.id);
    if (error) return false;
    await fetchRoutines();
    return true;
  };

  const registerHabitTemplate = (habit: Activity) => setState(prev => ({ ...prev, customHabitTemplates: [...prev.customHabitTemplates, habit] }));
  const deleteCategory = (oldCategory: string, migrateToCategory: string) => {};

  const toggleHabitCompletion = async (routineId: string, habitId: string, date: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const dateCompletions = state.habitCompletions[date] || [];
    const isCompleted = dateCompletions.includes(habitId);
    setState(prev => {
      const completions = { ...prev.habitCompletions };
      if (isCompleted) completions[date] = dateCompletions.filter(id => id !== habitId);
      else completions[date] = [...dateCompletions, habitId];
      return { ...prev, habitCompletions: completions };
    });
    if (isCompleted) {
      await supabase.from('habit_logs').delete().eq('user_id', user.id).eq('habit_id', habitId).eq('date', date);
    } else {
      await supabase.from('habit_logs').insert({ user_id: user.id, habit_id: habitId, date });
    }
  };

  const deleteHabitFromRoutine = async (routineId: string, habitId: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', habitId);
    if (error) return false;
    await fetchRoutines();
    return true;
  };

  const setDailyMission = (mission: DailyMission) => setState(prev => ({ ...prev, dailyMission: mission }));
  const completeDailyMission = () => setState(prev => ({ ...prev, dailyMission: prev.dailyMission ? { ...prev.dailyMission, completed: true } : null }));
  const addReward = (reward: string) => setState(prev => ({ ...prev, completedRewards: [...prev.completedRewards, reward] }));
  const resetState = () => setState(INITIAL_STATE);
  const addChatMessage = (msg: ChatMessage) => setState(prev => ({ ...prev, chatHistory: [...prev.chatHistory, msg] }));
  const addChannelMessage = (channelId: string, msg: ChatMessage) => setState(prev => ({ ...prev, channelMessages: { ...prev.channelMessages, [channelId]: [...(prev.channelMessages[channelId] || []), msg] } }));
  const clearChatHistory = () => setState(prev => ({ ...prev, chatHistory: [] }));
  
  const setVoice = async (voice: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ selected_voice: voice }).eq('id', user.id);
    }
    setState(prev => ({ ...prev, selectedVoice: voice }));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => setState(prev => ({ ...prev, userProfile: { ...prev.userProfile, ...profile } }));

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

  const uploadMoodPhoto = async (file: File): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('mood_entries').upload(fileName, file);
    if (uploadError) return null;
    const { data: { publicUrl } } = supabase.storage.from('mood_entries').getPublicUrl(fileName);
    return publicUrl;
  };

  const saveMoodRecord = async (date: string, sentimentIds: string[], note: string = '', photoUrl: string = ''): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    setState(prev => ({ 
      ...prev, 
      moodHistory: { ...prev.moodHistory, [date]: sentimentIds },
      tempMoodNote: '',
      tempMoodPhotoUrl: ''
    }));
    const { error } = await supabase.from('mood_logs').upsert({ user_id: user.id, date, sentiment_ids: sentimentIds, note, photo_url: photoUrl, child_id: null });
    return !error;
  };

  const saveChildMoodRecord = async (childId: string, date: string, sentimentIds: string[], note: string = ''): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    setState(prev => {
      const childHistory = { ...prev.childMoodHistory };
      if (!childHistory[childId]) childHistory[childId] = {};
      childHistory[childId][date] = sentimentIds;
      return { ...prev, childMoodHistory: childHistory };
    });
    const { error } = await supabase.from('mood_logs').upsert({ user_id: user.id, child_id: childId, date, sentiment_ids: sentimentIds, note });
    return !error;
  };

  // Logística Comunitária
  const createLocalSupportPost = async (post: Partial<LocalSupportPost>) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return false;
    
    let coords = { lat: null as number | null, lng: null as number | null };
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
      });
      coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e) {
      console.warn("Geolocalização indisponível");
    }

    const { error } = await supabase.from('local_support_posts').insert({
      user_id: authUser.id,
      user_name: state.userProfile.name.split(' ')[0],
      user_avatar: state.userProfile.avatar,
      type: post.type,
      category: post.category,
      location_city: state.userProfile.city,
      location_neighborhood: post.locationNeighborhood || 'Centro',
      destination: post.destination,
      date_time: post.dateTime,
      latitude: coords.lat,
      longitude: coords.lng,
      status: 'open'
    });

    if (error) return false;
    await fetchLocalSupportPosts();
    return true;
  };

  const updateLocalSupportPost = async (postId: string, post: Partial<LocalSupportPost>) => {
    const { error } = await supabase.from('local_support_posts').update({
      type: post.type,
      category: post.category,
      location_neighborhood: post.locationNeighborhood,
      destination: post.destination,
      date_time: post.dateTime
    }).eq('id', postId);
    if (error) return false;
    await fetchLocalSupportPosts();
    return true;
  };

  const deleteLocalSupportPost = async (postId: string) => {
    const { error } = await supabase.from('local_support_posts').delete().eq('id', postId);
    if (error) return false;
    await fetchLocalSupportPosts();
    return true;
  };

  const markInterestInPost = async (post: LocalSupportPost) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return false;

    const { error: notifError } = await supabase.from('app_notifications').insert({
      user_id: post.userId,
      sender_id: authUser.id,
      sender_name: state.userProfile.name.split(' ')[0],
      type: 'support_interest',
      data: { postId: post.id, postTitle: post.destination }
    });

    if (notifError) return false;

    await supabase.from('local_support_posts').update({ status: 'matched' }).eq('id', post.id);
    await fetchLocalSupportPosts();
    return true;
  };

  const markPostAsCompleted = async (postId: string) => {
    await supabase.from('local_support_posts').update({ status: 'completed' }).eq('id', postId);
    await fetchLocalSupportPosts();
  };

  const markNotificationAsRead = async (id: string) => {
    await supabase.from('app_notifications').update({ read: true }).eq('id', id);
    await fetchNotifications();
  };

  const setTempMoodSelection = (ids: string[]) => setState(prev => ({ ...prev, tempMoodSelection: ids }));
  const setTempMoodNote = (note: string) => setState(prev => ({ ...prev, tempMoodNote: note }));
  const setTempMoodPhotoUrl = (url: string) => setState(prev => ({ ...prev, tempMoodPhotoUrl: url }));
  const setSelectedChannel = (id: string | null) => setState(prev => ({ ...prev, selectedChannelId: id }));
  const setSelectedCareCategory = (id: string | null) => setState(prev => ({ ...prev, selectedCareCategoryId: id }));
  const setSelectedCareIntensity = (intensity: 'light' | 'strong' | null) => setState(prev => ({ ...prev, selectedCareIntensity: intensity }));
  const setCareTasks = (tasks: CareTask[]) => setState(prev => ({ ...prev, careTasks: tasks }));
  const toggleCareTask = (taskId: string) => setState(prev => ({ ...prev, careTasks: prev.careTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }));

  const logout = async () => { await supabase.auth.signOut(); };

  const deleteAccount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase.from('profiles').delete().eq('id', user.id);
    if (error) return false;
    await logout();
    return true;
  };

  return (
    <AppContext.Provider value={{ 
      state, navigate, goBack, setSelectedDate, setMood, addChild, selectChild,
      toggleBreathing, addAgendaItem, updateAgendaItem, deleteAgendaItem, toggleAgendaItemCompletion,
      updateMomSelfCare, addRoutine, deleteRoutine, selectRoutine, addHabitToRoutine, updateHabitInRoutine, registerHabitTemplate, deleteCategory, toggleHabitCompletion, deleteHabitFromRoutine,
      setDailyMission, completeDailyMission, addReward, resetState,
      addChatMessage, addChannelMessage, clearChatHistory, setVoice, updateUserProfile, persistUserProfile, uploadAvatar, uploadMoodPhoto, saveMoodRecord, saveChildMoodRecord, fetchMoodLogs, fetchChildren, fetchAgendaItems, fetchRoutines, fetchHabitCompletions, setTempMoodSelection, setTempMoodNote, setTempMoodPhotoUrl,
      setSelectedChannel, setSelectedCareCategory, setSelectedCareIntensity, setCareTasks, toggleCareTask, logout, deleteAccount,
      fetchLocalSupportPosts, createLocalSupportPost, updateLocalSupportPost, deleteLocalSupportPost, markInterestInPost, markPostAsCompleted, fetchNotifications, markNotificationAsRead
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
