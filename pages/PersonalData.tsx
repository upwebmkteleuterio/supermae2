
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  ArrowLeft, 
  Mail, 
  Map, 
  MapPin, 
  ChevronRight, 
  Pencil,
  Phone,
  Camera,
  Save,
  Check,
  Loader2
} from 'lucide-react';

const BRAZILIAN_STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

export const PersonalData: React.FC = () => {
  const { state, goBack, persistUserProfile, uploadAvatar } = useApp();
  const { userProfile } = state;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleSave = async () => {
    setLoading(true);
    const success = await persistUserProfile(formData);
    
    if (success) {
      setIsEditing(false);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3000);
    } else {
      alert("Ocorreu um erro ao salvar seus dados. Tente novamente.");
    }
    setLoading(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const publicUrl = await uploadAvatar(file);
      if (publicUrl) {
        setFormData(prev => ({ ...prev, avatar: publicUrl }));
      } else {
        alert("Falha ao subir a imagem. Verifique sua conexão.");
      }
      setUploading(false);
    }
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
           {isEditing ? (
             <button 
               onClick={handleSave}
               disabled={loading || uploading}
               className="bg-green-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center gap-2 disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
               {loading ? 'Salvando...' : 'Salvar'}
             </button>
           ) : (
             <button 
               onClick={() => setIsEditing(true)}
               className="bg-purple-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center gap-2"
             >
               <Pencil className="w-4 h-4" /> Editar
             </button>
           )}
           <SOSButton />
        </div>
      </div>

      <div className="px-6 mb-10">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center">
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              ) : (
                <img 
                  src={formData.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {isEditing && !uploading && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#A855F7] rounded-full flex items-center justify-center text-white border-2 border-white shadow-md active:scale-90"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange}
            />
          </div>
          <div className="w-full text-center">
            {isEditing ? (
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="text-center w-full bg-slate-50 border-none rounded-xl p-2 text-xl font-bold text-slate-800 focus:ring-2 ring-purple-500 outline-none"
              />
            ) : (
              <h3 className="text-xl font-bold text-slate-800">{userProfile.name}</h3>
            )}
            {savedFeedback && (
              <p className="text-green-500 text-[10px] font-bold mt-2 flex items-center justify-center gap-1">
                <Check className="w-3 h-3" /> Alterações salvas com sucesso!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-32 space-y-8">
        <div>
          <h4 className="text-slate-900 font-bold mb-4">Informações de contato</h4>
          <div className="space-y-3">
            <EditItem 
              icon={<Mail className="w-5 h-5" />} 
              label="Email" 
              value={formData.email} 
              isEditing={isEditing}
              onChange={val => setFormData(prev => ({ ...prev, email: val }))}
            />
            <EditItem
              icon={<Phone className="w-5 h-5" />}
              label="Telefone"
              value={formData.phone}
              isEditing={isEditing}
              onChange={val => setFormData(prev => ({ ...prev, phone: val }))}
            />
            <EditItem
              icon={<Save className="w-5 h-5" />}
              label="Contato de Apoio"
              value={formData.support_contact || ''}
              isEditing={isEditing}
              onChange={val => setFormData(prev => ({ ...prev, support_contact: val }))}
            />
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4">Informações pessoais</h4>
          <div className="space-y-3">
            <div className="bg-white rounded-[1.8rem] p-4 flex items-center justify-between border border-slate-50 shadow-sm">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5" />
                </div>
                <span className="text-slate-700 font-bold text-sm">Estado</span>
              </div>
              {isEditing ? (
                <select 
                  value={formData.state}
                  onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="bg-slate-50 border-none rounded-xl p-2 text-xs font-bold text-slate-500 focus:ring-2 ring-purple-500 outline-none"
                >
                  {BRAZILIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <span className="text-slate-400 text-xs font-medium">{formData.state}</span>
              )}
            </div>
            <EditItem 
              icon={<MapPin className="w-5 h-5" />} 
              label="Cidade" 
              value={formData.city} 
              isEditing={isEditing}
              onChange={val => setFormData(prev => ({ ...prev, city: val }))}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const EditItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  isEditing: boolean;
  onChange: (val: string) => void;
}> = ({ icon, label, value, isEditing, onChange }) => (
  <div className="bg-white rounded-[1.8rem] p-4 flex items-center justify-between border border-slate-50 shadow-sm">
    <div className="flex items-center gap-4 flex-1">
      <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-slate-700 font-bold text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {isEditing ? (
        <input 
          type="text" 
          value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-slate-50 border-none rounded-xl p-2 text-xs font-bold text-slate-500 focus:ring-2 ring-purple-500 outline-none text-right"
        />
      ) : (
        <span className="text-slate-400 text-xs font-medium">{value}</span>
      )}
      {!isEditing && <ChevronRight className="w-5 h-5 text-slate-300" />}
    </div>
  </div>
);
