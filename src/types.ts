export interface UserProfile {
  id: string;
  name: string;
  role: 'mae' | 'cuidador';
  child_name?: string;
  avatar_url?: string;
}

export interface CareCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  leve: string[];
  forca: string[];
}

export type ChildRecordType = 'humor' | 'progresso' | 'alerta' | 'medicacao' | 'conquista';

export interface ChildMoodRecord {
  id: string;
  date: string;
  mood: string; // "otimo", "bem", "agitado", "crise"
  type: ChildRecordType;
  category?: string; // Terapeutico, Sensorial, etc.
  note: string;
  medication_name?: string;
  dosage?: string;
  is_milestone?: boolean; // Para "Conquistas"
}

export interface RoutineTask {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  time?: string;
}

export interface AppState {
  user: UserProfile | null;
  children_count: number;
  child_mood_history: ChildMoodRecord[];
  routine_tasks: RoutineTask[];
  currentPage: string;
}