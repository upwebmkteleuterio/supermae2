
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ArrowLeft, ShieldCheck, Eye, EyeOff, X, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const { navigate, updatePassword } = useApp();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!password) {
      setError("Digite a nova senha.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await updatePassword(password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('home'), 2000);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError("Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Senha Atualizada!</h1>
        <p className="text-slate-500 mb-8">Sua nova senha foi salva com sucesso. Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] -left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-[90px]"></div>
        <div className="absolute bottom-[20%] -right-20 w-72 h-72 bg-purple-300/10 rounded-full blur-[110px]"></div>
      </div>

      {error && (
        <div className="fixed top-12 left-6 right-6 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg border border-red-400/20">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-tight flex-1">{error}</span>
            <button onClick={() => setError(null)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <header className="pt-12 px-6 pb-4 bg-white/80 backdrop-blur-md flex flex-col gap-4 shadow-sm border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('welcome')} className="p-2 -ml-2 text-slate-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-2">
           <h1 className="text-2xl font-black text-slate-800">Nova Senha</h1>
           <p className="text-slate-400 text-xs font-medium">Crie uma nova senha segura para sua conta.</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 relative z-10">
        <div className="space-y-4">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} placeholder="Nova Senha" 
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-medium text-slate-700 shadow-sm"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <input 
            type="password" placeholder="Confirmar Nova Senha" 
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl p-5 focus:ring-2 ring-purple-500/20 outline-none font-medium text-slate-700 shadow-sm"
          />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex flex-col items-center gap-4 relative z-10">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-5 rounded-full font-bold shadow-lg shadow-purple-100 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Atualizar Senha'}
        </button>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          <ShieldCheck size={14} className="text-purple-200" /> Proteção ativada
        </div>
      </footer>
    </div>
  );
};
