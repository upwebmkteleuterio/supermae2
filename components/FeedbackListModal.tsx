"use client";

import React from 'react';
import { X, Star, MessageSquare, Quote } from 'lucide-react';

interface FeedbackListModalProps {
  partnerName: string;
  onClose: () => void;
}

const MOCK_REVIEWS = [
  { id: '1', user: 'Juliana S.', avatar: 'https://i.pravatar.cc/150?u=1', rating: 5, comment: 'Excelente atendimento para crianças com TEA. Muito pacientes!', date: 'há 2 dias' },
  { id: '2', user: 'Carla M.', avatar: 'https://i.pravatar.cc/150?u=2', rating: 4, comment: 'Gostei muito da estrutura, mas a agenda é bem concorrida.', date: 'há 1 semana' },
  { id: '3', user: 'Renata L.', avatar: 'https://i.pravatar.cc/150?u=3', rating: 5, comment: 'Profissionais muito capacitados. Recomendo de olhos fechados.', date: 'há 2 semanas' },
];

export const FeedbackListModal: React.FC<FeedbackListModalProps> = ({ partnerName, onClose }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliações das Mães</h3>
            <h4 className="text-slate-800 font-bold text-base truncate max-w-[200px]">{partnerName}</h4>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {MOCK_REVIEWS.map(review => (
            <div key={review.id} className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm">
                    <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{review.user}</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                   <Star size={10} className="fill-amber-400 text-amber-400" />
                   <span className="text-[10px] font-black text-slate-500">{review.rating}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Quote size={12} className="text-purple-200 shrink-0" />
                <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-50 shrink-0">
           <button onClick={onClose} className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Fechar</button>
        </div>
      </div>
    </div>
  );
};