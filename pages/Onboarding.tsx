
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { ArrowLeft, ChevronRight, Check, ShieldCheck, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const WELCOMING_OPTIONS = [
  { id: 'emo', text: 'Sou uma mãe buscando apoio emocional, organização e mais leveza na rotina.' },
  { id: 'atypical', text: 'Sou uma mãe de filho(a) atípico (TEA, TDAH, deficiência etc.) e preciso de acolhimento e apoio específico para essa jornada.' }
];

const AGE_GROUPS = ["De 0 a 2 anos", "De 3 a 6 anos", "De 7 a 12 anos", "De 13 a 18 anos", "Mais de 18 anos"];

const DIAGNOSIS_OPTIONS = ["Já possui diagnóstico", "Está em investigação", "Ainda não tem, mas percebo sinais", "Prefiro não informar"];

const INTEREST_OPTIONS = [
  "Ajuda para organizar rotina de terapias",
  "Suporte emocional e autocuidado",
  "Rede de apoio e trocas com outras mães",
  "Conteúdo confiável sobre diagnósticos e direitos",
  "Estratégias para lidar com a sobrecarga"
];

export const Onboarding: React.FC = () => {
  const { navigate, goBack, updateUserProfile } = useApp();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-scroll para o topo quando houver erro
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Remove o erro automaticamente após 4 segundos
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
    welcomingGoal: '',
    childrenAgeGroup: '',
    diagnosisStatus: '',
    appInterests: [] as string[]
  });

  const validateStep1 = () => {
    if (!formData.name.trim().includes(' ')) return "Por favor, digite seu nome e sobrenome.";
    if (!formData.state) return "Selecione seu estado.";
    if (!formData.city) return "Informe sua cidade.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Email inválido.";
    if (formData.password.length < 6) return "A senha deve ter no menos 6 caracteres.";
    if (formData.password !== formData.confirmPassword) return "As senhas não conferem.";
    return null;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    } else if (step === 2 && !formData.welcomingGoal) {
      setError("Selecione como deseja ser acolhida."); return;
    } else if (step === 3 && !formData.childrenAgeGroup) {
      setError("Selecione a idade do seu filho."); return;
    } else if (step === 4 && !formData.diagnosisStatus) {
      setError("Informe a situação do diagnóstico."); return;
    } else if (step === 5 && formData.appInterests.length === 0) {
      setError("Escolha pelo menos um interesse."); return;
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    updateUserProfile({
      ...formData,
      onboardingCompleted: true
    });
    navigate('home');
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      appInterests: prev.appInterests.includes(interest) 
        ? prev.appInterests.filter(i => i !== interest) 
        : [...prev.appInterests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
      {/* Background Animated Bubbles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] -left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-[90px] animate-float-slow"></div>
        <div className="absolute bottom-[20%] -right-20 w-72 h-72 bg-purple-300/10 rounded-full blur-[110px] animate-float-reverse"></div>
      </div>

      {/* Floating Error Toast - Padrão Profissional Mobile */}
      {error && (
        <div className="fixed top-12 left-6 right-6 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(239,68,68,0.3)] border border-red-400/20">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-tight flex-1">{error}</span>
            <button onClick={() => setError(null)} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header com Progresso */}
      <header className="pt-12 px-6 pb-4 bg-white/80 backdrop-blur-md flex flex-col gap-4 shadow-sm border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : goBack()} className="p-2 -ml-2 text-slate-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-2">
           <h1 className="text-2xl font-black text-slate-800">Criar uma conta</h1>
           <p className="text-slate-400 text-xs font-medium">Queremos te conhecer melhor para te oferecer o cuidado que você merece.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 w-full mt-2">
           {[1,2,3,4,5].map(i => (
             <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-purple-600' : 'bg-slate-100'}`} />
           ))}
           <span className="text-[10px] font-black text-slate-300 ml-2 whitespace-nowrap">{step}/5</span>
        </div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto no-scrollbar relative z-10">
        {/* STEP 1: DADOS PESSOAIS */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dados Pessoais</h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Nome Completo" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-medium text-slate-700 shadow-sm"
              />
              <div className="grid grid-cols-3 gap-3">
                <select 
                  value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
                  className="col-span-1 bg-white border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-medium text-slate-400 shadow-sm"
                >
                  <option value="">Estado</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input 
                  type="text" placeholder="Cidade" 
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                  className="col-span-2 bg-white border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-medium text-slate-700 shadow-sm"
                />
              </div>
              <input 
                type="email" placeholder="Email" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-medium text-slate-700 shadow-sm"
              />
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} placeholder="Senha" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-medium text-slate-700 shadow-sm"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <input 
                type="password" placeholder="Confirmar Senha" 
                value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-white border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-medium text-slate-700 shadow-sm"
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center px-4 leading-relaxed">
              Ao criar uma conta você concorda com os <span className="text-purple-600 underline">Termos de Uso</span> e <span className="text-purple-600 underline">Política de Privacidade</span> da Super Mãe.
            </p>
          </div>
        )}

        {/* STEP 2: ACOLHIMENTO */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sobre sua Maternidade</h3>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">Como você quer ser acolhida aqui?</h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => setFormData({...formData, welcomingGoal: WELCOMING_OPTIONS[0].text})}
                className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all ${formData.welcomingGoal === WELCOMING_OPTIONS[0].text ? 'bg-purple-50 border-purple-500 shadow-md' : 'bg-white border-transparent shadow-sm'}`}
              >
                <p className={`text-sm font-bold leading-relaxed ${formData.welcomingGoal === WELCOMING_OPTIONS[0].text ? 'text-purple-700' : 'text-slate-600'}`}>{WELCOMING_OPTIONS[0].text}</p>
              </button>

              <div className="bg-[#E9E4FF] p-8 rounded-[2rem] text-center shadow-inner">
                <h4 className="text-purple-900 font-bold mb-2">A maternidade não precisa ser solitária.</h4>
                <p className="text-purple-400 text-xs font-medium uppercase tracking-tight">Aqui você encontra leveza e apoio.</p>
              </div>

              <button 
                onClick={() => setFormData({...formData, welcomingGoal: WELCOMING_OPTIONS[1].text})}
                className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all ${formData.welcomingGoal === WELCOMING_OPTIONS[1].text ? 'bg-purple-50 border-purple-500 shadow-md' : 'bg-white border-transparent shadow-sm'}`}
              >
                <p className={`text-sm font-bold leading-relaxed ${formData.welcomingGoal === WELCOMING_OPTIONS[1].text ? 'text-purple-700' : 'text-slate-600'}`}>{WELCOMING_OPTIONS[1].text}</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: IDADE */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sobre sua Maternidade</h3>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">Qual a idade aproximada dos seu(s) filho(s)?</h2>
            <div className="space-y-3">
              {AGE_GROUPS.map(age => (
                <button
                  key={age}
                  onClick={() => setFormData({...formData, childrenAgeGroup: age})}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-sm ${formData.childrenAgeGroup === age ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md' : 'bg-white border-transparent text-slate-500 shadow-sm'}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: DIAGNÓSTICO */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sobre sua Maternidade</h3>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">Qual a situação do diagnóstico de seu(s) filho(s)?</h2>
            <div className="space-y-3">
              {DIAGNOSIS_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setFormData({...formData, diagnosisStatus: opt})}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-sm ${formData.diagnosisStatus === opt ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md' : 'bg-white border-transparent text-slate-500 shadow-sm'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: INTERESSES */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sobre o App</h3>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">O que você mais gostaria de receber do app Super Mãe?</h2>
            <div className="space-y-3">
              {INTEREST_OPTIONS.map(opt => {
                const selected = formData.appInterests.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleInterest(opt)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-sm ${selected ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md' : 'bg-white border-transparent text-slate-500 shadow-sm'}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer Fixo */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex flex-col items-center gap-4 relative z-10">
        <button 
          onClick={handleNext}
          className="w-full bg-purple-600 text-white py-5 rounded-full font-bold shadow-lg shadow-purple-100 active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          {step === 5 ? 'Começar minha jornada' : 'Continuar'}
        </button>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          <ShieldCheck size={14} className="text-purple-200" /> Seus dados estão protegidos
        </div>
      </footer>
    </div>
  );
};
