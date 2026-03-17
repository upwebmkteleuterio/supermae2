"use client";

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
    id: "terapeutico",
    title: "Cuidado Terapêutico",
    subtitle: "Terapias e registros de evolução",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMiW-sfydHWg_qwqC41ua9bztKtz2iyDSMjKzMP5zmeIovE6XsfOC06MYFO7Q8cwbIqkd0jvVyiGC2wMDX4C7_uy4EMpmRSmy8JK7TfCXx_49CWhOQ2BYBwp-dc58mYwxI3MQq0hB7D595Qy4vK9ybQjDoVRTo-2HA9H6yRV8IU1_AAr8J3TXKy63QHFCPVyYmAkzXKc8Dm9xJ8U5c7ZFj4vPA69ORT9cxvqZAjUaj1tmCx9ur5CX5nTk_ZVU8Giz8HXvEHc3KAXd9",
    leve: [
      "Registro de evolução nas terapias (diário de progresso)",
      "Verificar agenda de lembretes das terapias",
      "Revisar orientações curtas do terapeuta",
      "Organizar mochila para a próxima sessão"
    ],
    forca: [
      "Sessão de Terapia Ocupacional / ABA / Psicoterapia",
      "Sessão de Fonoaudiologia",
      "Fisioterapia motora ou reabilitação",
      "Musicoterapia ou terapia aquática"
    ]
  },
  {
    id: "sensorial",
    title: "Cuidado Sensorial",
    subtitle: "Regulação e estímulos adequados",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSDb2WEZVkNkt-8zd1DHEEK-16OIUXSgdxxB8SXy0ukTTwr6EYsb_zbnF7vJOfGgovx7x6yPoa1lIWn0VFZX_ruZV4Q_c1XRyZ424BILSXqktCt1aPjmKiozcXKWt9YKL3aZNiU3X80OiVnqYpv_DIwA2aT5EPVDpw843iebd5gdj85VBEyDPuSrdnDgXT6lmLr7kPomqSruQofLJBrAmnW8qS-juEq7tbnlEDpfC4VuJ519nU_RKjOIrMZ04isUcPqPhyWwIhst4i",
    leve: [
      "Ouvir trilha auditiva calmante personalizada",
      "Diminuir luzes e ruídos da casa",
      "Usar fone abafador ou óculos escuros",
      "Conferir sinais de alerta para crise sensorial"
    ],
    forca: [
      "Brincadeiras sensoriais (texturas, cheiros e sons)",
      "Tempo no cantinho de acolhimento",
      "Uso de cobertores pesados ou pressão profunda",
      "Planejamento de estímulos do dia (luz, som, toque)"
    ]
  },
  {
    id: "comunicacional",
    title: "Cuidado Comunicacional",
    subtitle: "Expressão e comunicação alternativa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl9cIffpOcLSPF0XoOjOtlvWNy9MIxka1S0QgkGF12silBlaivmNB5cNHQaaccQyzO2nos7xwuxAqHP03J7UhZyVn6ovztwMZ5F14IZ44t0men62tsmx-2nQMLHj-e5-KcC47JJsbDLGzo_yBuUDVsXWlS1TerHEvj-mYJXLV_Mwy2Ry4l_QA0DWzr3yRHwDUZ52VXn-R0n7LiKmjPDuEm1aKOH41A7iARPZd7PB8bCWaQFR7Eeq4imU5JgOuRHAaNNMgrEIk5LkIw",
    leve: [
      "Prática diária de nomeação de sentimentos",
      "Registro de novas palavras ou gestos aprendidos",
      "Uso de pictogramas para escolhas simples",
      "Treinar o contato visual no diálogo"
    ],
    forca: [
      "Brincadeiras de turnos (responder, esperar, escutar)",
      "Sessão guiada de Comunicação Alternativa (PECS)",
      "Interação dirigida com irmãos ou familiares",
      "Treinar expressão de necessidades complexas"
    ]
  },
  {
    id: "ludico",
    title: "Cuidado Lúdico e Afetivo",
    subtitle: "Prazer, afeto e diversão",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLfhmfH9iLV4aGcGVFHHh9oQdburrJziLXvseYi6Svq0O1gGJGPGJZGXFW6AMfubu3Zhv5wAf_0kPGjCFW35ipOhPxpGqS-E_fB3eFc4iFk_8DI9xErEWoLhcVmg4AgnErjkrpeyGaXtYbKH3jmHyUjAVFpw6ypk2b6sIwXZfKHy_J1sM3o5CqdQdHiuVNi36oQOf02gywCkuXgej5DugtiLFbGLBbPCzaIlzTZEHRVzGDF68g05QfEofpXFJdA6FrVyJvt1MUHOA7",
    leve: [
      "Tempo livre com objeto ou atividade favorita",
      "Ouvir a história 'Para acalmar meu coração'",
      "Sessão rápida de abraço ou toque profundo",
      "Anotar uma pequena alegria do filho"
    ],
    forca: [
      "Atividades lúdicas não terapêuticas",
      "Ritual do sono com massagem relaxante",
      "Contação de história compartilhada",
      "Passeio focado em exploração prazerosa"
    ]
  },
  {
    id: "medico",
    title: "Cuidado Médico e Funcional",
    subtitle: "Saúde física e controle biológico",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfUPEQtonEBUrNc5ZWC6zz-7snArtZ4VVMi-YtaGnKaEw9ndX91aTFtFYiDhSKuUJoL7SAwcQFhHBWC_wmAxDlbB0y4cL2oAW3lwaRS_A9ajHf4pdM_veCxx_yZl0lVOzGnzJH-LnmvaHtDXMiQxoaopJ6vfgtfFBgkjFH6-4EVF3HBi9CjwbgB1yfMnNdpdTi3410QchBBxYHluLX7VNg6VTjhZF4S277KPaYs-v6_48ChA21DOmGK3NAhcOTdtD6ZqQyzrHMy-3s",
    leve: [
      "Controle de medicações (lembrete e dose)",
      "Checklist biológico (sono e alimentação)",
      "Diário de dores ou desconfortos físicos",
      "Conferir validade de receitas médicas"
    ],
    forca: [
      "Consulta médica ou realização de exames",
      "Registro detalhado de crises para o médico",
      "Monitoramento de evacuação e rotinas biológicas",
      "Organização do histórico médico impresso"
    ]
  },
  {
    id: "autonomia",
    title: "Cuidado de Autonomia",
    subtitle: "Independência e rotina visual",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIB1wBaP0WzjEf4r7E2uU0Ct5ytQweKFR6kn8XJAJKXY8eC-ap7xoSoZ9RGu_2hIbhOcToKBltjDAjQRVYLH2GAeS39Aed4c-FjYD7v1sP9sg2uDPXHRGSLYzYv306qXsMoBLEj9xxY447ny7nKCQM-bFV2-IGBpWQUoocALEshKjy8DIVsgVg9-vECToNPu1RaSuM4Clu945gYIdMMyVHd8gceG8YB72S0prK1TRmz_ZftsgU_RKaczOish-qgOec0LTxIS_ARefe",
    leve: [
      "Oferecer escolhas simples (roupa, lanche)",
      "Dar reforço positivo para tarefas feitas",
      "Registro no diário: 'Hoje ele conseguiu sozinho...'",
      "Revisar agenda visual com a criança"
    ],
    forca: [
      "Estímulo à autonomia na higiene pessoal",
      "Montar/Atualizar a agenda visual do dia",
      "Treinar pequenas tarefas domésticas auxiliadas",
      "Praticar sequência de vestir-se ou calçar-se"
    ]
  },
  {
    id: "relacional",
    title: "Cuidado Relacional",
    subtitle: "Conexão e pausa entre mãe e filho",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Se9RVx9OThCrbSM8nKO7pUIVB_UaAsRXbTBYDZjol1bDtuzge4VfXyf_nI9g7CeC6G7IhAv9mQRz7m6y_6k_8iUrVRiqnUvHLUFGkI2bUbbm9kUlMHnW9fUa2CQArWJGeplSXEVM0SNhIPYZ8tULNUJcR6t_ib9-54u9sFQOVpqgSTlsMwkNMeEsfBQMkOu5lHDKD0lNZypX468zjRH1yxqaaNe_J6ye8k9sQcDBFk1dEf59i49I4rR7A4YTMX2RX2ki1Ox06w88",
    leve: [
      "Registro simbólico de frase ou gesto marcante",
      "Momento de pausa conjunta sem demandas",
      "Anotar um momento bom entre vocês hoje",
      "Simplesmente deitar ao lado por 5 minutos"
    ],
    forca: [
      "Atividades de afeto conjunto (dançar, respirar)",
      "Momento de trilha de conexão (música/toque)",
      "Brincadeira afetiva olho no olho",
      "Passeio exclusivo de conexão materna"
    ]
  },
  {
    id: "educacional",
    title: "Cuidado Educacional",
    subtitle: "Escola, PEI e inclusão escolar",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400",
    leve: [
      "Monitorar inclusão e interação em sala",
      "Registrar episódios de sobrecarga na escola",
      "Verificar comunicação integrada escola/terapeuta",
      "Checklist de direitos educacionais garantidos"
    ],
    forca: [
      "Acompanhamento do Plano Educacional (PEI)",
      "Reunião com professores ou coordenação",
      "Preparação antecipada para eventos escolares",
      "Planejamento de tarefas com adaptação"
    ]
  }
];