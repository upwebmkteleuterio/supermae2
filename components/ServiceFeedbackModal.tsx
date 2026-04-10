"use client";

import React, { useState } from 'react';
import { X, Star, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ServiceFeedbackModalProps {
  partnerName: string;
  onClose: () => void;
}

export const ServiceFeedbackModal: React.FC<ServiceFeedbackModalProps> = ({ partnerName, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Seu Feedback</h3>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-8">
           <p className="text-sm text-slate-500 font-medium">O que você achou de</p>
           <h4 className="text-purple-600 font-bold text-lg">{partnerName}?</h4>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 transition-transform active:scale-90"
            >
              <Star 
                size={36} 
                className={`transition-colors ${
                  (hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`} 
              />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Conte sua experiência</label>
            <textarea 
              placeholder="Fale um pouco sobre o atendimento..."
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-700 outline-none h-32 resize-none focus:ring-2 ring-purple-100"
            />
          </div>

          <button 
            onClick={onClose}
            disabled={rating === 0}
            className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30"
          >
            <CheckCircle2 className="w-4 h-4" />
            Enviar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
};