
import React from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const NotificationBell: React.FC = () => {
  const { state, navigate } = useApp();
  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <button 
      onClick={() => navigate('notifications_list')}
      className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm active:scale-95 transition-transform"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
      )}
    </button>
  );
};
