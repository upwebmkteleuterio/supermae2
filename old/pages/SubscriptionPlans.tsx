// Build: Force Refresh 1.0.1
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Zap, 
  Heart, 
  Crown, 
  CreditCard, 
  QrCode,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'essencial',
    name: 'Plano Essencial',
    price: 'Gratuito',
    description: 'Ideal para: todas as mães, como porta de entrada.',
    color: 'bg-slate-50 border-slate-100',
    icon: <Heart className="w-6 h-6 text-slate-400" />,
    features: ['Check-in emocional diário', '1 rotina pré-definida', 'Canal Desabafo WhatsApp', 'Botão SOS limitado']
  },
  {
    id: 'conexao',
    name: 'Plano Conexão',
    price: 'R$ 5,90/mês',
    description: 'Ideal para mães que buscam ampliar sua rede.',
    color: 'bg-purple-50 border-purple-100',
    icon: <Zap className="w-6 h-6 text-purple-500" />,
    features: ['Tudo do Essencial', 'Todos os canais WhatsApp', 'Rotinas personalizadas', 'SOS completo', 'Alertas de sobrecarga']
  },
  {
    id: 'atípica',
    name: 'Plano Super Mãe Atípica',
    price: 'R$ 9,90/mês',
    popular: true,
    description: 'Ideal para mães de crianças com deficiência ou TEA.',
    color: 'bg-indigo-50 border-indigo-100',
    icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
    features: ['Tudo do Conexão', 'Diário emocional do filho', 'Agenda terapêutica completa', 'Canais especializados']
  },
  {
    id: 'completo',
    name: 'Plano Completo',
    price: 'R$ 15,90/mês',
    description: 'Para mães que querem autonomia com suporte digital completo.',
    color: 'bg-amber-50 border-amber-100',
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    features: ['Tudo dos anteriores', 'Organizador de rotina IA', 'Relatórios semanais IA', 'Dashboard completo']
  }
];

export const SubscriptionPlans: React.FC = () => {
  const { state, navigate, goBack } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const renderPlansList = () => (
    <div className="px-6 pb-40 space-y-6">
      <div className="text-center mb-10"><h2 className="text-2xl font-bold text-slate-800">Escolha seu plano</h2></div>
      {PLANS.map((plan) => (
        <article key={plan.id} className={`relative bg-white rounded-[2.5rem] border-2 p-8 shadow-sm ${plan.popular ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-50'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.color}`}>{plan.icon}</div>
            <div><h3 className="font-bold text-slate-800 text-lg leading-tight">{plan.name}</h3><p className="text-purple-600 font-black text-xl mt-1">{plan.price}</p></div>
          </div>
          <ul className="space-y-3 mb-10">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span className="text-slate-600 text-xs font-medium">{feature}</span></li>
            ))}
          </ul>
          <button onClick={() => { setSelectedPlanId(plan.id); navigate('payment_selection'); }} className={`w-full py-4 rounded-full font-bold text-sm shadow-md ${plan.popular ? 'bg-indigo-600 text-white' : 'bg-white border-2 border-slate-100'}`}>Selecionar plano</button>
        </article>
      ))}
    </div>
  );

  const renderPaymentSelection = () => (
    <div className="px-6 pb-40 space-y-8 animate-in slide-in-from-right-4">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm text-center">
         <h3 className="text-xl font-bold text-slate-800">Selecione o pagamento</h3>
         <p className="text-purple-600 font-black text-2xl mt-1">{PLANS.find(p => p.id === selectedPlanId)?.price}</p>
      </div>
      <div className="space-y-4">
         <PaymentOption icon={<QrCode className="w-6 h-6" />} label="Pagar com PIX" sub="Acesso instantâneo" onClick={() => navigate('settings')} color="bg-emerald-50 text-emerald-500" />
         <PaymentOption icon={<CreditCard className="w-6 h-6" />} label="Cartão de Crédito" sub="Renovação automática" onClick={() => navigate('settings')} color="bg-blue-50 text-blue-500" />
      </div>
    </div>
  );

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Assinatura</h1>
        </div>
        <SOSButton />
      </div>
      <main>
        <div className="mb-10 w-full flex justify-center px-6">
          <div className="bg-white/50 p-6 rounded-[3rem] shadow-inner backdrop-blur-sm">
            <img alt="Cuidado" className="w-44 h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRSaA11hx61TLr-MJEqp8eWL2XYUonMiWka7vwrBBuloLgDHhfWDyglnBo1ZP22Euy3SjSvW4gp4TWxhrBtKghQY7bHGzIDCHi3odRFyCa_BfXC4QKUO9IPEu9yuljd3NdJrU7Y_mFnsfr0rfd8jupTkowW7SAIDLunB2L27ikzgkfS1HKDbcDejtp5x1itoGJcFI3Xo6YCTpHR1qNfww-BHX_rpPeCOUIhaFxFWY4rTcSTrX4_W9LM7tVsFsA2n5vlcQI4-P06HAa" />
          </div>
        </div>
        {state.currentPage === 'subscription_plans' && renderPlansList()}
        {state.currentPage === 'payment_selection' && renderPaymentSelection()}
      </main>
    </Layout>
  );
};

const PaymentOption = ({ icon, label, sub, onClick, color }: any) => (
  <button onClick={onClick} className="w-full bg-white rounded-[2rem] p-6 flex items-center justify-between border border-slate-100 shadow-sm">
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>{icon}</div>
      <div className="text-left"><span className="text-slate-700 font-bold text-sm block">{label}</span><span className="text-slate-400 text-[10px]">{sub}</span></div>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-300" />
  </button>
);