
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
    features: [
      'Check-in emocional diário com frases acolhedoras',
      '1 rotina de cuidado pré-definida (sem personalização)',
      'Canal Desabafo no WhatsApp',
      'Botão SOS limitado a ligação para o CVV'
    ]
  },
  {
    id: 'conexao',
    name: 'Plano Conexão',
    price: 'R$ 5,90/mês',
    description: 'Ideal para: mães que querem ampliar a rede de apoio.',
    color: 'bg-purple-50 border-purple-100',
    icon: <Zap className="w-6 h-6 text-purple-500" />,
    features: [
      'Tudo do Plano Essencial',
      'Acesso a todos os canais temáticos WhatsApp',
      'Rotina de cuidado personalizada',
      'SOS emergencial completo',
      'Alertas de sobrecarga emocional'
    ]
  },
  {
    id: 'atípica',
    name: 'Plano Super Mãe Atípica',
    price: 'R$ 9,90/mês',
    popular: true,
    description: 'Ideal para: mães de crianças com TEA, TDAH ou deficiências.',
    color: 'bg-indigo-50 border-indigo-100',
    icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
    features: [
      'Tudo do Plano Conexão',
      'Diário emocional do filho (emojis, cores)',
      'Diário conjunto Mãe + Filho',
      'Agenda terapêutica com lembretes',
      'Canais segmentados por perfil atípico',
      'Auxílio, Direitos e Burocracias'
    ]
  },
  {
    id: 'completo',
    name: 'Plano Completo',
    price: 'R$ 15,90/mês',
    description: 'Para mães que querem autonomia com suporte digital completo.',
    color: 'bg-amber-50 border-amber-100',
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    features: [
      'Tudo dos planos anteriores',
      'Organizador de rotina com IA',
      'Relatórios emocionais semanais IA',
      'Dashboard de bem-estar completo'
    ]
  }
];

export const SubscriptionPlans: React.FC = () => {
  const { state, navigate, goBack } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    navigate('payment_selection');
  };

  const renderPlansList = () => (
    <div className="px-6 pb-40 space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800">Escolha seu plano</h2>
        <p className="text-slate-400 text-sm mt-2">Invista no seu bem-estar e no cuidado da sua família.</p>
      </div>

      {PLANS.map((plan) => (
        <article 
          key={plan.id}
          className={`relative bg-white rounded-[2.5rem] border-2 p-8 shadow-sm transition-all ${plan.popular ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-50'}`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              Mais escolhido
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.color}`}>
              {plan.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">{plan.name}</h3>
              <p className="text-purple-600 font-black text-xl mt-1">{plan.price}</p>
            </div>
          </div>

          <p className="text-slate-500 text-xs font-medium mb-6 leading-relaxed">{plan.description}</p>

          <ul className="space-y-3 mb-10">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-500" strokeWidth={3} />
                </div>
                <span className="text-slate-600 text-xs font-medium leading-tight">{feature}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => handleSelectPlan(plan.id)}
            className={`w-full py-4 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all ${
              plan.popular ? 'bg-indigo-600 text-white' : 'bg-white border-2 border-slate-100 text-slate-700'
            }`}
          >
            Selecionar plano
          </button>
        </article>
      ))}
    </div>
  );

  const renderPaymentSelection = () => {
    const selectedPlan = PLANS.find(p => p.id === selectedPlanId);
    
    return (
      <div className="px-6 pb-40 space-y-8 animate-in slide-in-from-right-4 duration-300">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 text-center">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Plano selecionado</p>
           <h3 className="text-xl font-bold text-slate-800">{selectedPlan?.name}</h3>
           <p className="text-purple-600 font-black text-2xl mt-1">{selectedPlan?.price}</p>
        </div>

        <div className="space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Forma de pagamento</h4>
           
           <button 
            className="w-full bg-white rounded-[2rem] p-6 flex items-center justify-between border border-slate-100 shadow-sm active:scale-[0.98] transition-all group"
            onClick={() => navigate('settings')}
           >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-slate-700 font-bold text-sm block">Pagar com PIX</span>
                  <span className="text-slate-400 text-[10px] font-medium">Liberação instantânea da conta.</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
           </button>

           <button 
            className="w-full bg-white rounded-[2rem] p-6 flex items-center justify-between border border-slate-100 shadow-sm active:scale-[0.98] transition-all group"
            onClick={() => navigate('settings')}
           >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-slate-700 font-bold text-sm block">Cartão de Crédito</span>
                  <span className="text-slate-400 text-[10px] font-medium">Renovação automática mensal.</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
           </button>
        </div>

        <div className="flex flex-col items-center gap-4 pt-10">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-400" /> Ambiente 100% Seguro
           </div>
           <p className="text-[10px] text-slate-400 text-center px-8 leading-relaxed">
             Ao assinar, você concorda com a renovação automática (exceto PIX) e nossos termos de serviço. Cancele quando quiser.
           </p>
        </div>
      </div>
    );
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      {/* Header Unificado */}
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Assinatura
          </h1>
        </div>
        <SOSButton />
      </div>

      <main>
        {/* Ilustração de Topo solicitada (mesma do carecompletion) */}
        <div className="mb-10 w-full flex justify-center px-6">
          <div className="bg-white/50 p-6 rounded-[3rem] shadow-inner backdrop-blur-sm">
            <img 
              alt="Assinatura Super Mãe" 
              className="w-44 h-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRSaA11hx61TLr-MJEqp8eWL2XYUonMiWka7vwrBBuloLgDHhfWDyglnBo1ZP22Euy3SjSvW4gp4TWxhrBtKghQY7bHGzIDCHi3odRFyCa_BfXC4QKUO9IPEu9yuljd3NdJrU7Y_mFnsfr0rfd8jupTkowW7SAIDLunB2L27ikzgkfS1HKDbcDejtp5x1itoGJcFI3Xo6YCTpHR1qNfww-BHX_rpPeCOUIhaFxFWY4rTcSTrX4_W9LM7tVsFsA2n5vlcQI4-P06HAa"
            />
          </div>
        </div>

        {state.currentPage === 'subscription_plans' && renderPlansList()}
        {state.currentPage === 'payment_selection' && renderPaymentSelection()}
      </main>
    </Layout>
  );
};
