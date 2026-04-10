"use client";

import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Tag, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { IndicationPartner } from '../types';

interface IndicateServiceModalProps {
  onClose: () => void;
  initialData?: IndicationPartner;
}

const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const CATEGORIES = ["Terapias", "Escolas", "Saúde", "Lazer", "Compras"];

export const IndicateServiceModal: React.FC<IndicateServiceModalProps> = ({ onClose, initialData }) => {
  const { createIndication, updateIndication } = useApp();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    neighborhood: '',
    category: '',
    phone: ''
  });

  const [displayPhone, setDisplayPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Efeito para carregar dados se for Edição
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        state: initialData.state,
        city: initialData.city,
        neighborhood: initialData.neighborhood || '',
        category: initialData.category,
        phone: initialData.phone
      });
      formatPhone(initialData.phone);
    }
  }, [initialData]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let masked = digits;
    if (digits.length > 2) masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length > 7) masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    
    setDisplayPhone(masked);
    setFormData(prev => ({ ...prev, phone: digits }));
    setIsPhoneValid(digits.length === 11);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.state || !formData.city.trim() || !formData.category || !isPhoneValid) {
      return;
    }
    
    setLoading(true);
    let success = false;

    if (initialData) {
      // MODO EDIÇÃO: Atualiza mantendo o ID
      success = await updateIndication(initialData.id, formData);
    } else {
      // MODO CRIAÇÃO
      success = await createIndication(formData);
    }

    if (success) {
      onClose();
    } else {
      alert("Erro ao processar solicitação. Tente novamente.");
    }
    setLoading(false);
  };

  const isFormComplete = 
    formData.name.trim().length > 2 && 
    formData.state !== '' && 
    formData.city.trim().length > 2 && 
    formData.category !== '' && 
    isPhoneValid;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? 'Editar Indicação' : 'Nova Indicação'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Local/Profissional *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Clínica ABC"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 ring-purple-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Estado *</label>
              <select 
                value={formData.state}
                onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100"
              >
                <option value="">UF</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Cidade *</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Sua cidade"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bairro (Opcional)</label>
            <input 
              type="text" 
              value={formData.neighborhood}
              onChange={e => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
              placeholder="Ex: Centro"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Categoria *</label>
            <select 
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100"
            >
              <option value="">Selecionar...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">WhatsApp de Contato *</label>
            <div className="relative">
              <input 
                type="tel" 
                value={displayPhone}
                onChange={(e) => formatPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className={`w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none pl-12 transition-all ${
                  displayPhone.length > 0 && !isPhoneValid ? 'ring-2 ring-red-100' : ''
                }`}
              />
              <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isPhoneValid ? 'text-green-500' : 'text-slate-300'}`} />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading || !isFormComplete}
            className="w-full bg-purple-600 text-white h-14 rounded-[2rem] font-bold shadow-xl shadow-purple-100 mt-4 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? 'Salvando...' : (initialData ? 'Atualizar Indicação' : 'Salvar Indicação')}
          </button>
        </div>
      </div>
    </div>
  );
};