
import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onConfirm, onClose, confirmText = "Confirmar" }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-10 px-4 leading-relaxed">{message}</p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="w-full bg-red-500 text-white py-4 rounded-[2rem] font-bold shadow-lg shadow-red-100 active:scale-95 transition-all"
          >
            {confirmText}
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-slate-50 text-slate-400 py-4 rounded-[2rem] font-bold active:scale-95 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
