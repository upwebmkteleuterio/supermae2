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
  { id: 'anxious', label: 'Ansiosa', color: '#E6A27C', img: '/sentiments/mom/Ansiosa.png' },
  { id: 'proud', label: 'Orgulhosa de mim', color: '#C17F6A', img: '/sentiments/mom/Orgulhosa de si mesma.png' },
  { id: 'exhausted', label: 'Exausta', color: '#D9C5B2', img: '/sentiments/mom/Exausta.png' },
  { id: 'sad', label: 'Triste', color: '#8797A1', img: '/sentiments/mom/Triste.png' },
  { id: 'hopeful', label: 'Esperançosa', color: '#D9B371', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDRVSlh-pGM0Q-UlfA0dpTyZ2MDuwda9d3WA8er8TabrU5W9DcfoZaMpuTYevXNCUanxTOG4LaDJwS1yGPrMs_G4uStXch_Y_0R-1YkyN77jszD1BEe_nuxTnMFg98duYRxB1oeyJFl6MiWEWRpUITwCOqZgij1-3yqKM43V4l2YjUEBpt7HvqRqLP4fd5ot0nTRP1cqEM0TvUi4VGpcEYh3HDztY0NJbtq-lSQHxYscp9D3t1gvx-KRNNxsVH4n3r-f9ERYfUT3p_' },
  { id: 'guilty', label: 'Culpada', color: '#A67D78', img: '/sentiments/mom/Culpada.png' },
  { id: 'irritated', label: 'Irritada', color: '#D1A3A4', img: '/sentiments/mom/Irritada.png' },
  { id: 'happy', label: 'Alegre', color: '#9FB18D', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNfUAkigUEk8-Daom1kD65SkI9TfNzKv84d3OrejI-Vb1PhDDtTT0PAI8sj1UgahI592Aa0IpR1wG0ImYcgubd5yXCr6Rr-ntC41uErZGjb_1mL2qtgx_Hyh1mtnTp0GvT7IE7XPgLaKjBNas007lR3pEhZvOVRktjlq5Bev8AfFBn9qiLWDN4pUk5YZvw_iiReioSNJq_F8o1_HW8drIwULfx0sF5e23sGhTOX_BoAeg4as4yd18T3ULenDwWnau-xpV5arKFUvfR' },
  { id: 'angry', label: 'Raivosa', color: '#E49B8D', img: '/sentiments/mom/Raivosa.png' },
  { id: 'insecure', label: 'Insegura', color: '#F2A48E', img: '/sentiments/mom/Insegura.png' },
  { id: 'confused', label: 'Confusa', color: '#8DA198', img: '/sentiments/mom/Confusa.png' },
  { id: 'supported', label: 'Amparada', color: '#B8A2C1', img: '/sentiments/mom/Amparada.png' },
  { id: 'euphoric', label: 'Eufórica', color: '#F5D142', img: '/sentiments/mom/Euforica.png' },
  { id: 'grateful', label: 'Grata', color: '#8DBB94', img: '/sentiments/mom/Grata.png' },
  { id: 'secure', label: 'Segura', color: '#5DA1B3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDRVSlh-pGM0Q-UlfA0dpTyZ2MDuwda9d3WA8er8TabrU5W9DcfoZaMpuTYevXNCUanxTOG4LaDJwS1yGPrMs_G4uStXch_Y_0R-1YkyN77jszD1BEe_nuxTnMFg98duYRxB1oeyJFl6MiWEWRpUITwCOqZgij1-3yqKM43V4l2YjUEBpt7HvqRqLP4fd5ot0nTRP1cqEM0TvUi4VGpcEYh3HDztY0NJbtq-lSQHxYscp9D3t1gvx-KRNNxsVH4n3r-f9ERYfUT3p_' },
  { id: 'calm', label: 'Calma', color: '#A2C1B8', img: '/sentiments/mom/Calma.png' },
  { id: 'enthusiastic', label: 'Entusiasmada', color: '#F28C38', img: '/sentiments/mom/Entusiasmada.png' },
  { id: 'inspired', label: 'Inspirada', color: '#9B8DF2', img: '/sentiments/mom/Inspirada.png' },
  { id: 'frustrated', label: 'Frustrada', color: '#A18D8D', img: '/sentiments/mom/Frustrada.png' },
];

export const SENTIMENTS_CHILD = [
  { id: 'c_calm', label: 'Calmo', color: '#88D8B0', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_KFv_oT_wj6En1w6OgAdUdkgbAwBQGb40CMcfeON07pcGkaVf6ZCq7YlJStB_74t8iI4HiTtK9pKW4S6ZOZTHYEwKOVIncKmReB3xE44uRBdGMkhiYtAOHjlHvRvT7TyL5lUngMsZF1E6HJqyN4e8jviY4968-SJn_fPdF6lBJhhx_-dnCFovm-qpbPTPUGk8CCeDsrWwg2cbbGX19NQNehd_iI5rDSCkAyZsCrPQHcRV4v3QPmupVgpmfHAJAZj0blcN0Qucetyg' },
  { id: 'c_agitated', label: 'Agitado', color: '#FFCC5C', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaoRoTGnbqY4ibttjRxaZWswQ6KmTJocdSG_VsI6XiINoPhvahI8-7wyzgX-ltw8XSOIJq556-LAmDYkVY13WjgvXvUU8zKGGpJAAbmu_Jn5tWHRk3T4KwAkiVE-9LYrMeabsTuwNxzcq5fggRJGUa-dYbWj2UbGTnTRpqLDH8cYEAie0GtaaNs8PWLIQe8VjanIc9FeQ0uEdbluDmFrI7_7MOM4CtvdpZ_7ELVZ8HYpIvjelrZ0PxDwwk67eUzJlCF6CD5OtQBxi7' },
  { id: 'c_crisis', label: 'Em crise', color: '#FF6B6B', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIA3nwjU2Bemu39ZPyjzDBz0svXWddxleKO-DHJUfGhpEhQH9eDp8o5TjDacocMekOIEG4956K4dHX8X4lPa2OGuORTluQdx3v6eTJ10qkxOVwPtihv5p2SdKxdzQfn7SCOi3ErdBXLsm21hvr4VbBOldGnvVEWVGsnLb9Mxv_SRHuflG6jLzr1tshwps0Jy8QeiTPCYwCOE8Ice6t0ih04k20xspCSxR2g0D07ZbM4zdX7VSvnwlFont5Y0C5dRLO0wVZJvc29XSU' },
  { id: 'c_support', label: 'Precisa de suporte', color: '#45B7D1', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbgx5kF3eCe_AdhVyLIV_GkFOLYe6hr2XeNeLPenMP1kBhZA_WchmfRHyjzuuzCm7v7GvKpp2lHqUHULVdOmrLW1VkEtx-eZvD2picNfpmHIfwI8FXwnvIHCqe300KJVS__7QCFs55jagxiAtQMqkWG_UEcRvn7tpaPlRs_7W5lOnOzSK_SFsjGAPOJQ2gasvVFkIaOU7YXEB7YJZjgXAhiIukCKlIsZlmj0P-s5VS5DclfymZohGfW1EbexAga2JI-_BLo4YWHOH' },
  { id: 'c_hyperactive', label: 'Hiperativo', color: '#96CEB4', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNHOZAeS6utEJPcGjxGh0qD5buA3KlSRWS-bKKKzTmqi4gnB5xR7L_Z83vqKt7jRxea-kVPEWrdGLKVDPl2yig2KkZvyLd3suHVEBIzBZOHQ7ENdH4-zulk8eEnoNt8r12-0J7wHnFJb8rSwZFmDq7jM5nTlyCjxlA0IoA9UgOp3lkNKxjJRKPTpAgXYnQ49wcSmvCkc6PeS0r7pCGnJbK7YwQ0Dlpz4iEssujZ8hlOoKnjuD8bV7HdDB6HDcBpeeDIWrqiUVfkeYe' },
  { id: 'c_aggressive', label: 'Agressivo', color: '#D9534F', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZzaMcPVw47jVDiDj3B9wPPVbSXphBqEZHEqQWpQuF-u0gyJFBsqJQKPEtfaCugZtZldyaHyTsguvnS1cWo3qx0DcKSbmnOovaUIU_odmjHAwtYB_AaK0-CI6Beq8MRcnIP9wcxiqyovSLYPO26JOS7fvVMALa2DJtCv-xuEvOHKSe9hHuMnvxN7BnSF6oDMxnU3l6OICnDerKmIIqYMRTho7aQE2ymBRBv_QHkUFyWFeCSZABB6CLhCcn1sDRSCTJFaaf9K9uXbXy' },
  { id: 'c_crying', label: 'Choroso', color: '#77A1D3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD60Aejz-JdjN2tdmvC330KNYJnsSr2fBpCVwwfS2Wze0hRR1heIvGpF0yVgwo2RwwNO5QjKVbmHF7HMW6tPr5Y5J_5IdfqDR-GoETs2xEhY93zAykZLDBHydl9e0YHwz4sbDeKmsWVC9CKDVu-SMa7PGoqzIYaOr6qdIxQzqLcZUJygC7yYjOzvGIrAoD67tDLL67_85GSEHoa-uYXDk_ThY112TNXLU3N0DaqkH7N829wCN9LCqcMg6ABEcH10iUaYxNi9FobIUqq' },
  { id: 'c_stable', label: 'Estável', color: '#BEEB9F', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_k1Qm8TxS9djOIJAXoSiLttAckSAActl5yO3fD0id6YdUucHuthNGULqk2hI1ihsvJXEB_NO9uz73TQvxY79TJuquYzEUZmwL0OzLkRcjAQsbMEJlYIahE8WHcQ_m6JU3hpo2j9DRvRue5UD8iS4_sNFL1ycl7rIVMPnxW4p_JQJOIw3-MxHgqDMu_QeN2eFENt9O47YVVkRBdMXeXflnIOr-xoIF-kpQglx1HEWQASK46tGy0VdgH8e22OyCv-vChqFqP3S1v-sU' },
  { id: 'c_exhausted', label: 'Exausto', color: '#D6D6D6', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7NQMelH1D0elSD8JZQJ9BMx66dLWuX-zN0Z1RXwZYKgSGcc-IwBU9wdq3rqyf58yjNh97V-O-ZcYXWcOR1eru_3c3CTbMZ5g-zDUYSOWPZHAWVru7u84MZaKfkw3SI-XKeQsVRFyPUglAZSKxu6XKLoiZqUhoUVCnRJ4CFoj8NeAHcf3UZk35CP4QzkW22v4EIG9hqYR4J2NHzlEFcI_CKaTDEhVbjGh0uF5ommD7lvUDjvagqIgGwqG1qq_0bIgIzYDH5-kxgYwB' },
  { id: 'c_affectionate', label: 'Afetuoso', color: '#F7CAC9', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXMIl5-c-TBTfccZ0chtnDyKmC1MgA-ggPKPHZpx1-3weWOnBcmpwJ5VKz0SODE7sEoDj78VO9LsEJOWye_ey7LhXB-dSyDoqUqqDWoyfCuJgKBzndtdkDUV51CPJGty5f32PHZrIeNSDEkiDSjxa9gQ7VfzTsQ0HhFK1m5-WstOgL0ejALGV1gigukNujSFM_Quoj4euHDdS_kgO_lf5URBlK3UP9bHdVShQiH_9JQXGNI8dkMKlcEHiMhfpY738BZXvtIqEX9sK2' },
  { id: 'c_anxious', label: 'Ansioso', color: '#FBCBC9', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTVOxGQXd43w9d3JIgBMksBqLG2oIvQXOTYn0zd4kWfsHNeTg3LoRrVe-EjPy_2sNjlz6W5pdtovnBzpQ38LfweDmZt8lciKo3a6jgLQitXdcoFO994_x5GRZYgmv5OBoc8SgGJWXOoNHZXv0sgGUbYOt2KbpUE-NvGfpLIanWSjayGOx8j_wjRGcnB4HnKVWgAdOC2MDdsX1uzTNEO4jqkBEbjd_uYvygC9U8YE0UgQYWqkcEvyBwK5K02Qhhi2anhn5Sc4fOfOSf' },
  { id: 'c_isolated', label: 'Isolado', color: '#C5CBE3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgcjfvqJQ2nAFdCe6uFQxqL9Dw7SJjxcs_-Yb2QntYGatd-O66yUq96PwsnJTQDD3Fy4k2NdXy5ckYjaRNna0itHI_3NmxNftIVfoXesK7GAGiUod7o2LiYiXfVqyOKosCenRXNjjMeC_3KaSXsipHecT2-p43OrlEHjrNOZJB2GM3T_aE-LzyLoeLGYS9pPD-v2KEV-gVcmEu6RCJBpd87unRu74wAizZTYM_FRbHrKy8Ai7EfJ_3Lo0W4B1z5DswRKEf6BNl2HZX' },
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