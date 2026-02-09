
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SENTIMENTS } from '../constants';
import { AIIcon } from '../components/AIIcon';
import { Volume2, Loader2, Heart, ArrowLeft, AudioLines, Sparkles } from 'lucide-react';
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

  const selectedIds = state.tempMoodSelection || [];
  const note = state.tempMoodNote || '';
  const photoUrl = state.tempMoodPhotoUrl || '';
  const selectedSentiments = selectedIds.map((id: string) => SENTIMENTS.find(s => s.id === id)).filter(Boolean);

  useEffect(() => {
    const generateAnalysis = async () => {
      if (selectedIds.length === 0) {
        navigate('mood_selection');
        return;
      }

      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const labels = selectedSentiments.map((s: any) => s.label).join(', ');
        
        // Contexto textual e confirmação de foto (sem enviar a imagem em si)
        const textContext = `A usuária ${state.userProfile.name} registrou hoje que está se sentindo: ${labels}. 
        Relato do dia: "${note || 'Não houve relato em texto, apenas emojis.'}".
        Contexto Adicional: Ela anexou uma foto deste dia como memória no seu diário.
        Perfil: Ela é uma mãe atípica (filho: ${state.userProfile.childrenAgeGroup}, diagnóstico: ${state.userProfile.diagnosisStatus}).`;

        const prompt = `${textContext}

        OBJETIVO: Dê uma resposta de mentora empática, poética e curta. 
        Valide o sentimento e o relato dela. 
        Mencione brevemente que é valioso registrar momentos e guardar memórias através de fotos, pois isso ajuda a dar sentido à jornada.
        Encerre com uma frase de força.`;

        const res = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { 
            systemInstruction: "Você é uma mentora empática especialista em maternidade atípica. Seu tom é doce, observador e encorajador. Responda em até 3 parágrafos curtos."
          }
        });

        const aiText = res.text || "Estou aqui com você. Respire fundo.";
        setResponse(aiText);
        
        // SALVAMENTO NO SUPABASE (A URL da foto e a nota continuam sendo persistidas)
        await saveMoodRecord(state.selectedDate, selectedIds, note, photoUrl);
        
      } catch (e) {
        console.error("Erro na análise IA:", e);
        const fallbackMsg = "Às vezes as palavras faltam, mas meu abraço virtual está com você. Você é uma super mãe.";
        setResponse(fallbackMsg);
        await saveMoodRecord(state.selectedDate, selectedIds, note, photoUrl);
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
      <div className="pt-12 px-6 flex items-center mb-4">
        <h1 className="text-xl font-bold text-slate-800">Cuidado emocional</h1>
      </div>

      <div className="px-6 flex flex-col items-center justify-center h-full min-h-[calc(100vh-280px)] pb-40">
        <div className="mb-6 shrink-0">
          <AIIcon className="w-28 h-28" />
        </div>

        <div className="text-center mb-6 shrink-0">
          <span className="text-purple-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-purple-50 px-4 py-1.5 rounded-full">
            {new Date(state.selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="w-full bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                Sintonizando acolhimento...
              </p>
            </div>
          ) : (
            <>
              {photoUrl && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 border-2 border-purple-100 shadow-md animate-in zoom-in-50 duration-500">
                   <img src={photoUrl} alt="Registro do dia" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="space-y-4 text-center">
                {response.split('\n').map((para, i) => (
                  <p key={i} className="text-slate-700 font-medium leading-relaxed italic text-sm">
                    {para}
                  </p>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col items-center gap-4">
                <button 
                  onClick={handleSpeak}
                  className="flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] bg-purple-50 px-8 py-4 rounded-full hover:bg-purple-100 transition-all active:scale-95 shadow-sm"
                >
                  {isPlaying ? <AudioLines className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                  {isPlaying ? 'Ouvindo mentora...' : 'Ouvir mensagem'}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 bg-indigo-900/5 px-8 py-3 rounded-full border border-indigo-100 shrink-0">
           <p className="text-indigo-900 font-bold text-[11px] uppercase tracking-wider">Você não está sozinha!</p>
        </div>
      </div>

      <div className="fixed bottom-28 left-0 right-0 p-6 pointer-events-none z-30">
        <button 
          onClick={() => navigate('mood_diary')}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-200 pointer-events-auto active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          Acessar diário emocional
        </button>
      </div>
    </Layout>
  );
};
