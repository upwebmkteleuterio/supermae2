"use client";

import React, { useState, useEffect } from 'react';
import { X, Star, Quote, Users, Loader2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { IndicationReview } from '../types';

interface FeedbackListModalProps {
  partnerId: string;
  partnerName: string;
  onClose: () => void;
}

export const FeedbackListModal: React.FC<FeedbackListModalProps> = ({ partnerId, partnerName, onClose }) => {
  const { fetchIndicationReviews } = useApp();
  const [reviews, setReviews] = useState<IndicationReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchIndicationReviews(partnerId);
      setReviews(data);
      setLoading(false);
    };
    load();
  }, [partnerId, fetchIndicationReviews]);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avaliações das Mães</h3>
               <div className="bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-100">
                  <Users size={8} className="text-purple-500" />
                  <span className="text-[9px] font-black text-purple-600">{loading ? '...' : reviews.length}</span>
               </div>
            </div>
            <h4 className="text-slate-800 font-bold text-base truncate pr-4">{partnerName}</h4>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-purple-300" />
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Buscando relatos...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-slate-400 font-medium">Ainda não há avaliações para este local.</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 animate-in fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm bg-slate-200">
                      {review.user_avatar ? (
                        <img src={review.user_avatar} alt={review.user_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-black">{review.user_name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{review.user_name}</p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
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
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-50 shrink-0">
           <button onClick={onClose} className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest active:opacity-60 transition-opacity">Fechar</button>
        </div>
      </div>
    </div>
  );
};