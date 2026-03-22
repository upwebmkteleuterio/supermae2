import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { Plus, ArrowLeft, ChevronRight, Check, X, Bell, Clock, Calendar as CalendarIcon, ChevronDown, Tag, AlertCircle } from 'lucide-react';
import { Activity } from '../types';

const MOM_CATEGORIES = [
  "Saúde emocional",
  "Corpo e bem-estar físico",
  "Relações e rede de apoio",
  "Organização e vida prática",
  "Criatividade e leveza",
  "Espiritualidade e auto conexão",
  "Propósito e realização pessoal",
  "Tempo para si"
];

const CHILD_CATEGORIES = [
  "Cuidado Terapêutico",
  "Cuidado Sensorial",
  "Cuidado Comunicacional",
  "Cuidado Lúdico e Afetivo",
  "Cuidado Médico e Funcional",
  "Cuidado de Autonomia e Rotina",
  "Cuidado Relacional com a Mãe",
  "Cuidado Educacional"
];

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const REPETITION_OPTIONS = ["Todos os dias", "Segunda a sexta", "Sábado e Domingo", "Personalizar"];

const CATEGORY_COLORS: Record<string, string> = {
  // Mãe
  "Saúde emocional": "bg-pink-50/50",
  "Corpo e bem-estar físico": "bg-green-50/50",
  "Relações e rede de apoio": "bg-indigo-50/50",
  "Organização e vida prática": "bg-amber-50/50",
  "Criatividade e leveza": "bg-yellow-50/50",
  "Espiritualidade e auto conexão": "bg-blue-50/50",
  "Propósito e realização pessoal": "bg-purple-50/50",
  "Tempo para si": "bg-rose-50/50",
  // Filho
  "Cuidado Terapêutico": "bg-blue-50/50",
  "Cuidado Sensorial": "bg-purple-50/50",
  "Cuidado Comunicacional": "bg-teal-50/50",
  "Cuidado Lúdico e Afetivo": "bg-pink-50/50",
  "Cuidado Médico e Funcional": "bg-amber-50/50",
  "Cuidado de Autonomia e Rotina": "bg-emerald-50/50",
  "Cuidado Relacional com a Mãe": "bg-rose-50/50",
  "Cuidado Educacional": "bg-indigo-50/50"
};

const MOM_PRESET_HABITS: Activity[] = [
  // Saúde Emocional
  { id: 'se1', title: 'Fazer check-in emocional no app', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se2', title: 'Escolher uma frase de acolhimento para o dia', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se3', title: 'Respirar fundo três vezes com presença', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se4', title: 'Registrar uma emoção no diário do app', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se5', title: 'Nomear o que está sentindo sem tentar resolver', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se6', title: 'Escrever livremente por dois minutos sobre como foi o dia', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se7', title: 'Usar o recurso “Respiro” quando se sentir sobrecarregada', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se8', title: 'Ouvir um áudio afetivo do app', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se9', title: 'Fazer uma pausa consciente antes de reagir', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se10', title: 'Validar a própria emoção dizendo: “faz sentido eu me sentir assim”', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se11', title: 'Praticar autocompaixão com uma mensagem para si mesma', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se12', title: 'Identificar um gatilho emocional do dia', description: '', duration: '', completed: false, category: 'Saúde emocional' },
  { id: 'se13', title: 'Escolher uma ação pequena de autocuidado emocional', description: '', duration: '', completed: false, category: 'Saúde emocional' },

  // Corpo e Bem-estar Físico
  { id: 'cb1', title: 'Beber um copo de água com intenção', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb2', title: 'Alongar pescoço e ombros por alguns minutos', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb3', title: 'Fazer uma caminhada ou atividade física preferida', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb4', title: 'Dormir um pouco mais cedo ou tirar um cochilo sem culpa', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb5', title: 'Comer algo nutritivo com calma', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb6', title: 'Passar um hidratante como gesto de carinho em si', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb7', title: 'Tomar um banho relaxante e consciente', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb8', title: 'Respirar ao ar livre por alguns minutos', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb9', title: 'Cuidar do cabelo ou da pele com atenção', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb10', title: 'Fazer uma pausa para descansar o corpo', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb11', title: 'Reduzir um pouco o tempo de tela antes de dormir', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },
  { id: 'cb12', title: 'Sentar-se com postura confortável e relaxar a mandíbula', description: '', duration: '', completed: false, category: 'Corpo e bem-estar físico' },

  // Relações e Rede de Apoio
  { id: 'rr1', title: 'Enviar um “oi” para uma amiga de confiança', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr2', title: 'Desabafar anonimamente em canal seguro do app', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr3', title: 'Aceitar ajuda em algo simples', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr4', title: 'Pedir uma troca ou ajuda a outra mãe', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr5', title: 'Agendar atendimento com psicóloga', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr6', title: 'Dizer “não” a algo que te sobrecarregaria', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr7', title: 'Conversar com alguém sobre como você está', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr8', title: 'Agradecer alguém que te ajudou', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr9', title: 'Fazer um convite para um café ou conversa', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr10', title: 'Participar de um grupo de apoio no app', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },
  { id: 'rr11', title: 'Permitir que alguém cuide de você por alguns minutos', description: '', duration: '', completed: false, category: 'Relações e rede de apoio' },

  // Organização e Vida Prática
  { id: 'ov1', title: 'Tirar uma tarefa da lista do dia sem culpa', description: '', duration: '', completed: false, category: 'Organização e vida prática' },
  { id: 'ov2', title: 'Planejar apenas três prioridades reais', description: '', duration: '', completed: false, category: 'Organização e vida prática' },
  { id: 'ov3', title: 'Criar uma lista de “não precisa ser hoje”', description: '', duration: '', completed: false, category: 'Organização e vida prática' },
  { id: 'ov4', title: 'Organizar um pequeno canto que te acalma', description: '', duration: '', completed: false, category: 'Organização e vida prática' },
  { id: 'ov5', title: 'Preparar algo simples para facilitar o dia seguinte', description: '', duration: '', completed: false, category: 'Organização e vida prática' },
  { id: 'ov6', title: 'Delegar uma tarefa possível', description: '', duration: '', completed: false, category: 'Organização e vida prática' },
  { id: 'ov7', title: 'Desistir de uma cobrança desnecessária', description: '', duration: '', completed: false, category: 'Organização e vida prática' },
  { id: 'ov8', title: 'Organizar documentos ou agenda por poucos minutos', description: '', duration: '', completed: false, category: 'Organização e vida prática' },
  { id: 'ov9', title: 'Ajustar expectativas do dia para algo mais leve', description: '', duration: '', completed: false, category: 'Organização e vida prática' },

  // Criatividade e Leveza
  { id: 'cl1', title: 'Ouvir uma música que gosta enquanto faz algo', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },
  { id: 'cl2', title: 'Escrever por alguns minutos só por expressão', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },
  { id: 'cl3', title: 'Desenhar ou brincar com os filhos sem se preocupar com resultado', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },
  { id: 'cl4', title: 'Dançar sozinha por uma música', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },
  { id: 'cl5', title: 'Assistir a algo leve e divertido', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },
  { id: 'cl6', title: 'Tirar uma foto de algo bonito do dia', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },
  { id: 'cl7', title: 'Fazer um hobby por alguns minutos', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },
  { id: 'cl8', title: 'Colorir, rabiscar ou criar algo simples', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },
  { id: 'cl9', title: 'Rir de propósito com algo que te diverte', description: '', duration: '', completed: false, category: 'Criatividade e leveza' },

  // Espiritualidade e auto conexão
  { id: 'ea1', title: 'Ficar em silêncio por alguns minutos', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },
  { id: 'ea2', title: 'Fazer uma oração ou gesto simbólico', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },
  { id: 'ea3', title: 'Olhar para o céu e agradecer por algo', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },
  { id: 'ea4', title: 'Repetir um mantra acolhedor', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },
  { id: 'ea5', title: 'Escrever uma intenção para o dia no app', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },
  { id: 'ea6', title: 'Meditar ou ouvir uma meditação guiada', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },
  { id: 'ea7', title: 'Acender uma vela ou criar um momento ritual', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },
  { id: 'ea8', title: 'Respirar com as mãos no coração', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },
  { id: 'ea9', title: 'Conectar-se with algo que te dê esperança', description: '', duration: '', completed: false, category: 'Espiritualidade e auto conexão' },

  // Propósito e realização pessoal
  { id: 'pr1', title: 'Lembrar de um sonho antigo sem cobrança', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },
  { id: 'pr2', title: 'Dar um pequeno passo em algo que deseja', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },
  { id: 'pr3', title: 'Celebrar uma pequena conquista do dia', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },
  { id: 'pr4', title: 'Ler uma página de um livro inspirador', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },
  { id: 'pr5', title: 'Dizer a si mesma: “eu também sou alguém além de mãe”', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },
  { id: 'pr6', title: 'Escrever uma carta para si no futuro', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },
  { id: 'pr7', title: 'Aprender algo novo, mesmo que por minutos', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },
  { id: 'pr8', title: 'Pensar em um projeto pessoal com carinho', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },
  { id: 'pr9', title: 'Registrar no app algo que te fez sentir orgulho', description: '', duration: '', completed: false, category: 'Propósito e realização pessoal' },

  // Tempo para si
  { id: 'ts1', title: 'Fazer um combinado com os filhos para ter um momento só seu', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts2', title: 'Encontrar alguém que te faz bem', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts3', title: 'Tomar café ou chá sem fazer nada ao mesmo tempo', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts4', title: 'Não fazer nada por um minuto inteiro', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts5', title: 'Escolher algo que VOCÊ quer fazer hoje', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts6', title: 'Deixar uma tarefa para amanhã e respirar', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts7', title: 'Assistir algo sozinha e sem culpa', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts8', title: 'Ficar em silêncio sem precisar produzir', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts9', title: 'Criar um pequeno ritual só seu', description: '', duration: '', completed: false, category: 'Tempo para si' },
  { id: 'ts10', title: 'Dizer “agora é meu momento” e se permitir', description: '', duration: '', completed: false, category: 'Tempo para si' },
];

const CHILD_PRESET_HABITS: Activity[] = [
  // Cuidado Terapêutico
  { id: 'ct1', title: 'Terapia Ocupacional', category: 'Cuidado Terapêutico', completed: false, description: '', duration: '' },
  { id: 'ct2', title: 'Psicoterapia ou ABA', category: 'Cuidado Terapêutico', completed: false, description: '', duration: '' },
  { id: 'ct3', title: 'Fisioterapia motora', category: 'Cuidado Terapêutico', completed: false, description: '', duration: '' },
  { id: 'ct4', title: 'Sessões de Fonoaudiologia', category: 'Cuidado Terapêutico', completed: false, description: '', duration: '' },
  { id: 'ct5', title: 'Musicoterapia ou terapia aquática', category: 'Cuidado Terapêutico', completed: false, description: '', duration: '' },
  { id: 'ct6', title: 'Registro de evolução nas terapias (diário)', category: 'Cuidado Terapêutico', completed: false, description: '', duration: '' },
  
  // Cuidado Sensorial
  { id: 'cs1', title: 'Brincadeiras sensoriais', category: 'Cuidado Sensorial', completed: false, description: '', duration: '' },
  { id: 'cs2', title: 'Estratégias calmantes (cantinho, fone)', category: 'Cuidado Sensorial', completed: false, description: '', duration: '' },
  { id: 'cs3', title: 'Trilha auditiva calmante', category: 'Cuidado Sensorial', completed: false, description: '', duration: '' },
  { id: 'cs4', title: 'Calendário de sinais de crises', category: 'Cuidado Sensorial', completed: false, description: '', duration: '' },
  { id: 'cs5', title: 'Planejamento de estímulos (luz/som)', category: 'Cuidado Sensorial', completed: false, description: '', duration: '' },

  // Cuidado Comunicacional
  { id: 'cc1', title: 'Prática de nomeação de sentimentos', category: 'Cuidado Comunicacional', completed: false, description: '', duration: '' },
  { id: 'cc2', title: 'Uso de comunicação alternativa (PECS)', category: 'Cuidado Comunicacional', completed: false, description: '', duration: '' },
  { id: 'cc3', title: 'Brincadeiras de turno (esperar/ouvir)', category: 'Cuidado Comunicacional', completed: false, description: '', duration: '' },
  { id: 'cc4', title: 'Registro de novas palavras/gestos', category: 'Cuidado Comunicacional', completed: false, description: '', duration: '' },
  { id: 'cc5', title: 'Interações dirigidas com familiares', category: 'Cuidado Comunicacional', completed: false, description: '', duration: '' },

  // Cuidado Lúdico e Afetivo
  { id: 'cl1_f', title: 'Tempo livre com objeto favorito', category: 'Cuidado Lúdico e Afetivo', completed: false, description: '', duration: '' },
  { id: 'cl2_f', title: 'Atividades de prazer não terapêuticas', category: 'Cuidado Lúdico e Afetivo', completed: false, description: '', duration: '' },
  { id: 'cl3_f', title: 'Ritual do sono com massagem/história', category: 'Cuidado Lúdico e Afetivo', completed: false, description: '', duration: '' },
  { id: 'cl4_f', title: 'Sessão de abraço ou toque profundo', category: 'Cuidado Lúdico e Afetivo', completed: false, description: '', duration: '' },
  { id: 'cl5_f', title: 'Trilha emocional (acalmar)', category: 'Cuidado Lúdico e Afetivo', completed: false, description: '', duration: '' },

  // Cuidado Médico e Funcional
  { id: 'cm1', title: 'Registro de sintomas e crises', category: 'Cuidado Médico e Funcional', completed: false, description: '', duration: '' },
  { id: 'cm2', title: 'Controle de medicações', category: 'Cuidado Médico e Funcional', completed: false, description: '', duration: '' },
  { id: 'cm3', title: 'Agenda de consultas e exames', category: 'Cuidado Médico e Funcional', completed: false, description: '', duration: '' },
  { id: 'cm4', title: 'Checklists de rotina (sono/alimentação)', category: 'Cuidado Médico e Funcional', completed: false, description: '', duration: '' },
  { id: 'cm5', title: 'Diário de dores ou desconfortos', category: 'Cuidado Médico e Funcional', completed: false, description: '', duration: '' },

  // Cuidado de Autonomia e Rotina
  { id: 'ca1', title: 'Participação em escolhas simples', category: 'Cuidado de Autonomia e Rotina', completed: false, description: '', duration: '' },
  { id: 'ca2', title: 'Estímulo à autonomia na higiene', category: 'Cuidado de Autonomia e Rotina', completed: false, description: '', duration: '' },
  { id: 'ca3', title: 'Agenda visual de rotinas', category: 'Cuidado de Autonomia e Rotina', completed: false, description: '', duration: '' },
  { id: 'ca4', title: 'Reforço positivo para tarefas', category: 'Cuidado de Autonomia e Rotina', completed: false, description: '', duration: '' },
  { id: 'ca5', title: 'Diário de conquistas', category: 'Cuidado de Autonomia e Rotina', completed: false, description: '', duration: '' },

  // Cuidado Relacional com a Mãe
  { id: 'cr1', title: 'Registro de momentos positivos', category: 'Cuidado Relacional com a Mãe', completed: false, description: '', duration: '' },
  { id: 'cr2', title: 'Atividades de conexão (respirar juntos)', category: 'Cuidado Relacional com a Mãe', completed: false, description: '', duration: '' },
  { id: 'cr3', title: 'Trilha de vínculo (música/toque)', category: 'Cuidado Relacional com a Mãe', completed: false, description: '', duration: '' },
  { id: 'cr4', title: 'Registro de frases/gestos marcantes', category: 'Cuidado Relacional com a Mãe', completed: false, description: '', duration: '' },
  { id: 'cr5', title: 'Momentos de pausa conjunta', category: 'Cuidado Relacional com a Mãe', completed: false, description: '', duration: '' },

  // Cuidado Educacional
  { id: 'ce1', title: 'Acompanhamento do PEI', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce2', title: 'Reuniões com professores/coordenação', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce3', title: 'Registro de adaptações curriculares', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce4', title: 'Solicitação de mediador', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce5', title: 'Monitoramento de inclusão escolar', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce6', title: 'Registro de sobrecarga ou exclusão', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce7', title: 'Diário de evolução escolar', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce8', title: 'Planejamento de tarefas adaptadas', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce9', title: 'Comunicação escola-terapeutas', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce10', title: 'Checklist de direitos educacionais', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce11', title: 'Preparação para avaliações e eventos', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
  { id: 'ce12', title: 'Plano de transição escolar', category: 'Cuidado Educacional', completed: false, description: '', duration: '' },
];

export const HabitSelection: React.FC = () => {
  const { state, goBack, addHabitToRoutine, registerHabitTemplate, deleteCategory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showConfigModal, setShowConfigModal] = useState<Activity | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [migrateTo, setMigrateTo] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Identifica se estamos em uma rotina de filho
  const currentRoutine = state.routines.find(r => r.id === state.selectedRoutineId);
  const isChildRoutine = !!currentRoutine?.child_id;

  const activeCategories = isChildRoutine ? CHILD_CATEGORIES : MOM_CATEGORIES;
  const activePresetHabits = isChildRoutine ? CHILD_PRESET_HABITS : MOM_PRESET_HABITS;

  const dynamicCategories = useMemo(() => {
    // Custom categories apply only to the context they were created in (by logic, though here they are global)
    // For simplicity, we show them as extra categories
    const set = new Set([...activeCategories, ...state.customCategories]);
    return ["Todos", ...Array.from(set)];
  }, [state.customCategories, activeCategories]);

  const allAvailableHabits = useMemo(() => {
    return [...activePresetHabits, ...state.customHabitTemplates];
  }, [state.customHabitTemplates, activePresetHabits]);

  const [habitPeriod, setHabitPeriod] = useState<'Manhã' | 'Tarde' | 'Noite' | 'A qualquer momento'>('A qualquer momento');
  const [habitReminder, setHabitReminder] = useState(false);
  const [repetition, setRepetition] = useState("Todos os dias");
  const [customDays, setCustomDays] = useState<number[]>([]);

  const [customHabitName, setCustomHabitName] = useState('');
  const [customHabitCat, setCustomHabitCat] = useState(activeCategories[0]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredHabits = selectedCategory === "Todos" 
    ? allAvailableHabits 
    : allAvailableHabits.filter(h => h.category === selectedCategory);

  const handleAddHabit = () => {
    if (!showConfigModal || !state.selectedRoutineId) return;

    const newHabit: Activity = {
      ...showConfigModal,
      id: Math.random().toString(36).substr(2, 9),
      period: habitPeriod,
      reminder: habitReminder,
      repetition: repetition,
      customDays: repetition === 'Personalizar' ? customDays : undefined,
      completed: false
    };

    addHabitToRoutine(state.selectedRoutineId, newHabit);
    registerHabitTemplate(showConfigModal);
    setShowConfigModal(null);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2000);
  };

  const handleCreateCustom = () => {
    if (!customHabitName.trim()) return;
    const finalCategory = isNewCategory ? newCategoryName : customHabitCat;
    if (!finalCategory.trim()) return;

    const customHabit: Activity = {
      id: 'custom-' + Math.random(),
      title: customHabitName,
      description: '',
      duration: '',
      completed: false,
      category: finalCategory
    };
    
    setShowCustomModal(false);
    setShowConfigModal(customHabit);
    setCustomHabitName('');
    setNewCategoryName('');
    setIsNewCategory(false);
  };

  const handleDeleteCategory = () => {
    if (!showDeleteModal || !migrateTo) return;
    deleteCategory(showDeleteModal, migrateTo);
    if (selectedCategory === showDeleteModal) setSelectedCategory("Todos");
    setShowDeleteModal(null);
    setMigrateTo('');
  };

  const toggleDay = (dayIdx: number) => {
    setCustomDays(prev => prev.includes(dayIdx) ? prev.filter(d => d !== dayIdx) : [...prev, dayIdx]);
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-6">
        <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Escolha o hábito</h1>
            <p className="text-[10px] font-bold text-purple-400">{isChildRoutine ? 'Rotina do Filho' : 'Sua Rotina'}</p>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 pb-32">
        <button 
          onClick={() => setShowCustomModal(true)}
          className="w-full bg-white rounded-[2rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all mb-8 group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-slate-700 font-bold text-sm">Criar um hábito personalizado</span>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-300" />
        </button>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 -mx-6 px-6">
          {dynamicCategories.map(cat => {
            const isCustom = !activeCategories.includes(cat) && cat !== "Todos";
            return (
              <div key={cat} className="relative group/pill">
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                    ? 'bg-purple-600 text-white shadow-md border-transparent' 
                    : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
                {isCustom && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowDeleteModal(cat); }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/pill:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {dynamicCategories.filter(c => c !== "Todos").map(cat => {
            const habits = filteredHabits.filter(h => h.category === cat);
            if (habits.length === 0 && selectedCategory !== "Todos" && selectedCategory !== cat) return null;
            if (habits.length === 0 && selectedCategory === "Todos") return null;

            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center justify-between ml-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{cat}</h4>
                </div>
                <div className="space-y-3">
                  {habits.map(h => (
                    <div 
                      key={h.id}
                      className={`flex items-center justify-between p-4 rounded-[1.5rem] transition-all shadow-sm border border-slate-50 ${CATEGORY_COLORS[cat] || 'bg-slate-50/50'}`}
                    >
                      <span className="text-slate-700 font-bold text-xs flex-1 pr-4">{h.title}</span>
                      <button 
                        onClick={() => setShowConfigModal(h)}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-purple-400 shadow-sm active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {successMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl z-[200] flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check className="w-4 h-4" /> <span className="text-xs font-bold">Hábito adicionado!</span>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Excluir Categoria?</h3>
            <p className="text-sm text-slate-500 text-center mb-6 px-2">
              Para não perdermos seus hábitos de <span className="font-bold text-red-500">"{showDeleteModal}"</span>, selecione uma nova categoria para migrá-los:
            </p>

            <div className="space-y-4">
              <div className="relative">
                <select 
                  value={migrateTo}
                  onChange={(e) => setMigrateTo(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600 focus:ring-2 ring-purple-500/20 outline-none shadow-sm"
                >
                  <option value="">Selecionar destino...</option>
                  {dynamicCategories.filter(c => c !== "Todos" && c !== showDeleteModal).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              </div>

              <button 
                disabled={!migrateTo}
                onClick={handleDeleteCategory}
                className="w-full bg-red-500 text-white py-4 rounded-full font-bold shadow-lg shadow-red-100 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-30"
              >
                Migrar e Excluir
              </button>
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfigModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto no-scrollbar max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Configurar Hábito</h3>
              <button onClick={() => setShowConfigModal(null)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>
            <div className="bg-slate-50 rounded-[2rem] p-6 text-center mb-8 border border-slate-100">
               <span className="text-slate-700 font-bold text-sm leading-tight block">{showConfigModal.title}</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400"><Bell className="w-5 h-5" /></div>
                  <span className="text-slate-700 font-bold text-sm">Lembrete</span>
                </div>
                <div onClick={() => setHabitReminder(!habitReminder)} className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${habitReminder ? 'bg-purple-600' : 'bg-slate-100'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${habitReminder ? 'translate-x-6' : 'translate-x-0'}`}></div></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400"><Clock className="w-5 h-5" /></div><span className="text-slate-700 font-bold text-sm">Quando</span></div>
                <div className="relative">
                  <select value={habitPeriod} onChange={(e: any) => setHabitPeriod(e.target.value)} className="appearance-none bg-slate-50 text-slate-500 font-bold text-[11px] pr-12 pl-6 py-3 rounded-2xl border border-slate-100 outline-none min-w-[170px] text-right">
                    <option value="A qualquer momento">A qualquer momento</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400"><CalendarIcon className="w-5 h-5" /></div><span className="text-slate-700 font-bold text-sm">Repetição</span></div>
                  <div className="relative">
                    <select value={repetition} onChange={(e) => setRepetition(e.target.value)} className="appearance-none bg-slate-50 text-slate-500 font-bold text-[11px] pr-12 pl-6 py-3 rounded-2xl border border-slate-100 outline-none min-w-[170px] text-right">
                      {REPETITION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                  </div>
                </div>
                {repetition === 'Personalizar' && (
                  <div className="flex justify-between gap-1 py-2">
                    {WEEK_DAYS.map((day, idx) => (
                      <button key={idx} onClick={() => toggleDay(idx)} className={`w-9 h-9 rounded-full text-[10px] font-black border-2 transition-all ${customDays.includes(idx) ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-300'}`}>{day}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleAddHabit} className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-purple-100 mt-12 active:scale-95 transition-all text-xs uppercase tracking-widest">Adicionar ao dia</button>
          </div>
        </div>
      )}

      {showCustomModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Hábito Personalizado</h3>
              <button onClick={() => setShowCustomModal(false)} className="p-1 text-slate-300"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Hábito</label>
                <input type="text" autoFocus value={customHabitName} onChange={(e) => setCustomHabitName(e.target.value)} placeholder="Ex: Meditação Guiada" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 focus:ring-2 ring-purple-500/20 outline-none font-bold text-slate-700 text-sm placeholder:text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Categoria</label>
                <div className="flex flex-col gap-3">
                  {!isNewCategory ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <select value={customHabitCat} onChange={(e) => setCustomHabitCat(e.target.value)} className="w-full appearance-none bg-white border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600 focus:ring-2 ring-purple-500/20 outline-none shadow-sm">
                          {activeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                      </div>
                      <button onClick={() => setIsNewCategory(true)} className="text-xs font-black text-purple-600 uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"><Plus className="w-3 h-3" /> Criar nova categoria</button>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="relative">
                        <input type="text" autoFocus value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome da categoria..." className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600 focus:ring-2 ring-purple-500/20 outline-none shadow-sm pr-10" />
                        <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      </div>
                      <button onClick={() => setIsNewCategory(false)} className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"><X className="w-3 h-3" /> Usar categoria existente</button>
                    </div>
                  )}
                </div>
              </div>
              <button disabled={!customHabitName.trim() || (isNewCategory && !newCategoryName.trim())} onClick={handleCreateCustom} className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 mt-4 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-30">Continuar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};