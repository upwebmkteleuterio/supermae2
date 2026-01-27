
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Layout } from '../components/Layout';
import { CHANNELS } from './ChannelsList';
import { 
  Send, 
  Users, 
  X, 
  MoreVertical, 
  ArrowLeft,
  Smile,
  Bot
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

export const ChannelChat: React.FC = () => {
  const { state, goBack, addChannelMessage, navigate } = useApp();
  const [input, setInput] = useState('');
  const [loadingIA, setLoadingIA] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const channel = CHANNELS.find(c => c.id === state.selectedChannelId);
  const messages = state.channelMessages[state.selectedChannelId || ''] || [];

  useEffect(() => {
    // Mensagem de boas vindas do sistema se for a primeira vez
    if (messages.length === 0 && channel) {
      addChannelMessage(channel.id, {
        role: 'system',
        text: `Bem-vinda ao canal ${channel.title}! Lembre-se de ser gentil com as outras mães.`,
        timestamp: new Date().toISOString()
      });
      
      if (channel.id === 'ia_duvidas') {
        addChannelMessage(channel.id, {
          role: 'model',
          text: "Olá! Sou sua mentora Super Mãe. Em que posso te ajudar hoje?",
          timestamp: new Date().toISOString(),
          senderName: "Mentora IA",
          senderAvatar: "https://cdn.lordicon.com/uoljexdg.json" // Lordicon ou algo do tipo
        });
      }
    }
  }, [state.selectedChannelId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loadingIA]);

  const handleSend = async () => {
    if (!input.trim() || !channel) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date().toISOString(),
      senderName: state.userProfile.name.split(' ')[0],
      senderAvatar: state.userProfile.avatar
    };

    addChannelMessage(channel.id, userMsg);
    setInput('');

    // Se for o canal de IA, gera resposta
    if (channel.id === 'ia_duvidas') {
      setLoadingIA(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: input,
          config: {
            systemInstruction: "Você é a Mentora IA do app Super Mãe. Responda de forma curta, acolhedora e prática."
          }
        });
        
        addChannelMessage(channel.id, {
          role: 'model',
          text: res.text || "Estou processando sua dúvida...",
          timestamp: new Date().toISOString(),
          senderName: "Mentora IA"
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingIA(false);
      }
    }
  };

  if (!channel) return null;

  return (
    <Layout 
      headerTransparent 
      themeColor="bg-[#FDFCFE]"
    >
      {/* Header Fixo do Chat */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 text-slate-400 hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className={`w-10 h-10 ${channel.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
             <span className="scale-75">{channel.icon}</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-800 text-sm truncate">{channel.title}</h2>
            <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{channel.online} online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setShowUsers(!showUsers)}
            className="p-2 text-slate-300 hover:text-purple-500 transition-colors"
          >
            <Users className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-300 hover:text-purple-500 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-24 pb-32 px-6 space-y-4 no-scrollbar h-screen"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'system' ? 'items-center py-4' : msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.role === 'system' ? (
              <div className="bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.text}</p>
              </div>
            ) : (
              <>
                <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
                    {msg.role === 'model' ? (
                      <Bot className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <img src={msg.senderAvatar || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"} alt="Avatar" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">
                      {msg.senderName}
                    </span>
                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm relative ${
                      msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-bold text-slate-300 mt-1 uppercase">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        {loadingIA && (
          <div className="flex items-start gap-2 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300"><Bot className="w-5 h-5" /></div>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none text-xs font-bold text-slate-300">Escrevendo...</div>
          </div>
        )}
      </div>

      {/* Input Fixo Bottom Chat */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button className="p-3 text-slate-300 hover:text-purple-600 transition-colors">
            <Smile className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 px-5 py-1 flex items-center shadow-inner">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="w-full bg-transparent border-none focus:ring-0 outline-none py-3 text-sm font-medium text-slate-600 placeholder:text-slate-300"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="h-6 safe-bottom"></div>
      </div>

      {/* Drawer de Usuários (Mock) */}
      {showUsers && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 flex justify-end">
          <div className="w-64 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Na sala ({channel.online})</h3>
              <button onClick={() => setShowUsers(false)} className="text-slate-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center"><Bot className="w-4 h-4 text-indigo-500" /></div>
                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Mentora IA</span>
              </div>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"></div>
                   <span className="text-xs font-bold text-slate-600">Mãe Amiga {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
