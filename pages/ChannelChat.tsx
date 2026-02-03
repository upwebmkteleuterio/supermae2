
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Layout } from '../components/Layout';
import { CHANNELS } from './ChannelsList';
import { 
  Send, 
  ArrowLeft,
  Smile,
  Bot,
  Loader2,
  Check,
  Truck,
  ChevronRight,
  CalendarCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GoogleGenAI } from "@google/genai";

const QUICK_EMOJIS = ["❤️", "🙏", "💪", "🤗", "🌸", "✨", "☕", "👶", "🫂", "✅"];
const AI_USER_ID = '00000000-0000-0000-0000-000000000000';

export const ChannelChat: React.FC = () => {
  const { state, goBack, navigate } = useApp();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingIA, setLoadingIA] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const channelInfo = CHANNELS.find(c => c.id === state.selectedChannelId);
  const user = state.userProfile;

  const getRoomId = (userId: string) => {
    if (state.selectedChannelId === 'ia_duvidas') {
      return `ia_private_${userId}`;
    }
    return state.selectedChannelId;
  };

  useEffect(() => {
    const initChat = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser || !state.selectedChannelId) return;
      
      setCurrentUserId(authUser.id);
      const roomId = getRoomId(authUser.id);

      setLoading(true);
      const { data } = await supabase
        .from('channel_messages')
        .select('*')
        .eq('channel_id', roomId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
      setLoading(false);

      const channel = supabase.channel(`room-${roomId}`, {
        config: { presence: { key: user.name } }
      });

      channel
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'channel_messages', 
          filter: `channel_id=eq.${roomId}` 
        }, (payload) => {
          setMessages(prev => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        })
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState();
          setOnlineCount(Object.keys(newState).length);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ 
              online_at: new Date().toISOString(),
            });
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    initChat();
  }, [state.selectedChannelId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loadingIA]);

  const handleSend = async (textToSend?: string) => {
    const finalMsg = textToSend || input;
    if (!finalMsg.trim() || !state.selectedChannelId || !currentUserId) return;

    const roomId = getRoomId(currentUserId);

    const newMsg = {
      channel_id: roomId,
      user_id: currentUserId,
      user_name: user.name.split(' ')[0],
      user_avatar: user.avatar,
      text: finalMsg,
    };

    setInput('');
    setShowEmojiPicker(false);

    const { data, error } = await supabase.from('channel_messages').insert(newMsg).select().single();
    if (error) {
      console.error(error);
    } else if (data) {
      setMessages(prev => [...prev, data]);
    }

    if (state.selectedChannelId === 'ia_duvidas') {
      setLoadingIA(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: finalMsg,
          config: { systemInstruction: `Você é a Mentora IA do app Super Mãe. Sua usuária se chama ${user.name}. Ela é uma mãe atípica. Dê respostas curtas, acolhedoras e muito práticas.` }
        });
        
        const aiResponse = {
          channel_id: roomId,
          user_id: AI_USER_ID,
          user_name: "Mentora IA",
          text: res.text || "Estou aqui para ajudar."
        };

        const { data: aiData } = await supabase.from('channel_messages').insert(aiResponse).select().single();
        if (aiData) setMessages(prev => [...prev, aiData]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingIA(false);
      }
    }
  };

  if (!channelInfo) return null;

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 text-slate-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className={`w-10 h-10 ${channelInfo.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
             <span className="scale-75">{channelInfo.icon}</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-800 text-sm truncate">{channelInfo.title}</h2>
            {!channelInfo.isAI && (
              <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{onlineCount} mães online</span>
              </div>
            )}
            {channelInfo.isAI && (
               <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Chat Privado com Mentora</span>
            )}
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-24 pb-40 px-6 space-y-6 no-scrollbar h-screen bg-[#FDFCFE]"
      >
        {/* Banner do Mural de Apoio (Carona e Desabafo) */}
        {(channelInfo.id === 'carona' || channelInfo.id === 'desabafa' || channelInfo.id === 'atipica_desabafa') && (
          <button 
            onClick={() => navigate('local_support_mural')}
            className="w-full bg-blue-50 rounded-2xl p-4 flex items-center justify-between border border-blue-100 shadow-sm animate-in fade-in zoom-in-95 duration-500 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Logística</p>
                <h4 className="text-xs font-bold text-blue-700">Procurar / Oferecer Apoio Local</h4>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-300" />
          </button>
        )}

        {/* Novo Banner: Terapias e Rotinas -> Agenda */}
        {channelInfo.id === 'atipica_terapias' && (
          <button 
            onClick={() => navigate('care_agenda')}
            className="w-full bg-indigo-50 rounded-2xl p-4 flex items-center justify-between border border-indigo-100 shadow-sm animate-in fade-in zoom-in-95 duration-500 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Gestão</p>
                <h4 className="text-xs font-bold text-indigo-700">Organizar Terapias e Rotinas</h4>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-300" />
          </button>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-300" />
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Carregando conversa...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
               <Smile className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-sm text-slate-400 font-medium">Seja a primeira a dizer oi!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.user_id === currentUserId;
            const isIA = msg.user_id === AI_USER_ID;
            
            return (
              <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center">
                      {isIA ? <Bot className="w-5 h-5 text-indigo-500" /> : <img src={msg.user_avatar} alt="Avatar" className="w-full h-full object-cover" />}
                    </div>
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 px-1">
                        {msg.user_name}
                      </span>
                    )}
                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${
                      isMe 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[7px] font-bold text-slate-300 uppercase">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <Check className="w-2.5 h-2.5 text-purple-300" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {loadingIA && (
          <div className="flex items-start gap-2 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300"><Bot className="w-5 h-5" /></div>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none text-xs font-bold text-slate-300">Mentora está digitando...</div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-100 pb-8 pt-4 px-6">
        <div className="max-w-lg mx-auto">
          {showEmojiPicker && (
            <div className="flex justify-between items-center mb-4 bg-white/90 p-2 rounded-2xl border border-purple-50 shadow-lg animate-in slide-in-from-bottom-4">
              {QUICK_EMOJIS.map(e => (
                <button key={e} onClick={() => handleSend(e)} className="text-xl p-1.5 hover:scale-125 transition-transform active:scale-90">{e}</button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-3 rounded-2xl transition-all ${showEmojiPicker ? 'bg-purple-100 text-purple-600' : 'text-slate-300 hover:text-purple-600'}`}
            >
              <Smile className="w-6 h-6" />
            </button>
            
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 px-5 flex items-center shadow-inner group focus-within:border-purple-200 transition-colors">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escreva algo para as mães..."
                className="w-full bg-transparent border-none focus:ring-0 outline-none py-3.5 text-sm font-medium text-slate-700 placeholder:text-slate-300"
              />
            </div>

            <button 
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100 active:scale-90 transition-transform disabled:opacity-30 disabled:grayscale"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
