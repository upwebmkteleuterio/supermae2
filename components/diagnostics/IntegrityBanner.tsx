"use client";

import React from 'react';
import { Database, ShieldCheck, Activity, AlertCircle } from 'lucide-react';

interface IntegrityBannerProps {
  dbStatus: 'online' | 'error';
  isAtypical: boolean;
  dbCount: number;
  uiCount: number;
}

export const IntegrityBanner: React.FC<IntegrityBannerProps> = ({ dbStatus, isAtypical, dbCount, uiCount }) => {
  const isBroken = dbCount > 0 && uiCount === 0;

  return (
    <div className={`w-full px-4 py-3 mb-4 flex items-center justify-between border shadow-sm transition-colors duration-500 ${
      isBroken ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
    }`}>
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <Database size={12} className={dbStatus === 'online' ? 'text-green-500' : 'text-red-500'} />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">DB: {dbStatus}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <ShieldCheck size={12} className="text-purple-500" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">RLS: {isAtypical ? 'ATYPICAL' : 'GENERAL'}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Activity size={12} className={isBroken ? 'text-red-500' : 'text-blue-500'} />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Integrity: {dbCount}/{uiCount}</span>
        </div>
      </div>
      {isBroken && (
        <div className="flex items-center gap-1 text-red-600 animate-pulse">
          <AlertCircle size={14} />
          <span className="text-[9px] font-black uppercase">Ponte Quebrada</span>
        </div>
      )}
    </div>
  );
};