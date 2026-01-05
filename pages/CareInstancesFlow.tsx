
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
    leve: [
      "Faça uma visualização guiada de um lugar seguro e acolhedor",
      "Escreva um poema ou frase inspiradora sobre a maternidade atípica",
      "Pratique auto-massagem facial para aliviar tensão",
      "Crie um “kit emocional” com objetos que trazem conforto (fotos, amuletos)"
    ],
    forca: [
      "Pratique journaling focado em identificar gatilhos emocionais e estratégias para lidar com eles",
      "Participe de terapia em grupo online focada em mães atípicas",
      "Faça exercícios de mindfulness para fortalecer a presença no momento presente",
      "Crie um ritual de despedida para momentos de frustração ou cansaço intenso"
    ]
  },
  "2": {
    title: "Meu corpo, meu ritmo",
    subtitle: "Bem-estar Físico",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSDb2WEZVkNkt-8zd1DHEEK-16OIUXSgdxxB8SXy0ukTTwr6EYsb_zbnF7vJOfGgovx7x6yPoa1lIWn0VFZX_ruZV4Q_c1XRyZ424BILSXqktCt1aPjmKiozcXKWt9YKL3aZNiU3X80OiVnqYpv_DIwA2aT5EPVDpw843iebd5gdj85VBEyDPuSrdnDgXT6lmLr7kPomqSruQofLJBrAmnW8qS-juEq7tbnlEDpfC4VuJ519nU_RKjOIrMZ04isUcPqPhyWwIhst4i",
    leve: [
      "Faça exercícios de respiração para relaxar a musculatura do pescoço e ombros",
      "Pratique autoalongamento sentado durante a rotina diária",
      "Tome sol por 10 minutos para aumentar a produção de vitamina D",
      "Hidrate-se com água saborizada natural para estimular o cuidado corporal"
    ],
    forca: [
      "Faça um circuito rápido de exercícios funcionais adaptados para casa",
      "Realize uma sessão de pilates para fortalecimento do core e postura",
      "Participe de uma aula de dança online para energizar o corpo e mente",
      "Pratique meditação ativa, como walking meditation, para mover corpo e mente juntos"
    ]
  },
  "3": {
    title: "Entre nós dois",
    subtitle: "Mãe e filho/a",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl9cIffpOcLSPF0XoOjOtlvWNy9MIxka1S0QgkGF12silBlaivmNB5cNHQaaccQyzO2nos7xwuxAqHP03J7UhZyVn6ovztwMZ5F14IZ44t0men62tsmx-2nQMLHj-e5-KcC47JJsbDLGzo_yBuUDVsXWlS1TerHEvj-mYJXLV_Mwy2Ry4l_QA0DWzr3yRHwDUZ52VXn-R0n7LiKmjPDuEm1aKOH41A7iARPZd7PB8bCWaQFR7Eeq4imU5JgOuRHAaNNMgrEIk5LkIw",
    leve: [
      "Monte um álbum de fotos e recordações dos pequenos avanços do filho",
      "Faça uso de brinquedos sensoriais para momentos de calma juntos",
      "Observe e reconheça sinais de comunicação não verbal da criança",
      "Pratique técnicas de atenção plena para fortalecer a conexão no dia a dia"
    ],
    forca: [
      "Prepare receitas nutritivas juntos, envolvendo a criança nas etapas simples",
      "Crie um espaço de terapia em casa com materiais e objetos de conforto para o filho",
      "Organize uma rotina visual com o filho para facilitar a previsibilidade do dia",
      "Participe de atividades de socialização com outras famílias atípicas"
    ]
  },
  "4": {
    title: "Quem me segura",
    subtitle: "Rede de apoio",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLfhmfH9iLV4aGcGVFHHh9oQdburrJziLXvseYi6Svq0O1gGJGPGJZGXFW6AMfubu3Zhv5wAf_0kPGjCFW35ipOhPxpGqS-E_fB3eFc4iFk_8DI9xErEWoLhcVmg4AgnErjkrpeyGaXtYbKH3jmHyUjAVFpw6ypk2b6sIwXZfKHy_J1sM3o5CqdQdHiuVNi36oQOf02gywCkuXgej5DugtiLFbGLBbPCzaIlzTZEHRVzGDF68g05QfEofpXFJdA6FrVyJvt1MUHOA7",
    leve: [
      "Compartilhe um conselho ou dica útil no grupo do app para outras mães",
      "Ouça histórias de superação gravadas por outras mães atípicas",
      "Siga perfis e páginas nas redes sociais focados em apoio a mães atípicas",
      "Faça uma lista de contatos importantes para emergências e suporte rápido"
    ],
    forca: [
      "Lidere uma iniciativa de apoio local para mães de filhos atípicos",
      "Organize trocas de materiais e brinquedos terapêuticos com outras mães",
      "Promova encontros temáticos, como palestras ou rodas de conversa",
      "Participe de movimentos e campanhas de valorização e inclusão social"
    ]
  },
  "5": {
    title: "Só por mim",
    subtitle: "Tempo para si",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfUPEQtonEBUrNc5ZWC6zz-7snArtZ4VVMi-YtaGnKaEw9ndX91aTFtFYiDhSKuUJoL7SAwcQFhHBWC_wmAxDlbB0y4cL2oAW3lwaRS_A9ajHf4pdM_veCxx_yZl0lVOzGnzJH-LnmvaHtDXMiQxoaopJ6vfgtfFBgkjFH6-4EVF3HBi9CjwbgB1yfMnNdpdTi3410QchBBxYHluLX7VNg6VTjhZF4S277KPaYs-v6_48ChA21DOmGK3NAhcOTdtD6ZqQyzrHMy-3s",
    leve: [
      "Ouça música instrumental relaxante enquanto faz uma atividade manual leve",
      "Faça pequenas pausas ao longo do dia para se alongar e respirar",
      "Escreva uma carta para si mesma, reconhecendo suas conquistas diárias",
      "Pratique técnicas simples de mindfulness, como observar a respiração"
    ],
    forca: [
      "Planeje uma saída rápida (café, caminhada em parque) com tempo dedicado só para si",
      "Invista tempo em cursos ou workshops que promovam crescimento pessoal",
      "Pratique exercícios criativos, como pintura ou escrita expressiva",
      "Realize um mini retiro em casa, com desligamento das redes sociais e foco no autocuidado"
    ]
  },
  "6": {
    title: "Entre terapias",
    subtitle: "Rotina terapêutica",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIB1wBaP0WzjEf4r7E2uU0Ct5ytQweKFR6kn8XJAJKXY8eC-ap7xoSoZ9RGu_2hIbhOcToKBltjDAjQRVYLH2GAeS39Aed4c-FjYD7v1sP9sg2uDPXHRGSLYzYv306qXsMoBLEj9xxY447ny7nKCQM-bFV2-IGBpWQUoocALEshKjy8DIVsgVg9-vECToNPu1RaSuM4Clu945gYIdMMyVHd8gceG8YB72S0prK1TRmz_ZftsgU_RKaczOish-qgOec0LTxIS_ARefe",
    leve: [
      "Revise o plano terapêutico do filho, anotando dúvidas e observações",
      "Pratique atividades de relaxamento junto com o filho após sessões terapêuticas",
      "Ouça podcasts educativos sobre terapias para crianças atípicas",
      "Realize exercícios respiratórios indicados pelo terapeuta para o filho"
    ],
    forca: [
      "Aplique técnicas específicas de terapia comportamental, como reforço positivo",
      "Prepare material e ambiente para sessões de terapia em casa",
      "Participe de grupos de estudo e troca sobre práticas terapêuticas",
      "Desenvolva um diário de progresso terapêutico, com anotações detalhadas"
    ]
  },
  "7": {
    title: "Quem eu ainda sou",
    subtitle: "Identidade e propósito",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Se9RVx9OThCrbSM8nKO7pUIVB_UaAsRXbTBYDZjol1bDtuzge4VfXyf_nI9g7CeC6G7IhAv9mQRz7m6y_6k_8iUrVRiqnUvHLUFGkI2bUbbm9kUlMHnW9fUa2CQArWJGeplSXEVM0SNhIPYZ8tULNUJcR6t_ib9-54u9sFQOVpqgSTlsMwkNMeEsfBQMkOu5lHDKD0lNZypX468zjRH1yxqaaNe_J6ye8k9sQcDBFk1dEf59i49I4rR7A4YTMX2RX2ki1Ox06w88",
    leve: [
      "Reflita sobre o impacto positivo que a maternidade atípica teve em seu crescimento pessoal",
      "Crie um quadro visual com frases e imagens que representem seus valores",
      "Faça uma lista de qualidades que admira em si mesma como mãe e mulher",
      "Medite sobre seus sonhos e intenções para o futuro"
    ],
    forca: [
      "Escreva uma autobiografia curta focando na jornada como mãe atípica",
      "Participe de grupos de empoderamento e autoconhecimento",
      "Estabeleça metas para projetos pessoais que fortaleçam sua identidade",
      "Compartilhe suas conquistas e aprendizados com outras mães para inspirar"
    ]
  }
};

export const CareInstancesFlow: React.FC = () => {
  const { state, navigate, goBack } = useApp();
  
  // Estados Locais do Fluxo
  const [selectedTarget, setSelectedTarget] = useState<'mom' | 'child' | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<'light' | 'strong' | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Títulos Dinâmicos
  const getHeaderTitle = () => {
    if (state.currentPage === 'care_instances_target') return "Para quem é o cuidado?";
    if (state.currentPage === 'care_instances_list') return "Instâncias de cuidados";
    if (state.currentPage === 'care_instances_intensity') return "Intensidade";
    return "Minhas tarefas";
  };

  // Navegação Interna
  const handleSelectTarget = (target: 'mom' | 'child') => {
    setSelectedTarget(target);
    if (target === 'mom') navigate('care_instances_list');
    else navigate('care_agenda'); // Placeholder para fluxo do filho
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCatId(id);
    navigate('care_instances_intensity');
  };

  const handleSelectIntensity = (intensity: 'light' | 'strong') => {
    setSelectedIntensity(intensity);
    const data = INSTANCE_DATA[selectedCatId!];
    const rawTasks = intensity === 'light' ? data.leve : data.forca;
    
    setTasks(rawTasks.map((t, idx) => ({
      id: `${selectedCatId}-${intensity}-${idx}`,
      text: t,
      completed: false
    })));
    
    navigate('care_instances_tasks');
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleFinish = () => {
    setShowCompletionModal(true);
  };

  const renderTargetSelection = () => (
    <div className="px-6 space-y-4 pt-4">
      <TargetCard 
        icon={<User className="w-8 h-8" />}
        title="Para mim"
        description="Foque no seu bem-estar, identidade e recarregue suas energias."
        onClick={() => handleSelectTarget('mom')}
      />
      <TargetCard 
        icon={<Baby className="w-8 h-8" />}
        title="Para meu filho"
        description="Atividades e cuidados pensados para o desenvolvimento e calma do seu pequeno."
        onClick={() => handleSelectTarget('child')}
      />
    </div>
  );

  const renderCategoryList = () => (
    <>
      <div className="px-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
             <Info className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
            Escolha uma das opções abaixo e receba uma lista de recomendações de tarefas que irão te trazer sensações e emoções ideais para o momento selecionado que está passando.
          </p>
        </div>
      </div>

      <div className="px-5 space-y-4 pb-20">
        {Object.entries(INSTANCE_DATA).map(([id, item]) => (
          <InstanceCard 
            key={id}
            image={item.image}
            title={item.title}
            subtitle={item.subtitle}
            onClick={() => handleSelectCategory(id)}
          />
        ))}
      </div>
    </>
  );

  const renderIntensitySelection = () => (
    <div className="px-6 space-y-6 pt-10 text-center">
      <div className="mb-10">
         <h2 className="text-xl font-bold text-slate-800">Como está sua energia agora?</h2>
         <p className="text-slate-400 text-sm mt-2">Escolha o ritmo ideal para suas tarefas hoje.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => handleSelectIntensity('light')}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all group hover:border-purple-200"
        >
          <div className="w-16 h-16 bg-[#A855F7] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-purple-100">
             <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">Leve</h4>
            <p className="text-slate-400 text-xs mt-1">Pequenos passos, grandes alívios.</p>
          </div>
        </button>

        <button 
          onClick={() => handleSelectIntensity('strong')}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-all group hover:border-purple-200"
        >
          <div className="w-16 h-16 bg-[#7C3AED] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-purple-200">
             <Zap className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">Com força</h4>
            <p className="text-slate-400 text-xs mt-1">Ações profundas e fortalecimento.</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="px-6 pb-40">
       <div className="bg-[#F3E8FF] rounded-[2rem] p-6 mb-8 border border-purple-100/50 flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
             <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-purple-900 text-xs font-bold leading-relaxed">
            Marque um check na tarefa que você se compromete em iniciar agora.
          </p>
       </div>

       <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id}
              className={`bg-white p-5 rounded-[1.8rem] border transition-all flex items-center gap-4 shadow-sm ${
                task.completed ? 'opacity-50 grayscale' : 'border-slate-50'
              }`}
            >
               <div className="shrink-0">
                  <HeartCheckbox 
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
               </div>
               <div className="flex-1" onClick={() => toggleTask(task.id)}>
                  <p className={`text-slate-700 font-bold text-sm leading-relaxed ${task.completed ? 'line-through' : ''}`}>
                    {task.text}
                  </p>
               </div>
            </div>
          ))}
       </div>

       <div className="mt-12">
          <button 
            onClick={handleFinish}
            className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-purple-100 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]"
          >
            Concluir
          </button>
       </div>
    </div>
  );

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      {/* Header Unificado para o Fluxo */}
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {getHeaderTitle()}
          </h1>
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

const TargetCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[2.5rem] p-6 flex items-center gap-5 border border-slate-50 shadow-sm active:scale-[0.98] transition-all text-left"
  >
    <div className="w-16 h-16 bg-[#F3E8FF] text-purple-600 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-purple-200 shrink-0" />
  </button>
);

const InstanceCard: React.FC<{ 
  image: string; 
  title: string; 
  subtitle: string;
  onClick: () => void;
}> = ({ image, title, subtitle, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white h-24 rounded-[24px] flex items-center overflow-hidden border border-slate-50 shadow-sm active:scale-[0.98] transition-all text-left"
  >
    <div className="w-[90px] h-full shrink-0 relative">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as any).src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
    </div>
    <div className="flex-1 px-5 flex flex-col justify-center h-full">
      <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{title}</h3>
      <p className="text-[#9CA3AF] text-[11px] font-medium">{subtitle}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-purple-200 mr-4" />
  </button>
);
