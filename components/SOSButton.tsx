
import React from 'react';
import { Bell } from 'lucide-react';

export const SOSButton: React.FC = () => {
  return (
    <button className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm relative active:scale-95 transition-all">
      <Bell className="w-5 h-5 text-purple-400" />
      <div className="absolute -top-1 -right-1 bg-[#A855F7] px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
        <span className="text-[7px] font-black text-white leading-none tracking-tighter">SOS</span>
      </div>
    </button>
  );
};
