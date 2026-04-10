"use client";

import React, { useState } from 'react';
import { Terminal, Copy, Check, Trash2, X, AlertTriangle } from 'lucide-react';

interface LogMonitorProps {
  logs: any[];
  onClear: () => void;
  mismatchReport: { dbCount: number; uiCount: number };
}

export const LogMonitor: React.FC<LogMonitorProps> = ({ logs, onClear, mismatchReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'mismatch'>('logs');

  const copyAll = () => {
    const data = JSON.stringify({ logs, mismatchReport }, null, 2);
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 z-[200] bg-slate-900 text-white p-4 rounded-full shadow-2xl animate-bounce"
      >
        <Terminal size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-32 z-[210] bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 flex flex-col max-h-[60vh] overflow-hidden animate-in slide-in-from-bottom-10">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex gap-4">
           <button onClick={() => setActiveTab('logs')} className={`text-xs font-black uppercase tracking-widest ${activeTab === 'logs' ? 'text-purple-400' : 'text-slate-50'}`}>Transaction Trace</button>
           <button onClick={() => setActiveTab('mismatch')} className={`text-xs font-black uppercase tracking-widest ${activeTab === 'mismatch' ? 'text-red-400' : 'text-slate-500'}`}>Mismatch Report</button>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-4 no-scrollbar">
        {activeTab === 'mismatch' ? (
           <div className="bg-red-950/30 p-6 rounded-2xl border border-red-900/50 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                 <AlertTriangle size={20} />
                 <h4 className="font-bold text-sm">Divergência Detectada</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-800 p-3 rounded-xl"><p className="text-slate-400 mb-1">Raw DB Count</p><p className="text-xl font-bold text-white">{mismatchReport.dbCount}</p></div>
                 <div className="bg-slate-800 p-3 rounded-xl"><p className="text-slate-400 mb-1">UI Rendered</p><p className="text-xl font-bold text-white">{mismatchReport.uiCount}</p></div>
              </div>
              {mismatchReport.dbCount > 0 && mismatchReport.uiCount === 0 && (
                <p className="bg-red-500 text-white p-3 rounded-lg font-bold text-center">PONTE DE DADOS QUEBRADA</p>
              )}
           </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className={log.status === 'ERROR' ? 'text-red-400' : 'text-green-400'}>[{log.strategy}] {log.status}</span>
                <button onClick={() => navigator.clipboard.writeText(JSON.stringify(log, null, 2))} className="text-slate-500 hover:text-white"><Copy size={12} /></button>
              </div>
              <pre className="text-slate-400 whitespace-pre-wrap">{JSON.stringify(log.error || log.payload, null, 2)}</pre>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex gap-2">
        <button onClick={copyAll} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copiado!' : 'Copiar Report Completo'}
        </button>
        <button onClick={onClear} className="bg-slate-800 text-slate-400 p-3 rounded-xl hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};