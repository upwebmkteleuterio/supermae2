
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { CreateSupportPostModal } from '../components/CreateSupportPostModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  ArrowLeft, 
  Truck, 
  HandHeart, 
  Plus, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle2,
  Users,
  MoreVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export const LocalSupportMural: React.FC = () => {
  const { state, goBack, fetchLocalSupportPosts, markInterestInPost, deleteLocalSupportPost } = useApp();
  const [filter, setFilter] = useState<'all' | 'offer' | 'request'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
      fetchLocalSupportPosts();
    };
    init();
  }, []);

  const filteredPosts = state.localSupportPosts.filter(p => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  const handleInterest = async (post: any) => {
    setLoading(true);
    await markInterestInPost(post);
    setLoading(false);
    alert("Interesse enviado! A mãe receberá uma notificação e poderá entrar em contato.");
  };

  const handleConfirmDelete = async () => {
    if (!deletingPostId) return;
    await deleteLocalSupportPost(deletingPostId);
    setDeletingPostId(null);
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Mural de Apoio</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 mb-8 flex gap-2 overflow-x-auto no-scrollbar">
        <FilterPill label="Todos" active={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterPill label="Ofertas" active={filter === 'offer'} onClick={() => setFilter('offer')} />
        <FilterPill label="Pedidos" active={filter === 'request'} onClick={() => setFilter('request')} />
      </div>

      <div className="px-6 space-y-6 pb-40">
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-white">
            <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-medium px-10">Ainda não há publicações nesta categoria. Seja a primeira!</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-white shadow-sm">
                    <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{post.userName}</h3>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      post.type === 'offer' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {post.type === 'offer' ? 'Oferecendo' : 'Pedindo'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${post.category === 'carona' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                    {post.category === 'carona' ? <Truck className="w-5 h-5" /> : <HandHeart className="w-5 h-5" />}
                  </div>
                  
                  {post.userId === currentUserId && (
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                        className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {activeMenu === post.id && (
                        <>
                          <div className="fixed inset-0 z-[55]" onClick={() => setActiveMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-[60] min-w-[110px] animate-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => { setEditingPost(post); setActiveMenu(null); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Editar
                            </button>
                            <button 
                              onClick={() => { setDeletingPostId(post.id); setActiveMenu(null); }}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saída / Local</p>
                    <p className="text-xs font-bold text-slate-700">{post.locationNeighborhood}, {post.locationCity}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destino / Item</p>
                    <p className="text-xs font-bold text-slate-700">{post.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-bold text-slate-600">
                      {new Date(post.dateTime).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-bold text-slate-600">
                      {new Date(post.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleInterest(post)}
                disabled={loading || post.userId === currentUserId}
                className="w-full py-4 rounded-full bg-purple-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Tenho Interesse
              </button>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-[#A855F7] text-white rounded-full flex items-center justify-center shadow-xl shadow-purple-200 active:scale-90 transition-transform z-50 border-4 border-white"
      >
        <Plus className="w-7 h-7" />
      </button>

      {(showCreateModal || editingPost) && (
        <CreateSupportPostModal 
          onClose={() => { setShowCreateModal(false); setEditingPost(null); }} 
          initialData={editingPost}
        />
      )}

      {deletingPostId && (
        <ConfirmModal 
          title="Excluir publicação?" 
          message="Tem certeza que deseja remover esta oferta/pedido do mural? Esta ação não pode ser desfeita."
          confirmText="Sim, excluir"
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingPostId(null)}
        />
      )}
    </Layout>
  );
};

const FilterPill = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
      active ? 'bg-purple-600 text-white border-transparent shadow-md' : 'bg-white text-slate-400 border-slate-100 shadow-sm'
    }`}
  >
    {label}
  </button>
);
