
import React, { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  ArrowLeft, 
  MessageSquare, 
  HandHeart, 
  Trash2,
  BellOff
} from 'lucide-react';

export const NotificationsList: React.FC = () => {
  const { state, goBack, fetchNotifications, markNotificationAsRead } = useApp();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id: string) => {
    await markNotificationAsRead(id);
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F8F9FE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Notificações</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 space-y-4 pb-40">
        {state.notifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <BellOff className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-sm text-slate-400 font-medium">Nenhuma notificação por enquanto.</p>
          </div>
        ) : (
          state.notifications.map(notif => (
            <button 
              key={notif.id}
              onClick={() => handleRead(notif.id)}
              className={`w-full text-left p-5 rounded-[2rem] border transition-all flex items-start gap-4 relative overflow-hidden ${
                notif.read ? 'bg-white border-slate-50 opacity-60' : 'bg-purple-50 border-purple-100 shadow-sm ring-1 ring-purple-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                notif.type === 'support_interest' ? 'bg-blue-100 text-blue-500' : 'bg-purple-100 text-purple-500'
              }`}>
                {notif.type === 'support_interest' ? <HandHeart className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                   <h3 className="font-bold text-slate-800 text-sm">Interesse em Apoio</h3>
                   <span className="text-[8px] font-black text-slate-300 uppercase">
                     {new Date(notif.created_at).toLocaleDateString()}
                   </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="font-bold text-purple-700">{notif.sender_name}</span> se interessou no seu post "{notif.data.postTitle}".
                </p>
                {!notif.read && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Nova</span>
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </Layout>
  );
};
