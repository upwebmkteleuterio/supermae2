
import React from 'react';
import { Bell } from 'lucide-react';

export const SOSButton: React.FC = () => {
  return (
    <button className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm relative active:scale-90 transition-transform">
      <Bell className="w-6 h-6 opacity-40" />
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 bg-[#A855F7] px-1.5 py-0.5 rounded-full border border-white shadow-sm">
        <span className="text-[7px] font-black text-white leading-none">SOS</span>
      </div>
    </button>
  );
};
