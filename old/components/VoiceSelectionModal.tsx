
import React, { useState } from 'react';
import { X, Mic2, CheckCircle2, Volume2, Loader2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GoogleGenAI, Modality } from "@google/genai";

interface VoiceOption {
  id: string;
  name: string;
  gender: 'Feminino' | 'Masculino';
  description: string;
}

// Mapeamento corrigido conforme solicitação: Helena (Feminina), Thiago (Masculino)
const VOICES: VoiceOption[] = [
  { id: 'Kore', name: 'Beatriz', gender: 'Feminino', description: 'Suave e tranquila' },
  { id: 'Fenrir', name: 'Helena', gender: 'Feminino', description: 'Acolhedora e firme' },
  { id: 'Charon', name: 'Gabriel', gender: 'Masculino', description: 'Calmo e empático' },
  { id: 'Puck', name: 'Thiago', gender: 'Masculino', description: 'Profundo e sereno' }
];

export const VoiceSelectionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, setVoice } = useApp();
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  const playSample = async (voiceId: string) => {
    setLoadingSample(voiceId);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: "Se você preferir, eu posso ter essa voz aqui." }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceId },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (e) { console.error(e); } finally { setLoadingSample(null); }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Escolha a voz</h3>
          <button onClick={onClose} className="p-1 text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {VOICES.map((voice) => (
            <div key={voice.id} className="relative group">
              <button
                onClick={() => { setVoice(voice.id); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  state.selectedVoice === voice.id 
                  ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-200' 
                  : 'bg-white border-slate-100 hover:border-purple-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    state.selectedVoice === voice.id ? 'bg-purple-500 text-white' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <Mic2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">{voice.name}</span>
                      <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-1.5 rounded-md">
                        {voice.gender}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{voice.description}</p>
                  </div>
                </div>
                {state.selectedVoice === voice.id && (
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                )}
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); playSample(voice.id); }}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-2 bg-purple-100 rounded-full text-purple-600 active:scale-90 transition-transform flex items-center justify-center"
                title="Ouvir amostra"
              >
                {loadingSample === voice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-[#A855F7] text-white py-4 rounded-[2rem] font-bold shadow-lg shadow-purple-100 mt-8 active:scale-95 transition-all"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};
