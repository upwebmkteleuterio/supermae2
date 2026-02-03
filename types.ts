
export type MoodType = 'light' | 'strong' | 'breathe';

export type ViewState = 
  | 'welcome'
  | 'onboarding'
  | 'home' 
  | 'self_care_selection' 
  | 'mood_diary'
  | 'mood_selection'
  | 'mom_mood_challenge'
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
  | 'payment_selection'
  | 'local_support_mural'
  | 'notifications_list';

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
  customDays?: number[]; 
}

export interface Child {
  id: string;
  name: string;
  birthDate: string;
  age: string;
  avatar: string;
  hasDiagnosis: boolean;
  diagnosisStatus: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  date: string;
  category: string;
  owner: 'mãe' | 'filho';
  childId?: string;
  participantIds?: string[];
  completed?: boolean;
  reminder?: boolean;
  description?: string;
}

export interface Routine {
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  icon?: string;
  habits: Activity[];
}

export interface CareTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface DailyMission {
  id: string;
  title: string;
  reward: string;
  completed: boolean;
}

export interface LocalSupportPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'offer' | 'request';
  category: 'carona' | 'apoio_geral';
  locationCity: string;
  locationNeighborhood: string;
  destination: string;
  dateTime: string;
  status: 'open' | 'matched' | 'completed';
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  sender_id: string;
  sender_name: string;
  type: 'support_interest' | 'system';
  data: {
    postId?: string;
    postTitle?: string;
    message?: string;
  };
  read: boolean;
  created_at: string;
}

export interface AppState {
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  isAuthenticated: boolean;
  currentPage: ViewState;
  navigationStack: string[];
  selectedDate: string;
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
  tempMoodPhotoUrl: string;
  selectedRoutineId: string | null;
  selectedChannelId: string | null;
  completedRewards: string[];
  dailyMission: DailyMission | null;
  chatHistory: ChatMessage[];
  channelMessages: Record<string, ChatMessage[]>;
  selectedVoice: string;
  userProfile: UserProfile;
  selectedCareCategoryId: string | null;
  selectedCareIntensity: 'light' | 'strong' | null;
  careTasks: CareTask[];
  localSupportPosts: LocalSupportPost[];
  notifications: AppNotification[];
}
