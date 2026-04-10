"use client";

import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { IndicateServiceModal } from '../components/IndicateServiceModal';
import { ServiceFeedbackModal } from '../components/ServiceFeedbackModal';
import { FeedbackListModal } from '../components/FeedbackListModal';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  MapPin, 
  MessageCircle, 
  Plus, 
  ChevronRight,
  Heart,
  Stethoscope,
  GraduationCap,
  Sparkles,
  ShoppingBag,
  Users
} from 'lucide-react';

const CATEGORIES = [
  { id: 'terapias', name: 'Terapias', icon: <Stethoscope size={20} />, color: 'bg-blue-50 text-blue-500' },
  { id: 'escolas', name: 'Escolas', icon: <GraduationCap size={20} />, color: 'bg-emerald-50 text-emerald-500' },
  { id: 'saude', name: 'Saúde', icon: <Heart size={20} />, color: 'bg-rose-50 text-rose-500' },
  { id: 'lazer', name: 'Lazer', icon: <Sparkles size={20} />, color: 'bg-amber-50 text-amber-500' },
  { id: 'compras', name: 'Compras', icon: <ShoppingBag size={20} />, color: 'bg-purple-50 text-purple-500' },
];

const MOCK_PARTNERS = [
  {
    id: '1',
    name: 'Centro Terapêutico Florescer',
    category: 'terapias',
    rating: 4.9,
    reviewsCount: 12,
    state: 'RS',
    city: 'Santa Maria',
    neighborhood: 'Centro',
    phone: '55999999999',
    indicatedBy: { name: 'Mariana S.', avatar: 'https://i.pravatar.cc/100?u=mariana' },
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    tags: ['TEA', 'TDAH', 'ABA']
  },
  {
    id: '2',
    name: 'Dra. Ana Silveira - Fono',
    category: 'terapias',
    rating: 5.0,
    reviewsCount: 8,
    state: 'RS',
    city: 'Santa Maria',
    neighborhood: 'Camobi',
    phone: '55888888888',
    indicatedBy: { name: 'Fernanda L.', avatar: 'https://i.pravatar.cc/100?u=fernanda' },
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?w=400&h=300&fit=crop',
    tags: ['Fala', 'Deglutição']
  }
];

export const IndicationsHub: React.FC = () => {
  const { goBack } = useApp();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States para Modais
  const [activePartner, setActivePartner] = useState<any>(null);
  const [showIndicateModal, setShowIndicateModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFeedbackListModal, setShowFeedbackListModal] = useState(false);

  const filteredPartners = MOCK_PARTNERS.filter(p => {
    const matchesCat = selectedCat ? p.category === selectedCat : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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

      <div className="px-6 space-y-8 pb-40">
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="O que você procura?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 ring-purple-100 outline-none transition-all"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Categorias de serviços</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
            <button onClick={() => setSelectedCat(null)} className={`px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${selectedCat === null ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-slate-50 text-slate-400'}`}>Ver Tudo</button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all whitespace-nowrap ${selectedCat === cat.id ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-slate-50 text-slate-400'}`}>
                <span className={selectedCat === cat.id ? 'text-white' : cat.color.split(' ')[1]}>{cat.icon}</span>
                <span className="text-xs font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between ml-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{selectedCat ? CATEGORIES.find(c => c.id === selectedCat)?.name : 'Todas as indicações'}</h2>
            <span className="text-[10px] font-bold text-purple-400">{filteredPartners.length} locais</span>
          </div>

          <div className="grid gap-8">
            {filteredPartners.map(partner => (
              <div key={partner.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm transition-all pb-6">
                <div className="h-40 w-full relative">
                  <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Star size={12} className="text-amber-500 fill-amber-400" />
                    <span className="text-[10px] font-black text-slate-700">{partner.rating}</span>
                  </div>
                </div>

                <div className="px-6 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{partner.name}</h3>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-tight">
                        <MapPin size={12} className="text-purple-400" />
                        {partner.neighborhood ? `${partner.neighborhood}, ` : ''}{partner.city} - {partner.state}
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => { setActivePartner(partner); setShowFeedbackListModal(true); }}
                      className="flex flex-col items-end cursor-pointer active:scale-95 transition-transform"
                    >
                       <div className="flex gap-0.5">
                         {[1,2,3,4,5].map(i => <Star key={i} size={10} className={i <= Math.floor(partner.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-100'} />)}
                       </div>
                       <span className="text-[9px] font-black text-purple-400 mt-1 uppercase tracking-widest">{partner.reviewsCount} avaliações</span>
                    </div>
                  </div>

                  {/* Info Indicator */}
                  <div className="flex items-center gap-2 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100 w-fit">
                    <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                      <img src={partner.indicatedBy.avatar} alt={partner.indicatedBy.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Indicado por <span className="text-purple-600">{partner.indicatedBy.name}</span></span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {partner.tags.map(tag => (
                      <span key={tag} className="text-[8px] font-black uppercase tracking-widest bg-purple-50 text-purple-500 px-3 py-1 rounded-lg border border-purple-100">{tag}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => window.open(`https://wa.me/${partner.phone}`, '_blank')}
                      className="w-full py-4.5 bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                      <MessageCircle size={18} />
                      Entrar em contato
                    </button>
                    
                    <button 
                      onClick={() => { setActivePartner(partner); setShowFeedbackModal(true); }}
                      className="w-full py-4.5 bg-white text-purple-600 border-2 border-purple-100 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:bg-purple-50 transition-all"
                    >
                      Deixar meu feedback
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="fixed bottom-28 right-6 bg-purple-600 text-white rounded-full px-6 py-4 shadow-xl shadow-purple-200 flex items-center gap-3 active:scale-95 transition-all z-50 border-4 border-white" onClick={() => setShowIndicateModal(true)}>
        <Plus size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Indicar agora</span>
      </button>

      {/* MODAIS */}
      {showIndicateModal && <IndicateServiceModal onClose={() => setShowIndicateModal(false)} />}
      {showFeedbackModal && <ServiceFeedbackModal partnerName={activePartner?.name} onClose={() => setShowFeedbackModal(false)} />}
      {showFeedbackListModal && <FeedbackListModal partnerName={activePartner?.name} onClose={() => setShowFeedbackListModal(false)} />}
    </Layout>
  );
};