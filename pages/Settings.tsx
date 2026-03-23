import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { ConfirmModal } from '../components/ConfirmModal';
import { LegalModal } from '../components/LegalModal';
import { 
  User, 
  Lock, 
  Phone, 
  HelpCircle, 
  Trash2, 
  FileText, 
  ChevronRight, 
  Unlock,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { navigate, state, logout, deleteAccount } = useApp();
  const { userProfile } = state;

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('welcome');
  };

  const handleDelete = async () => {
    const success = await deleteAccount();
    if (success) navigate('welcome');
    else alert("Erro ao excluir conta. Tente novamente.");
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      {/* Header Estilo Perfil */}
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div>
          <h2 className="text-slate-800 font-bold text-2xl leading-tight">{userProfile.name.split(' ')[0]}!</h2>
          <p className="text-slate-400 text-xs font-medium">Membro desde março de 2026</p>
        </div>
        <div className="flex gap-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
            <img 
              src={userProfile.avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <SOSButton />
        </div>
      </div>

      {/* Card Assinante */}
      <div className="px-6 mb-8">
        <div className="bg-[#A855F7] rounded-[2.5rem] p-8 text-white text-center relative overflow-hidden shadow-xl shadow-purple-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-12">
            <Unlock className="w-8 h-8 text-[#A855F7]" />
          </div>
          <h3 className="font-bold text-lg mb-2">Acesso VIP Super Mãe</h3>
          <p className="text-white/70 text-xs mb-8">Desbloqueie relatórios de evolução e suporte IA ilimitado.</p>
          <button 
            onClick={() => navigate('subscription_plans')}
            className="w-full bg-white text-[#A855F7] py-4 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform"
          >
            Ver Planos
          </button>
        </div>
      </div>

      {/* Seções de Menu */}
      <div className="px-6 pb-20 space-y-8">
        <div>
          <h4 className="text-slate-900 font-bold mb-4 ml-2 text-sm uppercase tracking-widest opacity-30">Perfil e segurança</h4>
          <div className="space-y-3">
            <SettingsItem 
              icon={<User className="w-5 h-5" />} 
              label="Dados pessoais" 
              onClick={() => navigate('personal_data')} 
            />
            <SettingsItem 
              icon={<Lock className="w-5 h-5" />} 
              label="Alterar Senha" 
              onClick={() => {}} 
            />
            <SettingsItem 
              icon={<Phone className="w-5 h-5" />} 
              label="Contato de apoio" 
              onClick={() => {}} 
            />
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 ml-2 text-sm uppercase tracking-widest opacity-30">Ajustes e Jurídico</h4>
          <div className="space-y-3">
            <SettingsItem 
              icon={<FileText className="w-5 h-5" />} 
              label="Termos de Uso" 
              onClick={() => setLegalModal('terms')} 
            />
            <SettingsItem 
              icon={<ShieldCheck className="w-5 h-5" />} 
              label="Política de Privacidade" 
              onClick={() => setLegalModal('privacy')} 
            />
            <SettingsItem 
              icon={<HelpCircle className="w-5 h-5" />} 
              label="Central de Ajuda" 
              onClick={() => {}} 
            />
            <SettingsItem 
              icon={<Trash2 className="w-5 h-5" />} 
              label="Excluir minha conta definitivamente" 
              onClick={() => setShowDeleteConfirm(true)} 
              isDanger
            />
          </div>
        </div>

        {/* Logout Idêntico à Home */}
        <div className="flex justify-center pt-4">
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] hover:text-purple-400 transition-colors py-4 active:scale-95"
          >
            <LogOut className="w-3 h-3" /> Sair da conta
          </button>
        </div>
      </div>

      {/* Modais de Confirmação */}
      {showLogoutConfirm && (
        <ConfirmModal 
          title="Sair do App?" 
          message="Você precisará digitar seu email e senha novamente para entrar." 
          confirmText="Sair agora"
          onConfirm={handleLogout} 
          onClose={() => setShowLogoutConfirm(false)} 
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal 
          title="Excluir conta definitivamente?" 
          message="Atenção: Todos os seus dados, agendas de filhos e históricos de humor serão apagados permanentemente do nosso banco de dados. Esta ação não pode ser desfeita." 
          confirmText="Sim, excluir tudo"
          onConfirm={handleDelete} 
          onClose={() => setShowDeleteConfirm(false)} 
        />
      )}

      {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
    </Layout>
  );
};

const SettingsItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  isDanger?: boolean;
}> = ({ icon, label, onClick, isDanger }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[1.8rem] p-4 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
  >
    <div className="flex items-center gap-4 text-left">
      <div className={`w-10 h-10 ${isDanger ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600'} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <span className={`${isDanger ? 'text-red-500' : 'text-slate-700'} font-bold text-sm leading-tight`}>{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
  </button>
);