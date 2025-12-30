
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
  { id: 'lonely', label: 'Sozinha', color: '#A89F91', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC31lxZEg3uMiUxrXWAuCjtyeB_GLU0b7dnEoPdS7lC2KVaBcxOHN_Lm3dO2Xo28sik_UNHAvSfXXbZjj8A7MSyQGzIJbrwlQh1l2pwrEn59-XiuIQvXIZ9hSUAenO7ZdaP3syF5pBiYg6K8coTUpu9jGWEJXstLuv1TN0ggeLJGleTl77_ZZYzElbtW5tLhrkmO4BDWd7uanZf4bEz87887K47ZwLYPok5k9wNLWD4Ef_mxGF8gPcje_7_uy0hn4u7K4_3EcfmSs85' },
  { id: 'anxious', label: 'Ansiosa', color: '#E6A27C', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAQSDMzuBhhz58H1TGZ4YqDaPIb1ukCViWFJVVa50Dl1G8Cok55lbKjJnJRTOY9CnMm5ce337DyPQIiINvbit0kYYt4A1oKOiQkafjIjL9bL35YQRBCwePwYTPupgETLoh0BzzYFiXsZyctmFSe2C6TIdsyHkKwLalbXA7HV2AeOBgXJf4WciRBnd_V-qrYHHFergLs22rgp4NJ1ATbpQiVc5xlS1u-JkUC3vatwn6pyA-uHKtIOKr0tULqXwJzKCnTpH5wuV9aVWf' },
  { id: 'proud', label: 'Orgulhosa de mim', color: '#C17F6A', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWz34-uoQzM2doJsOULA8VDkjRKwTRy0pwe9nBPgk0HYQ8RHQOV96Jpl9eMY3SUhuUuyov71uCcUOaE7NT7ZlOQZaxtCTcP7WqrTrV4sFoDg6TuIBSKEAbrH2h0dh7IcMIXbUVxOZaJf_mdaMtT_dtx7zP9gjl1k3zmp8DzXkbJwsmTfPy-pBmm5Sbf1joB_1r84ySVBz2TkLzV8WBQ5LM9lcVb49nRErHVVbIY29SR2llJxYAshWb_zfU8YCVgDMzj8nyJmnfnRvs' },
  { id: 'exhausted', label: 'Exausta', color: '#D9C5B2', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC31lxZEg3uMiUxrXWAuCjtyeB_GLU0b7dnEoPdS7lC2KVaBcxOHN_Lm3dO2Xo28sik_UNHAvSfXXbZjj8A7MSyQGzIJbrwlQh1l2pwrEn59-XiuIQvXIZ9hSUAenO7ZdaP3syF5pBiYg6K8coTUpu9jGWEJXstLuv1TN0ggeLJGleTl77_ZZYzElbtW5tLhrkmO4BDWd7uanZf4bEz87887K47ZwLYPok5k9wNLWD4Ef_mxGF8gPcje_7_uy0hn4u7K4_3EcfmSs85' },
  { id: 'sad', label: 'Triste', color: '#8797A1', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC31lxZEg3uMiUxrXWAuCjtyeB_GLU0b7dnEoPdS7lC2KVaBcxOHN_Lm3dO2Xo28sik_UNHAvSfXXbZjj8A7MSyQGzIJbrwlQh1l2pwrEn59-XiuIQvXIZ9hSUAenO7ZdaP3syF5pBiYg6K8coTUpu9jGWEJXstLuv1TN0ggeLJGleTl77_ZZYzElbtW5tLhrkmO4BDWd7uanZf4bEz87887K47ZwLYPok5k9wNLWD4Ef_mxGF8gPcje_7_uy0hn4u7K4_3EcfmSs85' },
  { id: 'hopeful', label: 'Esperançosa', color: '#D9B371', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWz34-uoQzM2doJsOULA8VDkjRKwTRy0pwe9nBPgk0HYQ8RHQOV96Jpl9eMY3SUhuUuyov71uCcUOaE7NT7ZlOQZaxtCTcP7WqrTrV4sFoDg6TuIBSKEAbrH2h0dh7IcMIXbUVxOZaJf_mdaMtT_dtx7zP9gjl1k3zmp8DzXkbJwsmTfPy-pBmm5Sbf1joB_1r84ySVBz2TkLzV8WBQ5LM9lcVb49nRErHVVbIY29SR2llJxYAshWb_zfU8YCVgDMzj8nyJmnfnRvs' },
  { id: 'guilty', label: 'Culpada', color: '#A67D78', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2u4BG00DWCxWijx1bDJE-NDioh-EUxXAfm7yozAesJMlU_yetRQFY0MoppuzpjQ0zXimgAk0M1snFDBbbBZg7iKj-SUfNlcuVLHux4J9oD1sz7kilaOW6IAlpim1tDPEalpLUy2MV4Q28IOqYrxZrBwyjIiqx-MBKi-dXPZOz7wwv1NsUcH9iLwyVJ1nGgHIK9GtVB9C1hc_pAZFoMKtvncXGGXUYXrtV7gLNtwK_viilyZPttnrqfazaMInHvDaEFsQ_pz9SlziP' },
  { id: 'irritated', label: 'Irritada', color: '#D1A3A4', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2u4BG00DWCxWijx1bDJE-NDioh-EUxXAfm7yozAesJMlU_yetRQFY0MoppuzpjQ0zXimgAk0M1snFDBbbBZg7iKj-SUfNlcuVLHux4J9oD1sz7kilaOW6IAlpim1tDPEalpLUy2MV4Q28IOqYrxZrBwyjIiqx-MBKi-dXPZOz7wwv1NsUcH9iLwyVJ1nGgHIK9GtVB9C1hc_pAZFoMKtvncXGGXUYXrtV7gLNtwK_viilyZPttnrqfazaMInHvDaEFsQ_pz9SlziP' },
  { id: 'happy', label: 'Alegre', color: '#9FB18D', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWz34-uoQzM2doJsOULA8VDkjRKwTRy0pwe9nBPgk0HYQ8RHQOV96Jpl9eMY3SUhuUuyov71uCcUOaE7NT7ZlOQZaxtCTcP7WqrTrV4sFoDg6TuIBSKEAbrH2h0dh7IcMIXbUVxOZaJf_mdaMtT_dtx7zP9gjl1k3zmp8DzXkbJwsmTfPy-pBmm5Sbf1joB_1r84ySVBz2TkLzV8WBQ5LM9lcVb49nRErHVVbIY29SR2llJxYAshWb_zfU8YCVgDMzj8nyJmnfnRvs' },
  { id: 'angry', label: 'Raivosa', color: '#E49B8D', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2u4BG00DWCxWijx1bDJE-NDioh-EUxXAfm7yozAesJMlU_yetRQFY0MoppuzpjQ0zXimgAk0M1snFDBbbBZg7iKj-SUfNlcuVLHux4J9oD1sz7kilaOW6IAlpim1tDPEalpLUy2MV4Q28IOqYrxZrBwyjIiqx-MBKi-dXPZOz7wwv1NsUcH9iLwyVJ1nGgHIK9GtVB9C1hc_pAZFoMKtvncXGGXUYXrtV7gLNtwK_viilyZPttnrqfazaMInHvDaEFsQ_pz9SlziP' },
  { id: 'insecure', label: 'Insegura', color: '#F2A48E', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAQSDMzuBhhz58H1TGZ4YqDaPIb1ukCViWFJVVa50Dl1G8Cok55lbKjJnJRTOY9CnMm5ce337DyPQIiINvbit0kYYt4A1oKOiQkafjIjL9bL35YQRBCwePwYTPupgETLoh0BzzYFiXsZyctmFSe2C6TIdsyHkKwLalbXA7HV2AeOBgXJf4WciRBnd_V-qrYHHFergLs22rgp4NJ1ATbpQiVc5xlS1u-JkUC3vatwn6pyA-uHKtIOKr0tULqXwJzKCnTpH5wuV9aVWf' },
  { id: 'confused', label: 'Confusa', color: '#8DA198', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAQSDMzuBhhz58H1TGZ4YqDaPIb1ukCViWFJVVa50Dl1G8Cok55lbKjJnJRTOY9CnMm5ce337DyPQIiINvbit0kYYt4A1oKOiQkafjIjL9bL35YQRBCwePwYTPupgETLoh0BzzYFiXsZyctmFSe2C6TIdsyHkKwLalbXA7HV2AeOBgXJf4WciRBnd_V-qrYHHFergLs22rgp4NJ1ATbpQiVc5xlS1u-JkUC3vatwn6pyA-uHKtIOKr0tULqXwJzKCnTpH5wuV9aVWf' },
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
