
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  User, 
  Lock, 
  Phone, 
  Moon, 
  HelpCircle, 
  Trash2, 
  FileText, 
  ChevronRight, 
  Bell, 
  Unlock 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { navigate, state } = useApp();
  const { userProfile } = state;

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      {/* Header Estilo Anexo */}
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div>
          <h2 className="text-slate-800 font-bold text-2xl leading-tight">{userProfile.name}!</h2>
          <p className="text-slate-400 text-xs font-medium">Membro desde março de 2025</p>
        </div>
        <div className="flex gap-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
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
          <h3 className="font-bold text-lg mb-2">Torne-se um assinante e tenha acesso a todos os recursos</h3>
          <p className="text-white/70 text-xs mb-8">Conheça todos os benefícios dos nossos planos.</p>
          <button className="w-full bg-white text-[#A855F7] py-4 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform">
            Tornar-me assinante
          </button>
        </div>
      </div>

      {/* Seções de Menu */}
      <div className="px-6 pb-32 space-y-8">
        <div>
          <h4 className="text-slate-900 font-bold mb-4">Perfil e segurança</h4>
          <div className="space-y-3">
            <SettingsItem 
              icon={<User className="w-5 h-5" />} 
              label="Dados pessoais" 
              onClick={() => navigate('personal_data')} 
            />
            <SettingsItem 
              icon={<Lock className="w-5 h-5" />} 
              label="Senha" 
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
          <h4 className="text-slate-900 font-bold mb-4">Ajustes</h4>
          <div className="space-y-3">
            <div className="bg-white rounded-[1.8rem] p-4 flex items-center justify-between border border-slate-50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="text-slate-700 font-bold text-sm">Modo escuro</span>
              </div>
              <div className="w-12 h-6 bg-slate-100 rounded-full p-1 relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-1"></div>
              </div>
            </div>
            <SettingsItem 
              icon={<HelpCircle className="w-5 h-5" />} 
              label="Ajuda" 
              onClick={() => {}} 
            />
            <SettingsItem 
              icon={<Trash2 className="w-5 h-5" />} 
              label="Excluir conta" 
              onClick={() => {}} 
              isDanger
            />
            <SettingsItem 
              icon={<FileText className="w-5 h-5" />} 
              label="Termos de uso e Política de Privacidade." 
              onClick={() => {}} 
            />
          </div>
        </div>
      </div>
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
    className="w-full bg-white rounded-[1.8rem] p-4 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 ${isDanger ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600'} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <span className={`${isDanger ? 'text-red-500' : 'text-slate-700'} font-bold text-sm text-left`}>{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-300" />
  </button>
);
