
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { ArrowLeft, Info } from 'lucide-react';

export const CareInstancesList: React.FC = () => {
  const { navigate, goBack } = useApp();

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      {/* Header Profissional */}
      <div className="pt-12 px-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Instâncias de cuidados</h1>
        </div>
        <SOSButton />
      </div>

      {/* Informativo de Cabeçalho */}
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

      <div className="px-5 space-y-4 pb-40">
        <InstanceCard 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuAMiW-sfydHWg_qwqC41ua9bztKtz2iyDSMjKzMP5zmeIovE6XsfOC06MYFO7Q8cwbIqkd0jvVyiGC2wMDX4C7_uy4EMpmRSmy8JK7TfCXx_49CWhOQ2BYBwp-dc58mYwxI3MQq0hB7D595Qy4vK9ybQjDoVRTo-2HA9H6yRV8IU1_AAr8J3TXKy63QHFCPVyYmAkzXKc8Dm9xJ8U5c7ZFj4vPA69ORT9cxvqZAjUaj1tmCx9ur5CX5nTk_ZVU8Giz8HXvEHc3KAXd9"
          title="Sentir sem culpa"
          subtitle="Cuidado Emocional"
          onClick={() => {}}
        />

        <InstanceCard 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDSDb2WEZVkNkt-8zd1DHEEK-16OIUXSgdxxB8SXy0ukTTwr6EYsb_zbnF7vJOfGgovx7x6yPoa1lIWn0VFZX_ruZV4Q_c1XRyZ424BILSXqktCt1aPjmKiozcXKWt9YKL3aZNiU3X80OIUXSgdxxB8SXy0ukTTwr6EYsb_zbnF7vJOfGgovx7x6yPoa1lIWn0VFZX_ruZV4Q_c1XRyZ424BILSXqktCt1aPjmKiozcXKWt9YKL3aZNiU3X80OIUXSgdxxB8SXy0ukTTwr6EYsb_zbnF7vJOfGgovx7x6yPoa1lIWn0VFZX_ruZV4Q_c1XRyZ424BILSXqktCt1aPjmKiozcXKWt9YKL3aZNiU3X80OiVnqYpv_DIwA2aT5EPVDpw843iebd5gdj85VBEyDPuSrdnDgXT6lmLr7kPomqSruQofLJBrAmnW8qS-juEq7tbnlEDpfC4VuJ519nU_RKjOIrMZ04isUcPqPhyWwIhst4i"
          title="Meu corpo, meu ritmo"
          subtitle="Bem-Estar Físico"
          onClick={() => {}}
        />

        <InstanceCard 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBl9cIffpOcLSPF0XoOjOtlvWNy9MIxka1S0QgkGF12silBlaivmNB5cNHQaaccQyzO2nos7xwuxAqHP03J7UhZyVn6ovztwMZ5F14IZ44t0men62tsmx-2nQMLHj-e5-KcC47JJsbDLGzo_yBuUDVsXWlS1TerHEvj-mYJXLV_Mwy2Ry4l_QA0DWzr3yRHwDUZ52VXn-R0n7LiKmjPDuEm1aKOH41A7iARPZd7PB8bCWaQFR7Eeq4imU5JgOuRHAaNNMgrEIk5LkIw"
          title="Entre nós dois"
          subtitle="Mãe e filho/a"
          onClick={() => {}}
        />

        <InstanceCard 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDLfhmfH9iLV4aGcGVFHHh9oQdburrJziLXvseYi6Svq0O1gGJGPGJZGXFW6AMfubu3Zhv5wAf_0kPGjCFW35ipOhPxpGqS-E_fB3eFc4iFk_8DI9xErEWoLhcVmg4AgnErjkrpeyGaXtYbKH3jmHyUjAVFpw6ypk2b6sIwXZfKHy_J1sM3o5CqdQdHiuVNi36oQOf02gywCkuXgej5DugtiLFbGLBbPCzaIlzTZEHRVzGDF68g05QfEofpXFJdA6FrVyJvt1MUHOA7"
          title="Quem me segura"
          subtitle="Rede de apoio"
          onClick={() => {}}
        />

        <InstanceCard 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBfUPEQtonEBUrNc5ZWC6zz-7snArtZ4VVMi-YtaGnKaEw9ndX91aTFtFYiDhSKuUJoL7SAwcQFhHBWC_wmAxDlbB0y4cL2oAW3lwaRS_A9ajHf4pdM_veCxx_yZl0lVOzGnzJH-LnmvaHtDXMiQxoaopJ6vfgtfFBgkjFH6-4EVF3HBi9CjwbgB1yfMnNdpdTi3410QchBBxYHluLX7VNg6VTjhZF4S277KPaYs-v6_48ChA21DOmGK3NAhcOTdtD6ZqQyzrHMy-3s"
          title="Só por mim"
          subtitle="Tempo para si"
          onClick={() => {}}
        />

        <InstanceCard 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDIB1wBaP0WzjEf4r7E2uU0Ct5ytQweKFR6kn8XJAJKXY8eC-ap7xoSoZ9RGu_2hIbhOcToKBltjDAjQRVYLH2GAeS39Aed4c-FjYD7v1sP9sg2uDPXHRGSLYzYv306qXsMoBLEj9xxY447ny7nKCQM-bFV2-IGBpWQUoocALEshKjy8DIVsgVg9-vECToNPu1RaSuM4Clu945gYIdMMyVHd8gceG8YB72S0prK1TRmz_ZftsgU_RKaczOish-qgOec0LTxIS_ARefe"
          title="Entre terapias"
          subtitle="Rotina terapêutica"
          onClick={() => {}}
        />

        <InstanceCard 
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Se9RVx9OThCrbSM8nKO7pUIVB_UaAsRXbTBYDZjol1bDtuzge4VfXyf_nI9g7CeC6G7IhAv9mQRz7m6y_6k_8iUrVRiqnUvHLUFGkI2bUbbm9kUlMHnW9fUa2CQArWJGeplSXEVM0SNhIPYZ8tULNUJcR6t_ib9-54u9sFQOVpqgSTlsMwkNMeEsfBQMkOu5lHDKD0lNZypX468zjRH1yxqaaNe_J6ye8k9sQcDBFk1dEf59i49I4rR7A4YTMX2RX2ki1Ox06w88"
          title="Quem eu ainda sou"
          subtitle="Identidade e propósito"
          onClick={() => {}}
        />
      </div>
    </Layout>
  );
};

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
    {/* Bloco da Imagem */}
    <div className="w-[90px] h-full shrink-0 relative">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      {/* Overlay suave para integrar com o card */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
    </div>
    
    {/* Conteúdo Textual */}
    <div className="flex-1 px-5 flex flex-col justify-center h-full">
      <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{title}</h3>
      <p className="text-[#9CA3AF] text-[11px] font-medium">
        {subtitle}
      </p>
    </div>
  </button>
);
