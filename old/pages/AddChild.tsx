
import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { ArrowLeft, User, Calendar as CalendarIcon, Camera, Save, CheckCircle2 } from 'lucide-react';
import { Child } from '../types';

const DIAGNOSIS_OPTIONS = [
  "Já possui diagnóstico",
  "Está em investigação",
  "Ainda não tem, mas percebo sinais",
  "Prefiro não informar"
];

const calculateAge = (birthDate: string) => {
  if (!birthDate || birthDate.length < 10) return "Idade desconhecida";
  const [day, month, year] = birthDate.split('/').map(Number);
  const birth = new Date(year, month - 1, day);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return `${age} anos`;
};

export const AddChild: React.FC = () => {
  const { goBack, addChild } = useApp();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(''); // DD/MM/AAAA
  const [hasDiagnosis, setHasDiagnosis] = useState(true);
  const [diagnosisStatus, setDiagnosisStatus] = useState(DIAGNOSIS_OPTIONS[0]);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1517677129300-07b130802f46?w=200&h=200&fit=crop');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.substring(0, 8);
    if (val.length > 4) val = val.replace(/^(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    else if (val.length > 2) val = val.replace(/^(\d{2})(\d{2})/, "$1/$2");
    setBirthDate(val);
  };

  const handleSave = () => {
    if (!name || birthDate.length < 10) return;
    setLoading(true);
    
    const newChild: Child = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      birthDate,
      age: calculateAge(birthDate),
      avatar,
      hasDiagnosis,
      diagnosisStatus: hasDiagnosis ? diagnosisStatus : 'Não informado'
    };
    
    setTimeout(() => {
      addChild(newChild);
      goBack();
    }, 800);
  };

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Cadastrar Filho(a)</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 pb-32 space-y-6">
        <div className="flex flex-col items-center mb-6">
            <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg active:scale-90"
                >
                    <Camera className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setAvatar(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
            </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome Completo *</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome..." 
              className="w-full bg-white border border-slate-100 rounded-[1.5rem] p-5 focus:ring-2 ring-purple-500 outline-none shadow-sm font-bold text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Data de Nascimento (DD/MM/AAAA) *</label>
            <div className="relative">
              <input 
                type="text" 
                value={birthDate}
                onChange={handleDateChange}
                placeholder="Ex: 01/01/2018" 
                maxLength={10}
                className="w-full bg-white border border-slate-100 rounded-[1.5rem] p-5 focus:ring-2 ring-purple-500 outline-none shadow-sm font-bold text-slate-700"
              />
              <CalendarIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-50 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700">Diagnóstico</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight">Possui laudo ou está em processo?</span>
          </div>
          <div 
            onClick={() => setHasDiagnosis(!hasDiagnosis)}
            className={`w-14 h-7 rounded-full p-1 transition-all cursor-pointer flex items-center ${hasDiagnosis ? 'bg-purple-600' : 'bg-slate-200'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${hasDiagnosis ? 'translate-x-7' : 'translate-x-0'}`}></div>
          </div>
        </div>

        {hasDiagnosis && (
          <div className="grid grid-cols-1 gap-2 animate-in slide-in-from-top-4">
            {DIAGNOSIS_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setDiagnosisStatus(option)}
                className={`w-full text-left p-5 rounded-[1.5rem] border transition-all flex items-center justify-between ${
                  diagnosisStatus === option 
                  ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-200' 
                  : 'bg-white border-slate-100 text-slate-500'
                }`}
              >
                <span className="font-bold text-sm">{option}</span>
                {diagnosisStatus === option && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
              </button>
            ))}
          </div>
        )}

        <button 
          onClick={handleSave}
          disabled={!name || birthDate.length < 10 || loading}
          className="w-full bg-purple-600 text-white py-5 rounded-[2.5rem] font-black shadow-xl shadow-purple-100 active:scale-95 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
        >
          {loading ? <CheckCircle2 className="w-5 h-5 animate-bounce" /> : <Save className="w-5 h-5" />}
          {loading ? 'Salvando...' : 'Cadastrar e Continuar'}
        </button>
      </div>
    </Layout>
  );
};
