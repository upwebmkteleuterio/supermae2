
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS } from '../constants';
import { AIIcon } from '../components/AIIcon';
import { Volume2, Loader2, Heart, ArrowLeft, AudioLines } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  return buffer;
}

export const MoodResult: React.FC = () => {
  const { state, navigate, saveMoodRecord } = useApp();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Recupera sentimentos selecionados (via hack window ou estado temporário se existisse)
  const selectedIds = (window as any).tempSelectedSentiments || [];
  const selectedSentiments = selectedIds.map((id: string) => SENTIMENTS.find(s => s.id === id)).filter(Boolean);

  useEffect(() => {
    const generateAnalysis = async () => {
      if (selectedIds.length === 0) {
        navigate('mood_diary');
        return;
      }

      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const labels = selectedSentiments.map((s: any) => s.label).join(', ');
        
        const prompt = `A usuária ${state.userProfile.name} registrou que está se sentindo: ${labels}. 
        CONTEXTO: Ela é uma mãe atípica (filho: ${state.userProfile.childrenAgeGroup}, diagnóstico: ${state.userProfile.diagnosisStatus}).
        OBJETIVO: Dê uma resposta acolhedora de alívio, conselho ou carinho. Seja breve, poética e empática. 
        Encerre com uma pequena frase de força.`;

        const res = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { 
            systemInstruction: "Você é uma mentora empática para mães. Sua fala deve ser doce mas empoderadora."
          }
        });

        setResponse(res.text || "Estou aqui com você. Respire fundo.");
        // Salva oficialmente no histórico
        saveMoodRecord(state.selectedDate, selectedIds);
      } catch (e) {
        setResponse("Às vezes as palavras faltam, mas meu abraço virtual está com você. Você é uma super mãe.");
      } finally {
        setLoading(false);
      }
    };

    generateAnalysis();
  }, []);

  const handleSpeak = async () => {
    if (isPlaying) {
      if (audioContextRef.current) audioContextRef.current.close();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: response }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: state.selectedVoice } } },
        },
      });

      const base64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = await decodeAudioData(decode(base64), audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
      }
    } catch (e) {
      setIsPlaying(false);
    }
  };

  return (
    <Layout headerTransparent themeColor="bg-[#F9F7FC]">
      <div className="pt-12 px-6 flex items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800">Registro de humor</h1>
      </div>

      <div className="px-6 flex flex-col items-center justify-center h-[calc(100vh-180px)] pb-20">
        <div className="mb-8">
          <AIIcon className="w-32 h-32" />
        </div>

        <div className="text-center mb-6">
          <span className="text-purple-400 font-bold text-sm uppercase tracking-widest">
            {new Date(state.selectedDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="w-full bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Sintonizando acolhimento...</p>
            </div>
          ) : (
            <>
              <p className="text-slate-700 font-medium leading-relaxed italic text-center text-sm">
                "{response}"
              </p>
              
              <button 
                onClick={handleSpeak}
                className="mt-8 flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] bg-purple-50 px-6 py-3 rounded-full hover:bg-purple-100 transition-all active:scale-95"
              >
                {isPlaying ? <AudioLines className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                {isPlaying ? 'Ouvindo...' : 'Ouvir mensagem'}
              </button>
            </>
          )}
        </div>

        <div className="mt-10 bg-[#E9E4FF] px-8 py-4 rounded-[1.8rem] shadow-inner">
           <p className="text-purple-900 font-bold text-sm">Você não está sozinha!</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-30">
        <button 
          onClick={() => navigate('mood_diary')}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          Acessar diário emocional
        </button>
      </div>
    </Layout>
  );
};
