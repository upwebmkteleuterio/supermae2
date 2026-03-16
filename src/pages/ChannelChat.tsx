"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  ArrowLeft, 
  User, 
  MapPin, 
  Info, 
  Loader2,
  AlertCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { supabase } from '../lib/supabase';
import { CHANNELS } from './ChannelsList';

const ChannelChat: React.FC = () => {
  const { state, navigate } = useApp();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channelInfo = CHANNELS.find(c => c.id === state.selectedChannelId);
  const userId = state.user?.id;
  const authUser = state.user;

  // Gerar ID de canal único para chats de IA (privado por usuário)
  const getStorageChannelId = () => {
    if (state.selectedChannelId === 'ia_duvidas' || state.selectedChannelId === 'atipica_ia_comportamento') {
      return `${state.selectedChannelId}_private_${userId}`;
    }
    return state.selectedChannelId;
  };

  const finalChannelId = getStorageChannelId();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!authUser || !state.selectedChannelId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('channel_messages')
          .select('*')
          .eq('channel_id', finalChannelId)
          .order('created_at', { ascending: true })
          .limit(50);

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };

    fetchMessages();

    // Inscrição em tempo real
    const channel = supabase
      .channel(`public:channel_messages:channel_id=eq.${finalChannelId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'channel_messages',
        filter: `channel_id=eq.${finalChannelId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        scrollToBottom();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.selectedChannelId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !state.selectedChannelId || !userId || sending) return;

    const currentMsg = newMessage;
    const currentUserId = userId;
    const userName = state.profile?.full_name || 'Mãe';
    const userAvatar = state.profile?.avatar_url;

    setSending(true);
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('channel_messages')
        .insert({
          channel_id: finalChannelId,
          user_id: currentUserId,
          user_name: userName,
          user_avatar: userAvatar,
          text: currentMsg
        });

      if (error) throw error;

      // Se for canal de IA, disparar resposta simulada (no mundo real chamaria uma Edge Function)
      if (state.selectedChannelId === 'ia_duvidas' || state.selectedChannelId === 'atipica_ia_comportamento') {
        setTimeout(async () => {
          await supabase.from('channel_messages').insert({
            channel_id: finalChannelId,
            user_id: null,
            user_name: state.selectedChannelId === 'atipica_ia_comportamento' ? "Especialista IA" : "Mentora IA",
            user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai',
            text: `Olá! Sou sua assistente. No momento estou operando em modo de demonstração. Em breve poderei responder suas dúvidas de forma personalizada!`
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Erro ao enviar:', err);
    } finally {
      setSending(false);
    }
  };

  if (!channelInfo) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate('channelsList')}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className={`w-10 h-10 rounded-xl ${channelInfo.color} flex items-center justify-center text-white shrink-0`}>
          {channelInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-slate-900 text-sm truncate">{channelInfo.name}</h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" /> Chat em Tempo Real
          </p>
        </div>
        <button className="p-2 text-slate-400">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Banner de Contexto (Opcional por canal) */}
      {(channelInfo.id === 'carona' || channelInfo.id === 'geral_desabafa') && (
        <div className="bg-white mx-4 mt-4 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-600 leading-relaxed">
              Sabia que você pode encontrar mães na sua região pelo nosso <strong>Mural de Apoio Local</strong>?
            </p>
          </div>
          <button 
            onClick={() => navigate('map')}
            className="text-xs font-bold text-indigo-600 whitespace-nowrap"
          >
            Ver Mural
          </button>
        </div>
      )}

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Carregando mensagens...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">Nenhuma mensagem ainda.</p>
            <p className="text-xs mt-1 italic">Seja a primeira a iniciar a conversa!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === userId;
            const isSystem = !msg.user_id;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-4">
                  <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100/50">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden shadow-sm">
                  {msg.user_avatar ? (
                    <img src={msg.user_avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <span className="text-[10px] font-bold text-slate-400 ml-1 mb-1 uppercase tracking-wide">
                      {msg.user_name}
                    </span>
                  )}
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-300 mt-1 font-medium px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-4 bg-white border-t border-slate-100 pb-8">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 text-slate-700 placeholder:text-slate-400"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              newMessage.trim() && !sending 
                ? 'bg-indigo-600 text-white shadow-lg active:scale-95' 
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChannelChat;