
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2 } from 'lucide-react';

interface CareCompletionModalProps {
  onContinue: () => void;
  context: {
    category: string;
    intensity: 'light' | 'strong';
    tasks: string[];
    userName: string;
  };
}

export const CareCompletionModal: React.FC<CareCompletionModalProps> = ({ onContinue, context }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const generateMessage = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          A usuária ${context.userName} (mãe atípica) concluiu o planejamento de instâncias de cuidado.
          DETALHES:
          - Categoria Escolhida: ${context.category}
          - Energia/Intensidade: ${context.intensity === 'light' ? 'Leve' : 'Com força'}
          - Tarefas selecionadas: ${context.tasks.join(', ')}

          OBJETIVO: Gere uma mensagem curta (máximo 250 caracteres) de validação e incentivo.
          A mensagem deve reconhecer o esforço dela em buscar esse momento específico de ${context.category}.
          O tom deve ser acolhedor, empático e poético.
          Responda apenas o texto da mensagem.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            systemInstruction: "Você é uma mentora especialista em autocuidado para mães. Sua voz é doce e inspiradora."
          }
        });

        setMessage(response.text || "Seu compromisso com o autocuidado é o primeiro passo para uma rotina mais leve. Você merece esse momento.");
      } catch (e) {
        setMessage("Percebemos que você está buscando equilíbrio. Que tal agendar um momento só para você esta semana?");
      } finally {
        setLoading(false);
      }
    };

    generateMessage();
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[4px] animate-in fade-in duration-300">
      <article className="relative w-[90%] max-w-[340px] bg-white rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        
        {/* Illustration */}
        <div className="mb-6 w-full flex justify-center">
          <img 
            alt="Cuidado Pessoal" 
            className="w-44 h-auto object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRSaA11hx61TLr-MJEqp8eWL2XYUonMiWka7vwrBBuloLgDHhfWDyglnBo1ZP22Euy3SjSvW4gp4TWxhrBtKghQY7bHGzIDCHi3odRFyCa_BfXC4QKUO9IPEu9yuljd3NdJrU7Y_mFnsfr0rfd8jupTkowW7SAIDLunB2L27ikzgkfS1HKDbcDejtp5x1itoGJcFI3Xo6YCTpHR1qNfww-BHX_rpPeCOUIhaFxFWY4rTcSTrX4_W9LM7tVsFsA2n5vlcQI4-P06HAa"
          />
        </div>

        {/* Content Section with Scroll if needed */}
        <section className="mb-8 w-full max-h-[180px] overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-[14px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Sintonizando acolhimento...</p>
            </div>
          ) : (
            <p className="text-[18px] font-medium text-[#222222] leading-snug">
              {message}
            </p>
          )}
        </section>

        {/* Action Button */}
        <button 
          onClick={onContinue}
          className="w-full bg-[#7B2CBF] hover:bg-[#6a25a6] active:scale-95 text-white font-bold text-lg py-4 px-6 rounded-full transition-all shadow-lg shadow-purple-100"
        >
          Continuar
        </button>
      </article>
    </div>
  );
};
