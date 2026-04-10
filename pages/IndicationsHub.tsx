"use client";

import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Plus, 
  ChevronRight,
  Heart,
  Stethoscope,
  GraduationCap,
  Sparkles,
  ShoppingBag
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
    reviews: 12,
    location: 'Centro, Santa Maria - RS',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    tags: ['TEA', 'TDAH', 'ABA']
  },
  {
    id: '2',
    name: 'Escola Pequenos Passos',
    category: 'escolas',
    rating: 4.7,
    reviews: 8,
    location: 'Dores, Santa Maria - RS',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
    tags: ['Inclusiva', 'Montessori']
  },
  {
    id: '3',
    name: 'Dra. Ana Silveira - Fono',
    category: 'terapias',
    rating: 5.0,
    reviews: 15,
    location: 'Camobi, Santa Maria - RS',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?w=400&h=300&fit=crop',
    tags: ['Fala', 'Deglutição']
  }
];

export const IndicationsHub: React.FC = () => {
  const { goBack } = useApp();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
        {/* Search Bar */}
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

        {/* Categories Horizontal Scroll */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Categorias de serviços</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
            <button 
              onClick={() => setSelectedCat(null)}
              className={`px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${
                selectedCat === null 
                ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                : 'bg-white border-slate-50 text-slate-400'
              }`}
            >
              Ver Tudo
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all whitespace-nowrap ${
                  selectedCat === cat.id 
                  ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                  : 'bg-white border-slate-50 text-slate-400'
                }`}
              >
                <span className={selectedCat === cat.id ? 'text-white' : cat.color.split(' ')[1]}>{cat.icon}</span>
                <span className="text-xs font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Partners Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between ml-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {selectedCat ? CATEGORIES.find(c => c.id === selectedCat)?.name : 'Todas as indicações'}
            </h2>
            <span className="text-[10px] font-bold text-purple-400">{filteredPartners.length} locais</span>
          </div>

          <div className="grid gap-6">
            {filteredPartners.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 text-sm font-bold">Nenhum parceiro encontrado.</p>
              </div>
            ) : (
              filteredPartners.map(partner => (
                <div key={partner.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm group active:scale-[0.98] transition-all">
                  <div className="h-40 w-full relative">
                    <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-slate-700">{partner.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 text-base leading-tight pr-4">{partner.name}</h3>
                      <button className="p-2 bg-slate-50 rounded-full text-slate-300 hover:text-purple-500 transition-colors">
                        <Plus size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-4 font-medium">
                      <MapPin size={12} />
                      {partner.location}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {partner.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-purple-100 flex items-center justify-center gap-2 group-hover:bg-purple-700 transition-all">
                      Ver página completa
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating CTA "Indicar Agora" */}
      <button 
        className="fixed bottom-28 right-6 bg-purple-600 text-white rounded-full px-6 py-4 shadow-xl shadow-purple-200 flex items-center gap-3 active:scale-95 transition-all z-50 border-4 border-white"
        onClick={() => alert("Em breve: Formulário para indicar parceiros!")}
      >
        <Plus size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Indicar agora</span>
      </button>
    </Layout>
  );
};