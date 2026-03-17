export interface RoutineTask {
  title: string;
  category: 'emocional' | 'autocuidado' | 'fisico' | 'produtividade';
  description?: string;
  priority: 'baixa' | 'media' | 'alta';
}

export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tasks: RoutineTask[];
}

export const ROUTINE_TEMPLATES: Record<string, RoutineTemplate> = {
  acolhedora: {
    id: 'acolhedora',
    name: 'Abraço de Mãe',
    description: 'Foco em acolhimento emocional e pausa.',
    icon: 'Heart',
    color: 'bg-purple-100 border-purple-200 text-purple-700',
    tasks: [
      { title: 'Respiração suave e consciente (5 min)', category: 'autocuidado', priority: 'alta' },
      { title: 'Check-in emocional no Super Mãe', category: 'emocional', priority: 'media' },
      { title: 'Meditação guiada curta', category: 'autocuidado', priority: 'media' },
      { title: 'Escrita terapêutica (Diário)', category: 'emocional', priority: 'baixa' },
      { title: 'Banho relaxante ou chá quente', category: 'autocuidado', priority: 'media' },
      { title: 'Leitura leve antes de dormir', category: 'autocuidado', priority: 'baixa' },
    ]
  },
  energetica: {
    id: 'energetica',
    name: 'Super Mãe em Movimento',
    description: 'Foco em energia, corpo e organização.',
    icon: 'Zap',
    color: 'bg-orange-100 border-orange-200 text-orange-700',
    tasks: [
      { title: 'Alongamento matinal (10 min)', category: 'fisico', priority: 'alta' },
      { title: 'Organização rápida do ambiente', category: 'produtividade', priority: 'media' },
      { title: 'Caminhada ou exercício rápido', category: 'fisico', priority: 'media' },
      { title: 'Definir as 3 prioridades do dia', category: 'produtividade', priority: 'alta' },
      { title: 'Hidratação consciente (garrafa d\'água)', category: 'fisico', priority: 'media' },
      { title: 'Revisão do dia e gratidão', category: 'produtividade', priority: 'baixa' },
    ]
  }
};