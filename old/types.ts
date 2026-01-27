
export type MoodType = 'light' | 'strong' | 'breathe';

export type ViewState = 
  | 'welcome'
  | 'onboarding'
  | 'home' 
  | 'self_care_selection' 
  | 'mood_diary'
  | 'mood_selection'
  | 'mood_result'
  | 'mom_self_care' 
  | 'mom_agenda' 
  | 'children_selection' 
  | 'add_child' 
  | 'child_agenda' 
  | 'integrated_agenda' 
  | 'breathing_exercise' 
  | 'sentiment_analysis' 
  | 'settings' 
  | 'personal_data' 
  | 'care_agenda'
  | 'routines_list'
  | 'routine_detail'
  | 'habit_selection'
  | 'mood_diary_selection'
  | 'child_mood_children_selection'
  | 'child_mood_diary'
  | 'child_mood_selection'
  | 'child_mood_challenge'
  | 'child_mood_result'
  | 'mood_dashboard'
  | 'channels_list'
  | 'channel_chat'
  | 'care_instances_target'
  | 'care_instances_list'
  | 'care_instances_intensity'
  | 'care_instances_tasks'
  | 'subscription_plans'
  | 'payment_selection';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  avatar: string;
  welcomingGoal?: string;
  childrenAgeGroup?: string;
  diagnosisStatus?: string;
  appInterests?: string[];
  onboardingCompleted?: boolean;
  hasSeenWelcomeModal?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  type?: string;
  icon?: string;
  completed: boolean;
  period?: 'Manhã' | 'Tarde' | 'Noite' | 'A qualquer momento';
  category?: string;
  reminder?: boolean;
  repetition?: string;
  customDays?: number[]; // 0-6 (Sun-Sat)
}

export interface Routine {
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  icon?: string;
  habits: Activity[];
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'Terapêutico' | 'Sensorial' | 'Funcional' | 'Lúdico' | 'Relacional' | 'Cuidado' | 'Outros';
  owner: 'mãe' | 'filho';
  childId?: string;
  participantIds: string[]; // ['mom', 'childId1', ...]
  description?: string;
  completed?: boolean;
  days?: string[];
  reminder?: boolean;
}

export interface Child {
  id: string;
  name: string;
  birthDate: string; // DD/MM/AAAA
  age: string;
  avatar: string;
  hasDiagnosis: boolean;
  diagnosisStatus: string;
}

export interface DailyMission {
  text: string;
  completed: boolean;
  date: string;
  moodAtTime: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  senderName?: string;
  senderAvatar?: string;
}

export interface CareTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface AppState {
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  isAuthenticated: boolean;
  currentPage: ViewState;
  navigationStack: string[];
  selectedDate: string; // YYYY-MM-DD
  selectedMood: MoodType | null;
  lastMoodSelectedDate: string | null;
  children: Child[];
  selectedChildId: string | null;
  isBreathingActive: boolean;
  isSilentMode: boolean;
  momSelfCareAgenda: Activity[];
  manualMomAgenda: AgendaItem[];
  manualChildAgenda: AgendaItem[];
  routines: Routine[];
  customHabitTemplates: Activity[]; 
  customCategories: string[]; 
  habitCompletions: Record<string, string[]>; 
  moodHistory: Record<string, string[]>; 
  childMoodHistory: Record<string, Record<string, string[]>>; 
  tempMoodSelection: string[]; 
  tempMoodNote: string; 
  selectedRoutineId: null | string;
  selectedChannelId: null | string;
  completedRewards: string[];
  dailyMission: DailyMission | null;
  chatHistory: ChatMessage[];
  channelMessages: Record<string, ChatMessage[]>;
  selectedVoice: string;
  userProfile: UserProfile;
  selectedCareCategoryId: string | null;
  selectedCareIntensity: 'light' | 'strong' | null;
  careTasks: CareTask[];
}
