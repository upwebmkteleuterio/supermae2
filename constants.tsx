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

export const SENTIMENTS = [
  { id: 'lonely', label: 'Sozinha', color: '#A89F91', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-4h2N0fRw1WrzB5vTIEc00ifNh9ppzO11dwIzyo-3Bx3yUkdNzzUSr7I67URP-lAyBPCShpTdFCiWgIz87RbUX7yKcq3b8YSKEoPi26B2FYKFe0o_oVNhGsL7ylNblIjIX_KPJRmrR314DkXHi3Haz4R0q5XbW0U3U3tQ3Dr5nOSNJBTlGzM3aQbFxCg74N2nsEc86JViVGZ6agwpunN266MnKQbxb44Zp-TISdzMnkwjU22k3mhZf0yDKBUSkOVA_DOFDoZ7HayV' },
  { id: 'anxious', label: 'Ansiosa', color: '#E6A27C', img: 'dyad-media://media/supermae/.dyad/media/cf5a9a3e5c4d3f360e898c90d2b83d05.png' },
  { id: 'proud', label: 'Orgulhosa de mim', color: '#C17F6A', img: 'dyad-media://media/supermae/.dyad/media/0ab924faf20558e9b74a5fc1c6db1f8d.png' },
  { id: 'exhausted', label: 'Exausta', color: '#D9C5B2', img: 'dyad-media://media/supermae/.dyad/media/88a07fec26955688eac1e90b1e1592fa.png' },
  { id: 'sad', label: 'Triste', color: '#8797A1', img: 'dyad-media://media/supermae/.dyad/media/a3f497c900d5c34c45eb45b87f4bb2e4.png' },
  { id: 'hopeful', label: 'Esperançosa', color: '#D9B371', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDRVSlh-pGM0Q-UlfA0dpTyZ2MDuwda9d3WA8er8TabrU5W9DcfoZaMpuTYevXNCUanxTOG4LaDJwS1yGPrMs_G4uStXch_Y_0R-1YkyN77jszD1BEe_nuxTnMFg98duYRxB1oeyJFl6MiWEWRpUITwCOqZgij1-3yqKM43V4l2YjUEBpt7HvqRqLP4fd5ot0nTRP1cqEM0TvUi4VGpcEYh3HDztY0NJbtq-lSQHxYscp9D3t1gvx-KRNNxsVH4n3r-f9ERYfUT3p_' },
  { id: 'guilty', label: 'Culpada', color: '#A67D78', img: 'dyad-media://media/supermae/.dyad/media/ff2d2c452057772b77bc0eff3e3f7ff3.png' },
  { id: 'irritated', label: 'Irritada', color: '#D1A3A4', img: 'dyad-media://media/supermae/.dyad/media/8a96c0dacfe8e57a09e759ae38526f14.png' },
  { id: 'happy', label: 'Alegre', color: '#9FB18D', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNfUAkigUEk8-Daom1kD65SkI9TfNzKv84d3OrejI-Vb1PhDDtTT0PAI8sj1UgahI592Aa0IpR1wG0ImYcgubd5yXCr6Rr-ntC41uErZGjb_1mL2qtgx_Hyh1mtnTp0GvT7IE7XPgLaKjBNas007lR3pEhZvOVRktjlq5Bev8AfFBn9qiLWDN4pUk5YZvw_iiReioSNJq_F8o1_HW8drIwULfx0sF5e23sGhTOX_BoAeg4as4yd18T3ULenDwWnau-xpV5arKFUvfR' },
  { id: 'angry', label: 'Raivosa', color: '#E49B8D', img: 'dyad-media://media/supermae/.dyad/media/1f4d5cf1392585f7cc534b4e99ac8eac.png' },
  { id: 'insecure', label: 'Insegura', color: '#F2A48E', img: 'dyad-media://media/supermae/.dyad/media/41a3219d0c69ccd12b29b0f18da81dce.png' },
  { id: 'confused', label: 'Confusa', color: '#8DA198', img: 'dyad-media://media/supermae/.dyad/media/e1c441ad1bb49bac96f76bca814ba819.png' },
  { id: 'supported', label: 'Amparada', color: '#B8A2C1', img: 'dyad-media://media/supermae/.dyad/media/54ea87e97ca1a4b8b7d2dd85fb3de987.png' },
  { id: 'euphoric', label: 'Eufórica', color: '#F5D142', img: 'dyad-media://media/supermae/.dyad/media/bf8470488f3900ca1e85c9a710a511f9.png' },
  { id: 'grateful', label: 'Grata', color: '#8DBB94', img: 'dyad-media://media/supermae/.dyad/media/cb0e39305737bb945e47c45b9405b3bd.png' },
  { id: 'secure', label: 'Segura', color: '#5DA1B3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDRVSlh-pGM0Q-UlfA0dpTyZ2MDuwda9d3WA8er8TabrU5W9DcfoZaMpuTYevXNCUanxTOG4LaDJwS1yGPrMs_G4uStXch_Y_0R-1YkyN77jszD1BEe_nuxTnMFg98duYRxB1oeyJFl6MiWEWRpUITwCOqZgij1-3yqKM43V4l2YjUEBpt7HvqRqLP4fd5ot0nTRP1cqEM0TvUi4VGpcEYh3HDztY0NJbtq-lSQHxYscp9D3t1gvx-KRNNxsVH4n3r-f9ERYfUT3p_' },
  { id: 'calm', label: 'Calma', color: '#A2C1B8', img: 'dyad-media://media/supermae/.dyad/media/67026d772792f72a0554c8bc9d1292f2.png' },
  { id: 'enthusiastic', label: 'Entusiasmada', color: '#F28C38', img: 'dyad-media://media/supermae/.dyad/media/7831750cc5481ddac696ac19a1a6abba.png' },
  { id: 'inspired', label: 'Inspirada', color: '#9B8DF2', img: 'dyad-media://media/supermae/.dyad/media/225996c25bf28b7a5d679d26b8320d67.png' },
  { id: 'frustrated', label: 'Frustrada', color: '#A18D8D', img: 'dyad-media://media/supermae/.dyad/media/20920ea250522b292f15f94d5dfb0cb0.png' },
];

export const SENTIMENTS_CHILD = [
  { id: 'c_calm', label: 'Calmo', color: '#88D8B0', img: 'dyad-media://media/supermae/.dyad/media/7a6db03fa043dd0221e6f581beb3a54d.png' },
  { id: 'c_agitated', label: 'Agitado', color: '#FFCC5C', img: 'dyad-media://media/supermae/.dyad/media/6fb9c4aa633e53721aa07303d529eb1d.png' },
  { id: 'c_crisis', label: 'Em crise', color: '#FF6B6B', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIA3nwjU2Bemu39ZPyjzDBz0svXWddxleKO-DHJUfGhpEhQH9eDp8o5TjDacocMekOIEG4956K4dHX8X4lPa2OGuORTluQdx3v6eTJ10qkxOVwPtihv5p2SdKxdzQfn7SCOi3ErdBXLsm21hvr4VbBOldGnvVEWVGsnLb9Mxv_SRHuflG6jLzr1tshwps0Jy8QeiTPCYwCOE8Ice6t0ih04k20xspCSxR2g0D07ZbM4zdX7VSvnwlFont5Y0C5dRLO0wVZJvc29XSU' },
  { id: 'c_support', label: 'Precisa de suporte', color: '#45B7D1', img: 'dyad-media://media/supermae/.dyad/media/0079082d03f333ee2a42a6d6b500bcb0.png' },
  { id: 'c_hyperactive', label: 'Hiperativo', color: '#96CEB4', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNHOZAeS6utEJPcGjxGh0qD5buA3KlSRWS-bKKKzTmqi4gnB5xR7L_Z83vqKt7jRxea-kVPEWrdGLKVDPl2yig2KkZvyLd3suHVEBIzBZOHQ7ENdH4-zulk8eEnoNt8r12-0J7wHnFJb8rSwZFmDq7jM5nTlyCjxlA0IoA9UgOp3lkNKxjJRKPTpAgXYnQ49wcSmvCkc6PeS0r7pCGnJbK7YwQ0Dlpz4iEssujZ8hlOoKnjuD8bV7HdDB6HDcBpeeDIWrqiUVfkeYe' },
  { id: 'c_aggressive', label: 'Agressivo', color: '#D9534F', img: 'dyad-media://media/supermae/.dyad/media/6b8a5f229d41c94a3e50499204358b77.png' },
  { id: 'c_crying', label: 'Choroso', color: '#77A1D3', img: 'dyad-media://media/supermae/.dyad/media/5b2ef5af1909c783a77632c412e635e6.png' },
  { id: 'c_stable', label: 'Estável', color: '#BEEB9F', img: 'dyad-media://media/supermae/.dyad/media/36ab49e856921205591b99ecdf66a942.png' },
  { id: 'c_exhausted', label: 'Exausto', color: '#D6D6D6', img: 'dyad-media://media/supermae/.dyad/media/0ae38c84a093850243224c7d69e49c0b.png' },
  { id: 'c_affectionate', label: 'Afetuoso', color: '#F7CAC9', img: 'dyad-media://media/supermae/.dyad/media/1061a2d9838636aa090df005dcf45ce7.png' },
  { id: 'c_anxious', label: 'Ansioso', color: '#FBCBC9', img: 'dyad-media://media/supermae/.dyad/media/1ff87ac89f41cfc6e3b8d14a3d0781e3.png' },
  { id: 'c_isolated', label: 'Isolado', color: '#C5CBE3', img: 'dyad-media://media/supermae/.dyad/media/32238ccfbf02363499509a5bfd907273.png' },
];

export const AI_CONFIG = {
  SYSTEM_INSTRUCTION: `Você é uma mentora especialista em autocuidado e inteligência emocional para mães, especialmente mães de crianças atípicas (TEA, TDAH, etc.). Sua voz é acolhedora, empática, sem julgamentos e prática. 
  Você deve usar as informações contextuais da usuária (perfil, diagnóstico dos filhos, objetivos) para personalizar cada resposta.`,
  
  PROMPTS: {
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