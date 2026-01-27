
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS_CHILD } from '../constants';
import { AIIcon } from '../components/AIIcon';
import { Volume2, Loader2, AudioLines } from 'lucide-react';
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

export const ChildMoodResult: React.FC = () => {
  const { state, navigate, saveChildMoodRecord } = useApp();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const selectedChild = state.children.find(c => c.id === state.selectedChildId);
  const selectedIds = state.tempMoodSelection || [];
  const note = state.tempMoodNote || '';
  const selectedLabels = selectedIds.map(id => SENTIMENTS_CHILD.find(s => s.id === id)?.label).join(', ');

  useEffect(() => {
    const generateAnalysis = async () => {
      if (!selectedChild || selectedIds.length === 0) {
        navigate('child_mood_selection');
        return;
      }

      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const challengeContext = note ? `A mãe relatou o seguinte desafio hoje: "${note}".` : 'A mãe não detalhou um desafio específico hoje.';
        
        const prompt = `A mãe registrou que seu filho ${selectedChild.name} está se sentindo: ${selectedLabels}. 
        ${challengeContext}
        CONTEXTO DO FILHO: Tem ${selectedChild.age} e a situação de diagnóstico é: ${selectedChild.diagnosisStatus}.
        USUÁRIA: ${state.userProfile.name}.
        
        OBJETIVO: Dê uma resposta acolhedora para a MÃE. 
        1. Valide o sentimento da criança.
        2. Dê uma palavra de conforto ou micro-estratégia específica para o desafio relatado por ela.
        3. Seja breve, empática e poética. 
        4. Encerre com uma frase de validação materna forte.`;

        const res = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { 
            systemInstruction: "Você é uma mentora especialista em maternidade atípica. Seu tom é calmo, seguro e extremamente acolhedor."
          }
        });

        const aiText = res.text || "Obrigada por registrar. Sua percepção é fundamental para o desenvolvimento do seu filho.";
        setResponse(aiText);
        
        // SALVAMENTO OFICIAL NO SUPABASE
        await saveChildMoodRecord(selectedChild.id, state.selectedDate, selectedIds, note);
        
      } catch (e) {
        const fallbackMsg = "Registrar o humor e os desafios é o primeiro passo para entender padrões. Você está fazendo um ótimo trabalho observando seu filho e cuidando de si mesma.";
        setResponse(fallbackMsg);
        await saveChildMoodRecord(selectedChild.id, state.selectedDate, selectedIds, note);
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
        <h1 className="text-xl font-bold text-slate-800">Apoio para você</h1>
      </div>

      <div className="px-6 flex flex-col items-center justify-center h-full min-h-[calc(100vh-280px)] pb-40 text-center">
        <div className="mb-8 shrink-0">
          <AIIcon className="w-32 h-32" />
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white w-full">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Processando registro...</p>
            </div>
          ) : (
            <>
              <p className="text-slate-700 font-medium leading-relaxed italic text-sm mb-6">
                "{response}"
              </p>
              
              <button 
                onClick={handleSpeak}
                className="inline-flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] bg-purple-50 px-6 py-3 rounded-full hover:bg-purple-100 transition-all active:scale-95"
              >
                {isPlaying ? <AudioLines className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                {isPlaying ? 'Ouvindo...' : 'Ouvir mensagem'}
              </button>
            </>
          )}
        </div>

        <div className="mt-8 bg-[#E9E4FF] px-6 py-3 rounded-full shadow-inner">
           <p className="text-purple-900 font-bold text-xs">Seu filho é único, e você é a melhor mãe para ele.</p>
        </div>
      </div>

      <div className="fixed bottom-28 left-0 right-0 p-6 pointer-events-none z-30">
        <button 
          onClick={() => navigate('child_mood_diary')}
          className="w-full bg-[#7C3AED] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-200 pointer-events-auto active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          Voltar para o diário
        </button>
      </div>
    </Layout>
  );
};
