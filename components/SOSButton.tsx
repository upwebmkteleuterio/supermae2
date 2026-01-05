
import React, { useState } from 'react';
import { Bell, X, Shield, Heart, Phone, MessageCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const SOSButton: React.FC = () => {
  const { toggleBreathing, navigate } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState<'initial' | 'cvv'>('initial');

  const handleOpenBreathing = () => {
    setShowModal(false);
    toggleBreathing(true);
  };

  const handleCallCVV = () => {
    window.location.href = 'tel:188';
  };

  const handleWhatsApp = () => {
    // Placeholder conforme solicitado: "depois te passo o numero"
    // window.open('https://wa.me/5511999999999', '_blank');
  };

  const handleCVVSite = () => {
    window.open('https://cvv.org.br/o-cvv/', '_blank');
  };

  const closeModals = () => {
    setShowModal(false);
    setModalView('initial');
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm relative active:scale-95 transition-all cursor-pointer group z-50"
        aria-label="Botão de Ajuda SOS"
      >
        <Bell className="w-5 h-5 text-purple-400 pointer-events-none" />
        <div className="absolute -top-1 -right-1 bg-[#A855F7] px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center pointer-events-none">
          <span className="text-[7px] font-black text-white leading-none tracking-tighter">SOS</span>
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          
          {modalView === 'initial' ? (
            /* MODAL 1: APOIO IMEDIATO */
            <main className="bg-white w-full max-w-[330px] rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl relative animate-in zoom-in-95 duration-300">
              {/* Botão Fechar (X) */}
              <button 
                onClick={closeModals}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center gap-6 w-full">
                {/* Illustration Section */}
                <div className="w-40 h-auto flex justify-center items-center mb-2">
                  <img 
                    alt="Você não está sozinha" 
                    className="w-full h-auto object-contain" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV3isclR530S8f_57fQC7tTvtTZT6EVlcmwp3Hjp6P_WfDSdvfRheHO0dJy3D-VZH55iKDhB5c9n-L4gr-n8SZLH7qtixkCP_J61SJG9ABdxLN8evesUMGt73NMt3eS2j5E_AwYgRMGoF7Z7yMd439MsbtWJ9dNSd-EKk5C11XIEucFDTgYzoBjRR_j1eMKeVwezL9mlYtUgRKH0sBgilfgWnSFRWT8pEQPUPYA82OrR3L0rGoGnsQUZIyzN6qpXt9u481KotNX51g" 
                  />
                </div>

                {/* Text Content Section */}
                <div>
                  <h1 className="text-[22px] font-bold text-slate-900 leading-[1.2] mb-[10px]">
                    Você não está sozinha
                  </h1>
                  <p className="text-[16px] text-slate-600 font-medium leading-[1.5] px-1">
                    Estou aqui com você. Vamos respirar juntas ou prefere conversar com alguém agora?
                  </p>
                </div>

                {/* Action Buttons Section */}
                <div className="w-full space-y-3 mt-2">
                  <button 
                    onClick={handleOpenBreathing}
                    className="w-full h-[54px] flex items-center justify-center bg-purple-600 text-white text-[17px] font-bold rounded-full transition-all active:scale-95 shadow-md shadow-purple-100"
                  >
                    Respirar e me acalmar
                  </button>
                  <button 
                    onClick={() => setModalView('cvv')}
                    className="w-full h-[54px] flex items-center justify-center bg-white border-[2px] border-purple-600 text-purple-600 text-[17px] font-bold rounded-full transition-all active:scale-95"
                  >
                    Falar com alguém do 188
                  </button>
                </div>

                {/* Footer Link */}
                <div className="mt-4">
                  <button 
                    onClick={closeModals}
                    className="text-purple-600 font-black text-xs uppercase tracking-widest py-2 px-4"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </main>
          ) : (
            /* MODAL 2: DIRECIONAMENTO CVV (Conforme Imagem) */
            <main className="bg-white w-full max-w-[330px] rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl relative animate-in zoom-in-95 duration-300">
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
                <div className="px-2">
                  <p className="text-[14px] text-slate-500 font-medium leading-[1.6]">
                    O CVV atende 24 horas por telefone. A ligação é gratuita e anônima.
                  </p>
                </div>

                {/* Action Buttons Section (Conforme as Frames da Imagem) */}
                <div className="w-full space-y-3">
                  {/* Frame 2147225247: Direcionamento para a ligação */}
                  <button 
                    onClick={handleCallCVV}
                    className="w-full h-[54px] flex items-center justify-center bg-purple-500 text-white text-[15px] font-bold rounded-full transition-all active:scale-95 shadow-lg shadow-purple-100"
                  >
                    Ligar agora para o CVV
                  </button>

                  {/* Frame 2147225248: Direcionamento Whatsapp */}
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full h-[54px] flex items-center justify-center bg-purple-500 text-white text-[15px] font-bold rounded-full transition-all active:scale-95 shadow-lg shadow-purple-100"
                  >
                    Enviar mensagem para contato de apoio
                  </button>

                  {/* Frame 2147225246: Direcionamento site CVV */}
                  <button 
                    onClick={handleCVVSite}
                    className="w-full h-[54px] flex items-center justify-center bg-white border border-purple-300 text-purple-400 text-[15px] font-bold rounded-full transition-all active:scale-95"
                  >
                    O que é o CVV?
                  </button>
                </div>

                {/* Footer Link: Voltar para o primeiro modal */}
                <div className="mt-4">
                  <button 
                    onClick={() => setModalView('initial')}
                    className="text-purple-600 font-black text-xs uppercase tracking-widest py-2 px-4 flex items-center gap-2"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </main>
          )}
          
        </div>
      )}
    </>
  );
};
