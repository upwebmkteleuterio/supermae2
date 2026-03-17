import React, { useState } from 'react';
import { Bell, X, Shield, Heart, Phone, MessageCircle, ExternalLink, ArrowLeft, Wind, HelpCircle, Users } from 'lucide-react';
import { useApp } from '../store/AppContext';
import toast from 'react-hot-toast';

export const SOSButton: React.FC = () => {
  const { toggleBreathing, navigate, state } = useApp();
  const [showModal, setShowModal] = useState(false);

  const handleCallCVV = () => {
    window.location.href = 'tel:188';
  };

  const handleWhatsApp = () => {
    const contact = state.userProfile?.phone; // Usando o telefone do perfil como fallback ou um campo específico se existir
    const message = encodeURIComponent("Oi, não tô bem agora. Só queria que você soubesse.");
    
    // Se houver um campo específico para contato de apoio no futuro, usaríamos ele. 
    // Por enquanto, se não houver lógica de busca de contato de confiança, abrimos o seletor do WhatsApp ou um número padrão se definido.
    if (contact && contact.trim() !== "") {
      const cleanNumber = contact.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    } else {
      // Se não tem contato, abre o WhatsApp para escolher um contato (link genérico com mensagem)
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  const closeModals = () => {
    setShowModal(false);
  };

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

            <div className="flex flex-col items-center gap-6 w-full">
              {/* Shield Icon Container */}
              <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                <div className="absolute inset-0 bg-purple-50 rounded-full animate-pulse opacity-50"></div>
                <div className="relative border-2 border-purple-400 rounded-2xl p-4 flex items-center justify-center bg-white shadow-sm">
                  <Shield className="w-10 h-10 text-purple-400" />
                  <Heart className="w-5 h-5 text-purple-600 absolute fill-purple-600" />
                </div>
              </div>

              {/* Text Content Section */}
              <div>
                <h1 className="text-[22px] font-bold text-slate-900 leading-[1.2] mb-[10px]">
                  Você não está sozinha
                </h1>
                <p className="text-[14px] text-slate-500 font-medium leading-[1.6] px-2">
                  Estou aqui com você. Escolha como quer ser acolhida agora:
                </p>
              </div>

              {/* Action Buttons Section (7.5 Função Contato de Apoio) */}
              <div className="w-full space-y-3 mt-2">
                
                {/* Botões Principais solicitados pela cliente */}
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

                {/* Outras Opções de Apoio */}
                <button 
                  onClick={() => { closeModals(); toggleBreathing(true); }}
                  className="w-full h-[54px] flex items-center justify-center gap-3 bg-slate-50 text-slate-700 text-[14px] font-semibold rounded-2xl transition-all active:scale-95"
                >
                  <Wind className="w-5 h-5 text-blue-400" />
                  Respirar e me acalmar
                </button>

                <button 
                  onClick={() => { closeModals(); navigate('sentiment_analysis'); }}
                  className="w-full h-[54px] flex items-center justify-center gap-3 bg-slate-50 text-slate-700 text-[14px] font-semibold rounded-2xl transition-all active:scale-95"
                >
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  Falar com sua mentora IA
                </button>

              </div>

              {/* Footer Link */}
              <div className="mt-2">
                <button 
                  onClick={closeModals}
                  className="text-slate-400 font-black text-[10px] uppercase tracking-widest py-2 px-4"
                >
                  Voltar
                </button>
              </div>
            </div>
          </main>
          
        </div>
      )}
    </>
  );
};