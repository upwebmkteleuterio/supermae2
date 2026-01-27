
export interface CareCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  leve: string[];
  forca: string[];
}

export const CARE_INSTANCES: CareCategory[] = [
  {
    id: "1",
    title: "Sentir sem culpa",
    subtitle: "Cuidado Emocional",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMiW-sfydHWg_qwqC41ua9bztKtz2iyDSMjKzMP5zmeIovE6XsfOC06MYFO7Q8cwbIqkd0jvVyiGC2wMDX4C7_uy4EMpmRSmy8JK7TfCXx_49CWhOQ2BYBwp-dc58mYwxI3MQq0hB7D595Qy4vK9ybQjDoVRTo-2HA9H6yRV8IU1_AAr8J3TXKy63QHFCPVyYmAkzXKc8Dm9xJ8U5c7ZFj4vPA69ORT9cxvqZAjUaj1tmCx9ur5CX5nTk_ZVU8Giz8HXvEHc3KAXd9",
    leve: [
      "Visualização guiada de um lugar seguro e acolhedor",
      "Escrever um poema ou frase inspiradora sobre a maternidade atípica",
      "Praticar auto-massagem facial para aliviar tensão",
      "Criar um “kit emocional” com objetos que trazem conforto"
    ],
    forca: [
      "Praticar journaling focado em identificar gatilhos emocionais",
      "Participar de terapia em grupo online focada em mães atípicas",
      "Fazer exercícios de mindfulness para fortalecer a presença",
      "Criar um ritual de despedida para momentos de frustração"
    ]
  },
  {
    id: "2",
    title: "Meu corpo, meu ritmo",
    subtitle: "Bem-estar Físico",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSDb2WEZVkNkt-8zd1DHEEK-16OIUXSgdxxB8SXy0ukTTwr6EYsb_zbnF7vJOfGgovx7x6yPoa1lIWn0VFZX_ruZV4Q_c1XRyZ424BILSXqktCt1aPjmKiozcXKWt9YKL3aZNiU3X80OiVnqYpv_DIwA2aT5EPVDpw843iebd5gdj85VBEyDPuSrdnDgXT6lmLr7kPomqSruQofLJBrAmnW8qS-juEq7tbnlEDpfC4VuJ519nU_RKjOIrMZ04isUcPqPhyWwIhst4i",
    leve: [
      "Exercícios de respiração para relaxar pescoço e ombros",
      "Prática de autoalongamento sentado durante a rotina",
      "Tomar sol por 10 minutos para vitamina D",
      "Hidratação com água saborizada natural"
    ],
    forca: [
      "Circuito rápido de exercícios funcionais em casa",
      "Sessão de pilates para fortalecimento do core",
      "Aula de dança online para energizar o corpo",
      "Prática de meditação ativa (walking meditation)"
    ]
  },
  {
    id: "3",
    title: "Entre nós dois",
    subtitle: "Mãe e filho/a",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl9cIffpOcLSPF0XoOjOtlvWNy9MIxka1S0QgkGF12silBlaivmNB5cNHQaaccQyzO2nos7xwuxAqHP03J7UhZyVn6ovztwMZ5F14IZ44t0men62tsmx-2nQMLHj-e5-KcC47JJsbDLGzo_yBuUDVsXWlS1TerHEvj-mYJXLV_Mwy2Ry4l_QA0DWzr3yRHwDUZ52VXn-R0n7LiKmjPDuEm1aKOH41A7iARPZd7PB8bCWaQFR7Eeq4imU5JgOuRHAaNNMgrEIk5LkIw",
    leve: [
      "Montar um álbum de recordações dos pequenos avanços",
      "Usar brinquedos sensoriais para momentos de calma",
      "Observar e reconhecer sinais não verbais da criança",
      "Praticar técnicas de atenção plena na conexão diária"
    ],
    forca: [
      "Preparar receitas nutritivas juntos, envolvendo a criança",
      "Criar um espaço de terapia em casa com objetos de conforto",
      "Organizar uma rotina visual para facilitar previsibilidade",
      "Participar de atividades de socialização com outras famílias"
    ]
  },
  {
    id: "4",
    title: "Quem me segura",
    subtitle: "Rede de apoio",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLfhmfH9iLV4aGcGVFHHh9oQdburrJziLXvseYi6Svq0O1gGJGPGJZGXFW6AMfubu3Zhv5wAf_0kPGjCFW35ipOhPxpGqS-E_fB3eFc4iFk_8DI9xErEWoLhcVmg4AgnErjkrpeyGaXtYbKH3jmHyUjAVFpw6ypk2b6sIwXZfKHy_J1sM3o5CqdQdHiuVNi36oQOf02gywCkuXgej5DugtiLFbGLBbPCzaIlzTZEHRVzGDF68g05QfEofpXFJdA6FrVyJvt1MUHOA7",
    leve: [
      "Compartilhar um conselho útil no grupo do app",
      "Ouvir histórias de superação gravadas por outras mães",
      "Seguir perfis focados em apoio a mães atípicas",
      "Fazer uma lista de contatos para emergências"
    ],
    forca: [
      "Liderar uma iniciativa de apoio local para mães",
      "Organizar trocas de materiais e brinquedos terapêuticos",
      "Promover encontros temáticos ou rodas de conversa",
      "Participar de movimentos de inclusão social"
    ]
  },
  {
    id: "5",
    title: "Só por mim",
    subtitle: "Tempo para si",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfUPEQtonEBUrNc5ZWC6zz-7snArtZ4VVMi-YtaGnKaEw9ndX91aTFtFYiDhSKuUJoL7SAwcQFhHBWC_wmAxDlbB0y4cL2oAW3lwaRS_A9ajHf4pdM_veCxx_yZl0lVOzGnzJH-LnmvaHtDXMiQxoaopJ6vfgtfFBgkjFH6-4EVF3HBi9CjwbgB1yfMnNdpdTi3410QchBBxYHluLX7VNg6VTjhZF4S277KPaYs-v6_48ChA21DOmGK3NAhcOTdtD6ZqQyzrHMy-3s",
    leve: [
      "Ouvir música instrumental relaxante",
      "Fazer pequenas pausas para se alongar e respirar",
      "Escrever uma carta para si mesma",
      "Praticar observação da respiração"
    ],
    forca: [
      "Planejar uma saída dedicada só para si",
      "Investir tempo em cursos de crescimento pessoal",
      "Praticar exercícios criativos (pintura ou escrita)",
      "Realizar um mini retiro em casa sem redes sociais"
    ]
  },
  {
    id: "6",
    title: "Entre terapias",
    subtitle: "Rotina terapêutica",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIB1wBaP0WzjEf4r7E2uU0Ct5ytQweKFR6kn8XJAJKXY8eC-ap7xoSoZ9RGu_2hIbhOcToKBltjDAjQRVYLH2GAeS39Aed4c-FjYD7v1sP9sg2uDPXHRGSLYzYv306qXsMoBLEj9xxY447ny7nKCQM-bFV2-IGBpWQUoocALEshKjy8DIVsgVg9-vECToNPu1RaSuM4Clu945gYIdMMyVHd8gceG8YB72S0prK1TRmz_ZftsgU_RKaczOish-qgOec0LTxIS_ARefe",
    leve: [
      "Revisar o plano terapêutico, anotando dúvidas",
      "Praticar relaxamento com o filho após sessões",
      "Ouvir podcasts educativos sobre terapias",
      "Realizar exercícios respiratórios indicados"
    ],
    forca: [
      "Aplicar técnicas de reforço positivo",
      "Preparar ambiente para sessões em casa",
      "Participar de grupos de troca sobre práticas",
      "Desenvolver um diário de progresso terapêutico"
    ]
  },
  {
    id: "7",
    title: "Quem eu ainda sou",
    subtitle: "Identidade e propósito",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Se9RVx9OThCrbSM8nKO7pUIVB_UaAsRXbTBYDZjol1bDtuzge4VfXyf_nI9g7CeC6G7IhAv9mQRz7m6y_6k_8iUrVRiqnUvHLUFGkI2bUbbm9kUlMHnW9fUa2CQArWJGeplSXEVM0SNhIPYZ8tULNUJcR6t_ib9-54u9sFQOVpqgSTlsMwkNMeEsfBQMkOu5lHDKD0lNZypX468zjRH1yxqaaNe_J6ye8k9sQcDBFk1dEf59i49I4rR7A4YTMX2RX2ki1Ox06w88",
    leve: [
      "Refletir sobre o crescimento com a maternidade",
      "Criar um quadro visual de seus valores",
      "Listar qualidades que admira em si mesma",
      "Meditar sobre sonhos e intenções futuras"
    ],
    forca: [
      "Escrever uma autobiografia da sua jornada",
      "Participar de grupos de autoconhecimento",
      "Estabelecer metas para projetos pessoais",
      "Compartilhar aprendizados para inspirar outras"
    ]
  }
];
