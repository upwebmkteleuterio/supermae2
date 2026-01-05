// Build: Force Refresh 1.0.1
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { HeartCheckbox } from '../components/HeartCheckbox';
import { CareCompletionModal } from '../components/CareCompletionModal';
import { 
  ArrowLeft, 
  User, 
  Baby, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const INSTANCE_DATA: Record<string, {
  title: string;
  subtitle: string;
  image: string;
  leve: string[];
  forca: string[];
}> = {
  "1": {
    title: "Sentir sem culpa",
    subtitle: "Cuidado Emocional",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMiW-sfydHWg_qwqC41ua9bztKtz2iyDSMjKzMP5zmeIovE6XsfOC06MYFO7Q8cwbIqkd0jvVyiGC2wMDX4C7_uy4EMpmRSmy8JK7TfCXx_49CWhOQ2BYBwp-dc58mYwxI3MQq0hB7D595Qy4vK9ybQjDoVRTo-2HA9H6yRV8IU1_AAr8J3TXKy63QHFCPVyYmAkzXKc8Dm9xJ8U5c7ZFj4vPA69ORT9cxvqZAjUaj1tmCx9ur5CX5nTk_ZVU8Giz8HXvEHc3KAXd9",
    leve: ["Faça uma visualização guiada", "Escreva um poema inspirador", "Pratique auto-massagem facial", "Crie um kit emocional"],
    forca: ["Pratique journaling emocional", "Participe de terapia em grupo", "Exercícios de mindfulness", "Crie um ritual de despedida"]
  },
  "2": {
    title: "Meu corpo, meu ritmo",
    subtitle: "Bem-estar Físico",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSDb2WEZVkNkt-8zd1DHEEK-16OIUXSgdxxB8SXy0ukTTwr6EYsb_zbnF7vJOfGgovx7x6yPoa1lIWn0VFZX_ruZV4Q_c1XRyZ424BILSXqktCt1aPjmKiozcXKWt9YKL3aZNiU3X80OiVnqYpv_DIwA2aT5EPVDpw843iebd5gdj85VBEyDPuSrdnDgXT6lmLr7kPomqSruQofLJBrAmnW8qS-juEq7tbnlEDpfC4VuJ519nU_RKjOIrMZ04isUcPqPhyWwIhst4i",
    leve: ["Exercícios de respiração", "Autoalongamento", "Tome sol por 10 min", "Hidrate-se bem"],
    forca: ["Circuito funcional em casa", "Sessão de pilates", "Aula de dança online", "Meditação ativa"]
  }
};

export const CareInstancesFlow: React.FC = () => {
  const { state, navigate, goBack } = useApp();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<'light' | 'strong' | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const getHeaderTitle = () => {
    if (state.currentPage === 'care_instances_target') return "Para quem é o cuidado?";
    if (state.currentPage === 'care_instances_list') return "Instâncias de cuidados";
    if (state.currentPage === 'care_instances_intensity') return "Intensidade";
    return "Minhas tarefas";
  };

  const handleSelectIntensity = (intensity: 'light' | 'strong') => {
    setSelectedIntensity(intensity);
    const data = INSTANCE_DATA[selectedCatId || "1"];
    const rawTasks = intensity === 'light' ? data.leve : data.forca;
    setTasks(rawTasks.map((t, idx) => ({ id: `t-${idx}`, text: t, completed: false })));
    navigate('care_instances_tasks');
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const renderTargetSelection = () => (
    <div className="px-6 space-y-4 pt-4">
      <TargetCard icon={<User className="w-8 h-8" />} title="Para mim" description="Seu bem-estar em foco." onClick={() => navigate('care_instances_list')} />
      <TargetCard icon={<Baby className="w-8 h-8" />} title="Para meu filho" description="Desenvolvimento e calma." onClick={() => navigate('care_agenda')} />
    </div>
  );

  const renderCategoryList = () => (
    <div className="px-5 space-y-4 pb-20">
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-start gap-4 mb-4 mx-1">
        <Info className="w-5 h-5 text-purple-500 shrink-0" />
        <p className="text-slate-500 text-[11px] leading-relaxed font-medium">Escolha uma opção para receber recomendações personalizadas.</p>
      </div>
      {Object.entries(INSTANCE_DATA).map(([id, item]) => (
        <InstanceCard key={id} image={item.image} title={item.title} subtitle={item.subtitle} onClick={() => { setSelectedCatId(id); navigate('care_instances_intensity'); }} />
      ))}
    </div>
  );

  const renderIntensitySelection = () => (
    <div className="px-6 space-y-6 pt-10 text-center">
      <h2 className="text-xl font-bold text-slate-800">Como está sua energia hoje?</h2>
      <button onClick={() => handleSelectIntensity('light')} className="w-full bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#A855F7] rounded-2xl flex items-center justify-center text-white"><Sparkles className="w-8 h-8" /></div>
        <div><h4 className="font-bold text-slate-800 text-lg">Leve</h4><p className="text-slate-400 text-xs">Pequenos passos, grandes alívios.</p></div>
      </button>
      <button onClick={() => handleSelectIntensity('strong')} className="w-full bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#7C3AED] rounded-2xl flex items-center justify-center text-white"><Zap className="w-8 h-8" /></div>
        <div><h4 className="font-bold text-slate-800 text-lg">Com força</h4><p className="text-slate-400 text-xs">Ações profundas e fortalecimento.</p></div>
      </button>
    </div>
  );

  const renderTasks = () => (
    <div className="px-6 pb-40">
      <div className="bg-[#F3E8FF] rounded-[2rem] p-6 mb-8 flex items-start gap-4">
        <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
        <p className="text-purple-900 text-xs font-bold">Marque as tarefas que se compromete em iniciar hoje.</p>
      </div>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className={`bg-white p-5 rounded-[1.8rem] border flex items-center gap-4 ${task.completed ? 'opacity-50' : 'border-slate-50'}`}>
            <HeartCheckbox checked={task.completed} onChange={() => toggleTask(task.id)} />
            <p className={`text-slate-700 font-bold text-sm ${task.completed ? 'line-through' : ''}`}>{task.text}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setShowCompletionModal(true)} className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-black shadow-xl mt-12">Concluir</button>
    </div>
  );

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{getHeaderTitle()}</h1>
        </div>
        <SOSButton />
      </div>
      <main>
        {state.currentPage === 'care_instances_target' && renderTargetSelection()}
        {state.currentPage === 'care_instances_list' && renderCategoryList()}
        {state.currentPage === 'care_instances_intensity' && renderIntensitySelection()}
        {state.currentPage === 'care_instances_tasks' && renderTasks()}
      </main>
      {showCompletionModal && selectedCatId && selectedIntensity && (
        <CareCompletionModal 
          onContinue={() => navigate('care_agenda')}
          context={{ 
            category: INSTANCE_DATA[selectedCatId].title, 
            intensity: selectedIntensity, 
            tasks: tasks.filter(t => t.completed).map(t => t.text), 
            userName: state.userProfile.name.split(' ')[0] 
          }}
        />
      )}
    </Layout>
  );
};

const TargetCard = ({ icon, title, description, onClick }: any) => (
  <button onClick={onClick} className="w-full bg-white rounded-[2.5rem] p-6 flex items-center gap-5 border border-slate-50 text-left">
    <div className="w-16 h-16 bg-[#F3E8FF] text-purple-600 rounded-3xl flex items-center justify-center shrink-0">{icon}</div>
    <div className="flex-1"><h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3><p className="text-slate-400 text-xs">{description}</p></div>
    <ChevronRight className="w-5 h-5 text-purple-200 shrink-0" />
  </button>
);

const InstanceCard = ({ image, title, subtitle, onClick }: any) => (
  <button onClick={onClick} className="w-full bg-white h-24 rounded-[24px] flex items-center overflow-hidden border border-slate-50 text-left">
    <div className="w-[90px] h-full shrink-0 relative"><img src={image} alt={title} className="w-full h-full object-cover" /></div>
    <div className="flex-1 px-5 flex flex-col justify-center h-full"><h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3><p className="text-[#9CA3AF] text-[11px] font-medium">{subtitle}</p></div>
    <ChevronRight className="w-4 h-4 text-purple-200 mr-4" />
  </button>
);