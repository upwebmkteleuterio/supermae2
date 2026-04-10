"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { IndicateServiceModal } from '../components/IndicateServiceModal';
import { ServiceFeedbackModal } from '../components/ServiceFeedbackModal';
import { FeedbackListModal } from '../components/FeedbackListModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  ArrowLeft, Search, Star, MapPin, MessageCircle, Plus, ChevronRight,
  Heart, Stethoscope, GraduationCap, Sparkles, ShoppingBag, Map, Building2,
  MoreVertical, Pencil, Trash2, Users, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
  { id: 'Terapias', icon: <Stethoscope size={20} />, color: 'bg-blue-50 text-blue-500' },
  { id: 'Escolas', icon: <GraduationCap size={20} />, color: 'bg-emerald-50 text-emerald-500' },
  { id: 'Saúde', icon: <Heart size={20} />, color: 'bg-rose-50 text-rose-500' },
  { id: 'Lazer', icon: <Sparkles size={20} />, color: 'bg-amber-50 text-amber-500' },
  { id: 'Compras', icon: <ShoppingBag size={20} />, color: 'bg-purple-50 text-purple-500' },
];

const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

export const IndicationsHub: React.FC = () => {
  const { state, goBack, fetchIndications, deleteIndication } = useApp();
  
  const [selectedState, setSelectedState] = useState(state.userProfile.state || '');
  const [cityQuery, setCityQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const [activePartner, setActivePartner] = useState<any>(null);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [showIndicateModal, setShowIndicateModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFeedbackListModal, setShowFeedbackListModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
      await fetchIndications();
      setLoading(false);
    };
    init();
  }, [fetchIndications]);

  const filteredPartners = useMemo(() => {
    if (!state.indications) return [];
    return state.indications.filter(p => {
      const matchesCat = !selectedCat || p.category === selectedCat;
      const matchesSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesState = !selectedState || (p.state && p.state.trim().toUpperCase() === selectedState.trim().toUpperCase());
      const matchesCity = !cityQuery.trim() || (p.city && p.city.toLowerCase().includes(cityQuery.toLowerCase().trim()));
      return matchesCat && matchesSearch && matchesState && matchesCity;
    });
  }, [state.indications, selectedCat, searchQuery, selectedState, cityQuery]);

  const getCatIcon = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.icon : <Star size={20} />;
  };

  const getCatColor = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.color.split(' ')[0] : 'bg-slate-50';
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Indicações</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 space-y-6 pb-40">
        <div className="relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Search size={20} /></div>
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 ring-purple-100 outline-none" 
          />
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2 relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"><Map size={16} /></div>
             <select 
               value={selectedState} 
               onChange={(e) => setSelectedState(e.target.value)} 
               className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-600 outline-none appearance-none shadow-sm"
             >
               <option value="">Brasil</option>
               {STATES.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>
          <div className="col-span-3 relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"><Building2 size={16} /></div>
             <input 
               type="text" 
               placeholder="Buscar Cidade" 
               value={cityQuery} 
               onChange={(e) => setCityQuery(e.target.value)} 
               className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-600 outline-none shadow-sm" 
             />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
            <button 
              onClick={() => setSelectedCat(null)} 
              className={`px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${selectedCat === null ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-50 text-slate-400'}`}
            >
              Ver Tudo
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setSelectedCat(cat.id)} 
                className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all whitespace-nowrap ${selectedCat === cat.id ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-50 text-slate-400'}`}
              >
                <span className="text-xs font-bold">{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 pt-2">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-purple-400" size={32} />
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Atualizando lista...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-white">
              <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 text-sm font-medium px-10">Nenhuma indicação encontrada.</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredPartners.map(partner => (
                <div key={partner.id} className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm transition-all pb-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="h-32 w-full flex items-center justify-center relative bg-slate-50/50 border-b border-slate-50">
                    <div className={`w-16 h-16 rounded-3xl ${getCatColor(partner.category)} flex items-center justify-center shadow-inner`}>
                      {getCatIcon(partner.category)}
                    </div>
                    {partner.user_id === currentUserId && (
                      <div className="absolute top-4 right-4">
                        <button onClick={() => setActiveMenu(activeMenu === partner.id ? null : partner.id)} className="p-2 bg-white/80 rounded-full text-slate-300 shadow-sm"><MoreVertical size={20} /></button>
                        {activeMenu === partner.id && (
                          <>
                            <div className="fixed inset-0 z-[55]" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-[60] min-w-[110px] animate-in zoom-in-95 duration-200">
                              <button onClick={() => { setEditingPartner(partner); setActiveMenu(null); }} className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Pencil size={14} /> Editar</button>
                              <button onClick={() => { setDeletingId(partner.id); setActiveMenu(null); }} className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> Excluir</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="px-6 pt-6">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{partner.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-tight mb-2">
                      <MapPin size={12} className="text-purple-400" />
                      {partner.neighborhood ? `${partner.neighborhood}, ` : ''}{partner.city} - {partner.state}
                    </div>
                    <div onClick={() => { setActivePartner(partner); setShowFeedbackListModal(true); }} className="flex items-center gap-3 mb-6 cursor-pointer w-fit">
                       <div className="flex gap-0.5">
                         {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= Math.floor(partner.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-100'} />)}
                       </div>
                       <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{partner.reviews_count || 0} avaliações</span>
                    </div>
                    <div className="flex items-center gap-3 mb-8 bg-slate-50 p-3 rounded-2xl border border-slate-100/50 w-fit">
                      <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <img src={partner.creator_avatar || 'https://images.icon-icons.com/2859/PNG/512/avatar_face_girl_female_woman_profile_smiley_happy_people_icon_181665.png'} alt="Creator" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">Indicado por <span className="text-purple-600">{partner.creator_name || 'Mãe'}</span></span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <button onClick={() => window.open(`https://wa.me/${partner.phone.replace(/\D/g, '')}`, '_blank')} className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]">
                        <MessageCircle size={18} /> Entrar em contato
                      </button>
                      <button onClick={() => { setActivePartner(partner); setShowFeedbackModal(true); }} className="w-full h-14 bg-white text-purple-600 border-2 border-purple-100 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        Deixar meu feedback
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="fixed bottom-28 right-6 bg-purple-600 text-white rounded-full px-6 py-4 shadow-xl shadow-purple-200 flex items-center gap-3 active:scale-95 transition-all z-50 border-4 border-white" onClick={() => { setEditingPartner(null); setShowIndicateModal(true); }}>
        <Plus size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Indicar agora</span>
      </button>

      {(showIndicateModal || editingPartner) && (
        <IndicateServiceModal 
          onClose={() => { setShowIndicateModal(false); setEditingPartner(null); }} 
          initialData={editingPartner}
        />
      )}
      
      {showFeedbackModal && <ServiceFeedbackModal partnerId={activePartner?.id} partnerName={activePartner?.name} onClose={() => setShowFeedbackModal(false)} />}
      {showFeedbackListModal && <FeedbackListModal partnerId={activePartner?.id} partnerName={activePartner?.name} onClose={() => setShowFeedbackListModal(false)} />}
      {deletingId && (
        <ConfirmModal title="Excluir indicação?" message="Tem certeza que deseja remover esta indicação? Esta ação não pode ser desfeita." confirmText="Sim, excluir" onConfirm={() => { deleteIndication(deletingId); setDeletingId(null); }} onClose={() => setDeletingId(null)} />
      )}
    </Layout>
  );
};