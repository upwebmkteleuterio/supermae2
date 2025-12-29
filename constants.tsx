
import React from 'react';
import { 
  Heart, 
  Calendar, 
  Wind, 
  Sparkles, 
  Zap, 
  Smile
} from 'lucide-react';
import { MoodType, Activity, AgendaItem } from './types';

// PROMPTS DO SISTEMA (Preparado para Área Admin)
export const AI_CONFIG = {
  SYSTEM_INSTRUCTION: `Você é uma mentora especialista em autocuidado e inteligência emocional para mães, especialmente mães de crianças atípicas (TEA, TDAH, etc.). Sua voz é acolhedora, empática, sem julgamentos e prática. 
  Você deve usar as informações contextuais da usuária (perfil, diagnóstico dos filhos, objetivos) para personalizar cada resposta.`,
  
  PROMPTS: {
    // Função auxiliar para injetar contexto
    getContextualPrompt: (mood: MoodType, profile: any) => {
      const base = mood === 'light' 
        ? `Gere 3 atividades de autocuidado para uma mãe exausta que busca LEVEZA.`
        : `Gere 3 atividades de autocuidado para uma mãe que busca FORTALECIMENTO.`;
      
      return `${base}
        DADOS DA MÃE PARA PERSONALIZAÇÃO:
        - Nome: ${profile.name}
        - Objetivo no App: ${profile.welcomingGoal || 'Não informado'}
        - Idade do(s) filho(s): ${profile.childrenAgeGroup || 'Não informada'}
        - Situação de Diagnóstico: ${profile.diagnosisStatus || 'Não informada'}
        - Principais Interesses: ${profile.appInterests?.join(', ') || 'Suporte geral'}

        CRITÉRIOS TÉCNICOS:
        - Duração: ${mood === 'light' ? '1-5 min' : '10-20 min'}
        - Foco: ${mood === 'light' ? 'acolhimento, alívio emocional' : 'reconstrução, expressão profunda'}
        - Formato: JSON array com objetos {id, title, description, duration, type, icon}. 
        - Use ícones representativos em string (ex: 'Smile', 'Heart', 'Music').`;
    },
            
    QUOTE: `Gere uma frase curta (máximo 150 caracteres) de validação e carinho para uma mãe que acabou de concluir atividades de autocuidado. Seja poético e real baseando-se no contexto de maternidade atípica e autocuidado.`
  }
};

export const MOOD_CONFIG: Record<MoodType, { 
  label: string; 
  description: string; 
  color: string; 
  icon: React.ReactNode;
  rewardName: string;
  rewardIcon: string;
}> = {
  light: {
    label: 'Hoje preciso de leveza',
    description: '1-5 min • Acolhimento e alívio',
    color: 'bg-purple-100 border-purple-200 text-purple-700',
    icon: <Sparkles className="w-6 h-6" />,
    rewardName: 'Semente do cuidado plantada',
    rewardIcon: '🌱'
  },
  strong: {
    label: 'Hoje quero me fortalecer',
    description: '10-20 min • Ação e expressão',
    color: 'bg-indigo-100 border-indigo-200 text-indigo-700',
    icon: <Zap className="w-6 h-6" />,
    rewardName: 'Flor de coragem cultivada',
    rewardIcon: '🌸'
  },
  breathe: {
    label: 'Hoje só quero respirar',
    description: 'Pausa consciente • Sem cobrança',
    color: 'bg-teal-100 border-teal-200 text-teal-700',
    icon: <Wind className="w-6 h-6" />,
    rewardName: 'Borboleta do alívio',
    rewardIcon: '🦋'
  }
};

const today = new Date().toISOString().split('T')[0];

export const DEFAULT_CHILD_AGENDA: AgendaItem[] = [
  { id: '1', time: '08:30', title: 'Terapia Ocupacional', category: 'Terapêutico', owner: 'filho', date: today, participantIds: ['1'] },
  { id: '2', time: '10:00', title: 'Estímulo sensorial tátil', category: 'Sensorial', owner: 'filho', date: today, participantIds: ['1'] },
  { id: '3', time: '12:00', title: 'Almoço e rotina alimentar', category: 'Funcional', owner: 'filho', date: today, participantIds: ['1'] },
  { id: '4', time: '15:30', title: 'Brincadeira com bolhas', category: 'Lúdico', owner: 'filho', date: today, participantIds: ['1'] },
  { id: '5', time: '18:00', title: 'Hora da história com a mãe', category: 'Relacional', owner: 'filho', date: today, participantIds: ['1'] }
];

export const MOCK_MOM_ACTIVITIES: Record<MoodType, Activity[]> = {
  light: [],
  strong: [],
  breathe: []
};
