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
  duration: string;
  tasks: RoutineTask[];
}

export const ROUTINE_TEMPLATES: Record<string, RoutineTemplate> = {
  acolhedora: {
    id: 'acolhedora',
    name: 'Abraço de Mãe',
    description: 'Oferecer acolhimento emocional, leveza e pausa gentil.',
    icon: 'Heart',
    duration: '15 a 30 min',
    color: 'bg-purple-100 border-purple-200 text-purple-700',
    tasks: [
      { title: 'Respiração suave e consciente', category: 'autocuidado', priority: 'alta' },
      { title: 'Check-in emocional no app', category: 'emocional', priority: 'alta' },
      { title: 'Escolher uma frase ou áudio de acolhimento', category: 'emocional', priority: 'media' },
      { title: 'Ritual de carinho: chá, pausa, toque, autocuidado leve', category: 'autocuidado', priority: 'media' },
      { title: 'Registrar uma gratidão ou pequena alegria', category: 'emocional', priority: 'baixa' },
      { title: 'Encerrar com uma intenção de gentileza consigo mesma', category: 'emocional', priority: 'media' },
    ]
  },
  energetica: {
    id: 'energetica',
    name: 'Super Mãe em Movimento',
    description: 'Estimular disposição, ação e sensação de força.',
    icon: 'Zap',
    duration: '20 a 40 min',
    color: 'bg-orange-100 border-orange-200 text-orange-700',
    tasks: [
      { title: 'Playlist animada ou áudio motivacional', category: 'emocional', priority: 'media' },
      { title: 'Exercício físico leve ou divertido (dança, alongamento)', category: 'fisico', priority: 'alta' },
      { title: 'Check-in de intenção: o que quero conquistar hoje?', category: 'produtividade', priority: 'alta' },
      { title: 'Planejar 3 tarefas simples e possíveis', category: 'produtividade', priority: 'alta' },
      { title: 'Ritual rápido de autocuidado para despertar energia (banho, roupa, café)', category: 'autocuidado', priority: 'media' },
      { title: 'Mensagem de força e coragem para o dia', category: 'emocional', priority: 'baixa' },
    ]
  }
};