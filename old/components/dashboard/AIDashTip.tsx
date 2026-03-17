
import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface AIDashTipProps {
  hasData: boolean;
  percentGood: number;
}

export const AIDashTip: React.FC<AIDashTipProps> = ({ hasData, percentGood }) => {
  if (!hasData) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-6 text-slate-400 text-center shadow-sm flex items-center gap-4">
         <Sparkles className="w-10 h-10 opacity-30 shrink-0" />
         <div className="text-left">
           <p className="text-xs font-bold opacity-80 mb-1">Dica da IA:</p>
           <p className="text-sm font-bold leading-tight">Registre o humor diariamente para que eu possa te dar dicas personalizadas de bem-estar!</p>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-600 rounded-[2rem] p-6 text-white text-center shadow-lg shadow-purple-100 flex items-center gap-4">
       <Calendar className="w-10 h-10 opacity-50 shrink-0" />
       <div className="text-left">
         <p className="text-xs font-bold opacity-80 mb-1">Dica da IA:</p>
         <p className="text-sm font-bold leading-tight">
           {percentGood >= 50 
             ? `Você teve ${percentGood}% de dias bons! Que tal planejar uma rotina leve para manter esse ritmo?`
             : `Identificamos alguns dias desafiadores. Lembre-se que o autocuidado não é egoísmo, é necessário para seu equilíbrio.`}
         </p>
       </div>
    </div>
  );
};
