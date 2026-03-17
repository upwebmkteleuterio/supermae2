import React, { useState } from 'react';
import { Bell, X, Shield, Heart, Phone, MessageCircle, ExternalLink, ArrowLeft, Wind, HelpCircle, Users, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const SOSButton: React.FC = () => {
  const { toggleBreathing, navigate, state } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState<'initial' | 'resources'>('initial');

  const handleCallCVV = () => {
    window.location.href = 'tel:188';
    setModalView('resources');
  };

  const handleWhatsApp = () => {
    const contact = state.userProfile?.phone;
    const message = encodeURIComponent("Oi, não tô bem agora. Só queria que você soubesse.");
    
    if (contact && contact.trim() !== "") {
      const cleanNumber = contact.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
    setModalView('resources');
  };

  const closeModals = () => {
    setShowModal(false);
    setTimeout(() => setModalView('initial'), 300);
  };

  const ResourceItem = ({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick: () => void, color: string }) => (
    <button 
      onClick={onClick}
      className="w-full h-[54px] flex items-center gap-4 px-5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[14px] font-semibold rounded-2xl transition-all active:scale-95 group border border-slate-100/50"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center group-hover:shadow-sm transition-all`}>
        {icon}
      </div>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="px-6 py-2.5 rounded-full bg-[#A855F7] flex items-center justify-center text-white shadow-lg shadow-purple-100 relative active:scale-95 transition-all cursor-pointer group z-50 border border-white/20"
        aria-label="Botão Respiro"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">Respiro</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          
          <main className="bg-white w-full max-w-[350px] rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Botão Fechar (X) */}
            <button 
              onClick={closeModals}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>

            {modalView === 'initial' ? (
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                  <div className="absolute inset-0 bg-purple-50 rounded-full animate-pulse opacity-50"></div>
                  <div className="relative border-2 border-purple-400 rounded-2xl p-4 flex items-center justify-center bg-white shadow-sm">
                    <Shield className="w-10 h-10 text-purple-400" />
                    <Heart className="w-5 h-5 text-purple-600 absolute fill-purple-600" />
                  </div>
                </div>

                <div>
                  <h1 className="text-[22px] font-bold text-slate-900 leading-[1.2] mb-[10px]">
                    Você não está sozinha
                  </h1>
                  <p className="text-[14px] text-slate-500 font-medium leading-[1.6] px-2">
                    Estou aqui com você. Escolha como quer ser acolhida agora:
                  </p>
                </div>

                <div className="w-full space-y-3 mt-2">
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleCallCVV}
                      className="w-full h-[58px] flex items-center justify-center gap-3 bg-red-50 border border-red-100 text-red-600 text-[15px] font-bold rounded-2xl transition-all active:scale-95 shadow-sm"
                    >
                      <Phone className="w-5 h-5" />
                      Ligar 188
                    </button>

                    <button 
                      onClick={handleWhatsApp}
                      className="w-full h-[58px] flex items-center justify-center gap-3 bg-purple-600 text-white text-[14px] font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-purple-100"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Enviar mensagem a alguém de confiança
                    </button>
                  </div>

                  <div className="h-px bg-slate-100 my-4 w-full" />

                  <ResourceItem 
                    icon={<Wind className="w-5 h-5 text-blue-400" />} 
                    label="Respirar e me acalmar" 
                    onClick={() => { closeModals(); toggleBreathing(true); }}
                    color="bg-white"
                  />

                  <ResourceItem 
                    icon={<HelpCircle className="w-5 h-5 text-purple-400" />} 
                    label="Falar com sua mentora IA" 
                    onClick={() => { closeModals(); navigate('sentiment_analysis'); }}
                    color="bg-white"
                  />
                </div>

                <div className="mt-2">
                  <button onClick={closeModals} className="text-slate-400 font-black text-[10px] uppercase tracking-widest py-2 px-4">Voltar</button>
                </div>
              </div>
            ) : (
              /* 7.4 Integração com Recursos - Tela pós-uso */
              <div className="flex flex-col items-center gap-6 w-full animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                  <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                </div>

                <div>
                  <h1 className="text-[20px] font-bold text-slate-900 leading-[1.2] mb-[10px]">
                    Recursos que podem te ajudar agora:
                  </h1>
                  <p className="text-[13px] text-slate-500 font-medium leading-[1.5] px-4">
                    Continue cuidando de você com essas ferramentas pensadas para o seu bem-estar.
                  </p>
                </div>

                <div className="w-full space-y-3 mt-2">
                  <ResourceItem 
                    icon={<Wind className="w-5 h-5 text-blue-400" />} 
                    label="Respiração Guiada" 
                    onClick={() => { closeModals(); toggleBreathing(true); }}
                    color="bg-white"
                  />
                  <ResourceItem 
                    icon={<BookOpen className="w-5 h-5 text-emerald-400" />} 
                    label="Diário Emocional" 
                    onClick={() => { closeModals(); navigate('mood_selection'); }}
                    color="bg-white"
                  />
                  <ResourceItem 
                    icon={<Users className="w-5 h-5 text-purple-400" />} 
                    label="Canal de Desabafo" 
                    onClick={() => { closeModals(); navigate('channels_list'); }}
                    color="bg-white"
                  />
                  <ResourceItem 
                    icon={<Sparkles className="w-5 h-5 text-amber-400" />} 
                    label="Áudio Afetivo por IA" 
                    onClick={() => { closeModals(); navigate('sentiment_analysis'); }}
                    color="bg-white"
                  />
                </div>

                <div className="mt-4">
                  <button 
                    onClick={closeModals} 
                    className="w-full text-purple-600 font-bold text-sm bg-purple-50 py-3 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    Agora estou bem, obrigada!
                  </button>
                </div>
              </div>
            )}
          </main>
          
        </div>
      )}
    </>
  );
};