
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Layout } from '../components/Layout';
import { VoiceSelectionModal } from '../components/VoiceSelectionModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { AIIcon } from '../components/AIIcon';
import { Send, Volume2, Loader2, Trash2, AudioLines, MoreVertical } from 'lucide-react';
import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { ChatMessage } from '../types';

const SUGGESTIONS = [
  "Conciliar terapias e trabalho",
  "Sentir que não consigo dar conta de tudo",
  "Comportamento difícil do meu filho(a)",
  "Me senti julgada ou incompreendida",
  "Me senti muito sozinha hoje",
  "Cansaço extremo, físico ou emocional",
  "Medo do futuro ou da evolução do meu filho(a)",
  "Me faltou tempo para cuidar de mim",
  "Insegurança sobre estar fazendo o melhor",
  "Nenhum desafio específico, hoje foi um dia tranquilo"
];

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  return buffer;
}

export const SentimentAnalysis: React.FC = () => {
  const { state, addChatMessage, clearChatHistory } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const playbackQueueRef = useRef<AudioBuffer[]>([]);
  const isProcessingQueueRef = useRef(false);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Você é uma mentora acolhedora para mães atípicas no app "Super Mãe". Sua voz é empática, poética e sem julgamentos. Seu objetivo principal é ouvir, validar sentimentos e oferecer micro-suportes emocionais. DIRETRIZES: 1. Valide o sentimento. 2. Encerre com perguntas reflexivas.`,
      },
    });
    setChatInstance(chat);

    const initialMsg: ChatMessage = {
      role: 'model',
      text: "Qual foi o maior desafio do seu dia como mãe atípica?\n(Você pode escrever ou escolher uma sugestão abaixo)",
      timestamp: new Date().toISOString()
    };

    if (state.chatHistory.length === 0) {
      addChatMessage(initialMsg);
    } else {
      const lastMsgDate = new Date(state.chatHistory[state.chatHistory.length - 1].timestamp).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      if (lastMsgDate !== today) addChatMessage(initialMsg);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [state.chatHistory, loading]);

  const processQueue = async () => {
    if (isProcessingQueueRef.current || playbackQueueRef.current.length === 0) return;
    isProcessingQueueRef.current = true;
    
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const ctx = audioContextRef.current;

    while (playbackQueueRef.current.length > 0) {
      const buffer = playbackQueueRef.current.shift()!;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      const playPromise = new Promise<void>(resolve => {
        source.onended = () => resolve();
      });
      
      source.start();
      await playPromise;
    }
    
    isProcessingQueueRef.current = false;
    setIsPlaying(null);
  };

  const handleAudioChunked = async (text: string) => {
    if (isPlaying === text) {
      if (audioContextRef.current) audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
        setIsPlaying(null);
        playbackQueueRef.current = [];
        isProcessingQueueRef.current = false;
      });
      return;
    }

    setIsPlaying(text);
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    for (const p of paragraphs) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: p }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: state.selectedVoice } } },
          },
        });
        const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64) {
          const buffer = await decodeAudioData(decode(base64), audioContextRef.current);
          playbackQueueRef.current.push(buffer);
          processQueue();
        }
      } catch (e) { console.error("Chunk error:", e); }
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !chatInstance || loading) return;
    setShowSuggestions(false);
    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date().toISOString() };
    addChatMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const response = await chatInstance.sendMessage({ message: text });
      addChatMessage({ role: 'model', text: response.text || "Estou aqui...", timestamp: new Date().toISOString() });
    } catch (error) {
      addChatMessage({ role: 'model', text: "Erro de conexão, mas estou aqui.", timestamp: new Date().toISOString() });
    } finally { setLoading(false); }
  };

  const rightAction = (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)} 
        className="p-2 text-slate-400 hover:text-purple-600 transition-colors active:scale-90"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-purple-50 py-2 z-20 animate-in zoom-in-95 duration-200 origin-top-right">
            <button 
              onClick={() => { setShowVoiceModal(true); setShowMenu(false); }} 
              className="w-full px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-purple-50 flex items-center gap-3 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-purple-400" /> 
              Configurar Voz
            </button>
            <div className="h-px bg-purple-50 mx-2 my-1"></div>
            <button 
              onClick={() => { setShowClearModal(true); setShowMenu(false); }} 
              className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> 
              Limpar Histórico
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Layout 
      title="Análise de sentimentos" 
      showBack 
      themeColor="bg-[#FDFCFE]" 
      rightAction={rightAction}
    >
      <div className="flex flex-col h-[calc(100vh-128px)] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden -z-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="leaf" width="100" height="100" patternUnits="userSpaceOnUse">
               <path d="M50 20 C60 40 40 60 50 80 C40 60 60 40 50 20" fill="currentColor" className="text-purple-900" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#leaf)" />
          </svg>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pt-20 pb-4 space-y-12 no-scrollbar relative">
          {state.chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 relative`}>
              {msg.role === 'model' && (
                <div className="absolute left-0 -top-12 flex flex-col items-center">
                   <div className="w-16 h-16 shadow-2xl scale-75">
                     <AIIcon className="w-16 h-16" />
                   </div>
                </div>
              )}
              
              <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start pt-8'}`}>
                 <div className={`p-5 rounded-[2.5rem] text-sm leading-relaxed shadow-sm relative z-20 ${
                   msg.role === 'user' ? 'bg-white text-slate-700 border border-slate-100 rounded-tr-none' : 'bg-[#E9E4FF] text-slate-800 rounded-tl-none'
                 }`}>
                   {msg.text.split('\n').map((line, idx) => <p key={idx} className="mb-2">{line}</p>)}
                   
                   {msg.role === 'model' && (
                      <button 
                        onClick={() => handleAudioChunked(msg.text)}
                        className="mt-3 flex items-center gap-2 text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-white/60 px-4 py-2 rounded-full hover:bg-white transition-all shadow-sm"
                      >
                        {isPlaying === msg.text ? <AudioLines className="w-3 h-3 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                        {isPlaying === msg.text ? 'Ouvindo...' : 'Ouvir'}
                      </button>
                   )}
                 </div>
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start pt-4 animate-pulse"><div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div></div>}
          {(showSuggestions || state.chatHistory.length === 1) && (
            <div className="grid grid-cols-1 gap-2 pt-4 pb-12">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} className="text-left bg-white border border-slate-100 p-4 rounded-2xl text-xs font-medium text-slate-600 shadow-sm active:scale-[0.98] transition-all hover:border-purple-200">{s}</button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-md sticky bottom-0 left-0 right-0 z-30">
          <div className="max-w-md mx-auto flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend(input)} placeholder="Compartilhe seus sentimentos..." className="flex-1 bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 ring-purple-500/20 outline-none shadow-sm font-medium" />
            <button onClick={() => handleSend(input)} disabled={!input.trim() || loading} className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform disabled:opacity-50"><Send className="w-6 h-6" /></button>
          </div>
        </div>
      </div>
      {showVoiceModal && <VoiceSelectionModal onClose={() => setShowVoiceModal(false)} />}
      {showClearModal && <ConfirmModal title="Limpar conversa?" message="Deseja excluir o histórico de conversa? Isso não pode ser desfeito." confirmText="Sim, limpar" onConfirm={() => { clearChatHistory(); setShowSuggestions(true); }} onClose={() => setShowClearModal(false)} />}
    </Layout>
  );
};
