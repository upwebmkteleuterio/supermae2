"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { IntegrityBanner } from '../components/diagnostics/IntegrityBanner';
import { LogMonitor } from '../components/diagnostics/LogMonitor';
import { runDeepScan, DiagnosticLog } from '../utils/DiagnosticService';
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
  
  // Diagnóstico
  const [diagLogs, setDiagLogs] = useState<DiagnosticLog[]>([]);
  const [dbRawCount, setDbRawCount] = useState(0);

  const [selectedState, setSelectedState] = useState(state.userProfile.state || '');
  const [cityQuery, setCityQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const [activePartner, setActivePartner] = useState<any>(null);
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
      if (user) {
        setCurrentUserId(user.id);
        const scans = await runDeepScan(user.id);
        setDiagLogs(scans);
        
        const { count } = await supabase.from('indications_partners').select('*', { count: 'exact', head: true });
        setDbRawCount(count || 0);
      }
      await fetchIndications();
      setLoading(false);
    };
    init();
  }, [fetchIndications]);

  const filteredPartners = useMemo(() => {
    if (!state.indications) return [];
    return state.indications.filter(p => {
      const matchesCat = !selectedCat || p.category === selectedCat;
      const matchesSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase());
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
      <div className="pt-12 px-6 flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Indicações</h1>
        </div>
        <SOSButton />
      </div>

      <IntegrityBanner 
        dbStatus={diagLogs.some(l => l.status === 'ERROR') ? 'error' : 'online'} 
        isAtypical={!!state.userProfile.welcomingGoal?.includes('atípico')}
        dbCount={dbRawCount}
        uiCount={filteredPartners.length}
      />

      <div className="px-6 space-y-6 pb-40">
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2 relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"><Map size={16} /></div>
             <select 
               value={selectedState} 
               onChange={(e) => setSelectedState(e.target.value)} 
               className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-600 outline-none appearance-none shadow-sm focus:ring-2 ring-purple-50"
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
               className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-600 outline-none shadow-sm focus:ring-2 ring-purple-50" 
             />
          </div>
        </div>

        <div className="space-y-6 pt-2">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-purple-400" size={32} />
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Varredura em curso...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-white">
              <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 text-sm font-medium px-10">
                Nenhuma indicação encontrada.
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredPartners.map(partner => (
                <div key={partner.id} className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm transition-all pb-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="h-32 w-full flex items-center justify-center relative bg-slate-50/50 border-b border-slate-50">
                    <div className={`w-16 h-16 rounded-3xl ${getCatColor(partner.category)} flex items-center justify-center shadow-inner`}>
                      {getCatIcon(partner.category)}
                    </div>
                  </div>
                  <div className="px-6 pt-6">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{partner.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-tight mb-2">
                      <MapPin size={12} className="text-purple-400" />
                      {partner.city} - {partner.state}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <LogMonitor 
        logs={diagLogs} 
        onClear={() => setDiagLogs([])} 
        mismatchReport={{ dbCount: dbRawCount, uiCount: filteredPartners.length }} 
      />

      <button className="fixed bottom-28 right-6 bg-purple-600 text-white rounded-full px-6 py-4 shadow-xl shadow-purple-200 flex items-center gap-3 active:scale-95 transition-all z-50 border-4 border-white" onClick={() => setShowIndicateModal(true)}>
        <Plus size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Indicar agora</span>
      </button>

      {showIndicateModal && <IndicateServiceModal onClose={() => setShowIndicateModal(false)} />}
    </Layout>
  );
};