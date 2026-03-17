"use client";

import React, { useState } from 'react';
import { Phone, MessageCircle, X, Wind, Heart, HelpCircle, Users } from 'lucide-react';
import { useApp } from '../store/AppContext';
import toast from 'react-hot-toast';

export const SOSButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { navigate, state } = useApp();

  const handleCallCVV = () => {
    window.location.href = 'tel:188';
  };

  const handleWhatsApp = () => {
    const contact = state.userProfile?.support_contact;
    const message = encodeURIComponent("Oi, não tô bem agora. Só queria que você soubesse.");
    
    if (contact && contact.trim() !== "") {
      // Remove caracteres não numéricos do telefone
      const cleanNumber = contact.replace(/\D/g, '');
      window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank');
    } else {
      toast.error("Ops! Você ainda não cadastrou um contato de confiança nas configurações.");
      navigate('settings');
      setIsOpen(false);
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botão Flutuante / Header */}
      <button 
        onClick={toggleModal}
        className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-all border border-purple-200 shadow-sm"
      >
        <span className="text-xs font-bold tracking-wide uppercase">Respiro</span>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Header com Fechar */}
            <div className="flex justify-between items-center p-6 pb-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-500 fill-purple-500" />
              </div>
              <button 
                onClick={toggleModal}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo Principal */}
            <div className="px-6 pb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Precisando de um respiro?</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Você não precisa carregar o mundo sozinha hoje. Escolha como quer ser acolhida agora:
              </p>

              <div className="space-y-3">
                
                {/* 7.5 Função Contato de Apoio - Os dois botões lado a lado/destacados */}
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <button 
                    onClick={handleCallCVV}
                    className="flex items-center justify-center gap-3 w-full p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl border border-red-100 transition-all group active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm">Ligar 188</span>
                  </button>

                  <button 
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-3 w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/50 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm">Enviar mensagem a alguém de confiança</span>
                  </button>
                </div>

                <div className="h-[1px] bg-slate-100 my-4" />

                {/* Outras Opções */}
                <button 
                  onClick={() => { setIsOpen(false); navigate('breathing'); }}
                  className="flex items-center gap-3 w-full p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl border border-slate-100 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:shadow-sm transition-all">
                    <Wind className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-semibold text-sm">Ver exercícios de respiração</span>
                </button>

                <button 
                  onClick={() => { setIsOpen(false); navigate('sentiment_analysis'); }}
                  className="flex items-center gap-3 w-full p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl border border-slate-100 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:shadow-sm transition-all">
                    <HelpCircle className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="font-semibold text-sm">Falar com sua mentora</span>
                </button>

                <button 
                  onClick={() => { setIsOpen(false); navigate('channels'); }}
                  className="flex items-center gap-3 w-full p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl border border-slate-100 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:shadow-sm transition-all">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="font-semibold text-sm">Ir para os Canais de Apoio</span>
                </button>

              </div>
            </div>

            {/* Footer Informativo */}
            <div className="bg-slate-50 p-4 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Estamos aqui com você
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};