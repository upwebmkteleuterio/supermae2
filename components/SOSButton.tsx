import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Shield, 
  Heart, 
  Phone, 
  MessageCircle, 
  Wind, 
  HelpCircle, 
  Users, 
  Sparkles, 
  BookOpen, 
  Send,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GoogleGenAI } from "@google/genai";
import toast from 'react-hot-toast';

type ModalView = 'initial' | 'desabafo_loading' | 'desabafo_response';

export const SOSButton: React.FC = () => {
  const { toggleBreathing, navigate, state } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<ModalView>('initial');
  
  // Estados para o Desabafo (7.3)
  const [desabafoText, setDesabafoText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const QUICK_PHRASES = [
    "Sinto que tudo está demais.",
    "Não quero mais continuar assim.",
    "Não consigo dar conta."
  ];

  const handleCallCVV = () => {
    window.location.href = 'tel:188';
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
  };

  const handleSendDesabafo = async (text: string) => {
    const input = text || desabafoText;
    if (!input.trim()) return;

    setView('desabafo_loading');
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Mãe atípica em crise enviou o seguinte desabafo: "${input}"
        
        OBJETIVO: Dê uma resposta de mentora empática, poética e curta (máximo 3 frases). 
        Valide o sentimento dela e diga que ela não está sozinha.
      `;

      const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { 
          systemInstruction: "Você é uma mentora empática especialista em maternidade atípica. Seu tom é doce, observador e encorajador. Responda de forma breve."
        }
      });

      const responseText = res.text || "Estou aqui com você. Respire fundo, sua dor é válida e você não precisa carregar tudo agora.";
      setAiResponse(responseText);
      setView('desabafo_response');
    } catch (error) {
      console.error("Erro IA SOS:", error);
      setAiResponse("Estou aqui com você. Respire fundo, sua dor é válida e você não precisa carregar tudo agora. Vamos dar um passo de cada vez?");
      setView('desabafo_response');
    } finally {
      setIsAiLoading(false);
    }
  };

  const closeModals = () => {
    setShowModal(false);
    // Resetar estados após o fechamento (animação de saída)
    setTimeout(() => {
      setView('initial');
      setDesabafoText('');
      setAiResponse('');
    }, 300);
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
      {/* 7.1 Identidade Visual: Ícone de coração com curativo */}
      <button 
        onClick={() => setShowModal(true)}
        className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-purple-100 relative active:scale-95 transition-all cursor-pointer group z-50 border border-purple-50"
        aria-label="Botão de Apoio"
      >
        <div className="relative">
          <Heart className="w-6 h-6 text-purple-500 fill-purple-500/20" />
          {/* O "Curativo": Duas linhas cruzadas simulando um band-aid */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-amber-200/90 rounded-full rotate-45 border border-amber-300/30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-100 rounded-full rotate-45"></div>
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          
          <main className="bg-white w-full max-w-[360px] rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Botão Fechar (X) */}
            <button 
              onClick={closeModals}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>

            {view === 'initial' && (
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-1">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>

                {/* 7.2 Texto Inicial da IA */}
                <div>
                  <h1 className="text-[20px] font-bold text-slate-900 leading-[1.3] mb-[8px]">
                    Você não está sozinha. Estou aqui com você.
                  </h1>
                  <p className="text-[14px] text-slate-500 font-medium leading-[1.5] px-2">
                    Vamos respirar juntas ou prefere conversar com alguém agora?
                  </p>
                </div>

                {/* Botões Centrais */}
                <div className="w-full space-y-3">
                  <button 
                    onClick={() => { closeModals(); toggleBreathing(true); }}
                    className="w-full h-[58px] flex items-center justify-center gap-3 bg-purple-600 text-white text-[15px] font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-purple-100"
                  >
                    <Wind className="w-5 h-5" />
                    Respirar e me acalmar
                  </button>

                  <button 
                    onClick={handleCallCVV}
                    className="w-full h-[58px] flex items-center justify-center gap-3 bg-red-50 border border-red-100 text-red-600 text-[15px] font-bold rounded-2xl transition-all active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    Falar com alguém do 188
                  </button>
                  
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full h-[48px] flex items-center justify-center gap-2 text-purple-600 text-[13px] font-bold rounded-2xl transition-all active:scale-95 border border-purple-100"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Mensagem de confiança
                  </button>
                </div>

                <div className="h-px bg-slate-100 w-full my-2" />

                {/* 7.3 Campo de Desabafo Estruturado */}
                <div className="w-full text-left">
                  <h3 className="text-[13px] font-bold text-slate-800 mb-3 ml-1 uppercase tracking-wider opacity-60">
                    Escreva como você está se sentindo agora:
                  </h3>
                  
                  {/* Frases Clicáveis */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {QUICK_PHRASES.map((phrase, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSendDesabafo(phrase)}
                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-medium text-slate-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all active:scale-95"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>

                  {/* Campo de Digitação */}
                  <div className="relative">
                    <textarea 
                      value={desabafoText}
                      onChange={(e) => setDesabafoText(e.target.value)}
                      placeholder="Desabafe aqui..."
                      className="w-full h-24 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 ring-purple-500/10 outline-none resize-none transition-all"
                    />
                    <button 
                      onClick={() => handleSendDesabafo(desabafoText)}
                      disabled={!desabafoText.trim()}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all active:scale-90 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {view === 'desabafo_loading' && (
              <div className="flex flex-col items-center justify-center py-20 gap-6 w-full animate-in fade-in duration-500">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-purple-500">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-lg">Ouvindo com carinho...</p>
                  <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-black">Sintonizando acolhimento</p>
                </div>
              </div>
            )}

            {view === 'desabafo_response' && (
              <div className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-1">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                </div>

                <div className="bg-purple-50/50 p-6 rounded-[2rem] border border-purple-100 relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Heart className="w-4 h-4 text-purple-400 fill-purple-400" />
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed italic text-[15px]">
                    "{aiResponse}"
                  </p>
                </div>

                <div className="w-full text-left mt-2">
                  <h3 className="text-[12px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] ml-2">
                    Recursos que podem te ajudar:
                  </h3>
                  
                  <div className="space-y-3">
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
                      icon={<HelpCircle className="w-5 h-5 text-amber-400" />} 
                      label="Escuta por IA (Chat)" 
                      onClick={() => { closeModals(); navigate('sentiment_analysis'); }}
                      color="bg-white"
                    />
                    <ResourceItem 
                      icon={<Wind className="w-5 h-5 text-blue-400" />} 
                      label="Autocuidado Agora" 
                      onClick={() => { closeModals(); toggleBreathing(true); }}
                      color="bg-white"
                    />
                  </div>
                </div>

                <button 
                  onClick={closeModals}
                  className="w-full h-[54px] bg-slate-900 text-white rounded-2xl font-bold text-sm mt-4 active:scale-95 transition-all shadow-xl"
                >
                  Obrigada, estou melhor
                </button>
              </div>
            )}

            {/* Footer Informativo */}
            <div className="mt-8 pt-4 border-t border-slate-50 w-full">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                Você não está sozinha
              </p>
            </div>
          </main>
          
        </div>
      )}
    </>
  );
};