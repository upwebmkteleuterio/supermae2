
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { 
  Mic, 
  Square, 
  Camera, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  Check, 
  Sparkles,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const MomMoodChallenge: React.FC = () => {
  const { state, navigate, goBack, setTempMoodNote, uploadMoodPhoto, setTempMoodPhotoUrl } = useApp();
  const [note, setNote] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingTranscription, setLoadingTranscription] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formattedDate = new Date(state.selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Não foi possível acessar o microfone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setLoadingTranscription(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            {
              parts: [
                { inlineData: { data: base64Data, mimeType: 'audio/webm' } },
                { text: 'Transcreva este áudio de uma mãe contando como foi o dia dela. Retorne apenas o texto transcrito, sem comentários extras.' }
              ]
            }
          ]
        });

        const transcription = response.text || '';
        setNote(prev => prev ? `${prev}\n${transcription}` : transcription);
      };
    } catch (e) {
      console.error(e);
      alert("Erro ao transcrever o áudio.");
    } finally {
      setLoadingTranscription(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);

      const publicUrl = await uploadMoodPhoto(file);
      if (publicUrl) {
        setTempMoodPhotoUrl(publicUrl);
      }
      setUploading(false);
    }
  };

  const handleContinue = () => {
    setTempMoodNote(note);
    navigate('mood_result');
  };

  return (
    <Layout title="Registro de humor" showBack themeColor="bg-[#F8F9FE]" headerTransparent={false}>
      <div className="px-6 pt-4 pb-40">
        <div className="text-center mb-6">
          <span className="text-purple-500 font-bold text-sm tracking-wide">{formattedDate}</span>
          <h2 className="text-xl font-bold text-slate-800 mt-2">Quer nos contar um pouco mais?</h2>
          <p className="text-slate-400 text-xs font-medium">Isso ajudará sua mentora a te dar o melhor apoio.</p>
        </div>

        <div className="space-y-6">
          {/* Módulo de Foto */}
          <div className="relative">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                photoPreview ? 'border-purple-200' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              {photoPreview ? (
                <div className="relative w-full h-full">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                     <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full">Alterar Foto</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-purple-50 text-purple-400 rounded-2xl flex items-center justify-center mb-3">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adicionar uma foto do dia</span>
                </>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
                  <span className="text-[10px] font-black text-purple-600 uppercase">Enviando...</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoSelect} 
            />
            {photoPreview && !uploading && (
              <button 
                onClick={() => { setPhotoPreview(null); setTempMoodPhotoUrl(''); }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Módulo de Áudio / Texto */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Relato do dia
              </h3>
              {loadingTranscription && (
                <div className="flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase animate-pulse">
                   <Sparkles className="w-3.5 h-3.5" /> IA Transcrevendo...
                </div>
              )}
            </div>

            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Descreva aqui ou use o microfone para falar..."
              className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 ring-purple-100 outline-none font-medium text-slate-700 text-sm placeholder:text-slate-300 resize-none"
            />

            <div className="flex items-center gap-3">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loadingTranscription}
                className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  isRecording 
                  ? 'bg-red-500 text-white shadow-red-100 animate-pulse' 
                  : 'bg-purple-600 text-white shadow-purple-100 hover:bg-purple-700'
                } shadow-lg disabled:opacity-50`}
              >
                {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
                <span className="font-bold text-sm uppercase tracking-widest">
                  {isRecording ? 'Parar Gravação' : 'Falar relato'}
                </span>
              </button>
              
              {note && (
                <button 
                  onClick={() => setNote('')}
                  className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
                  title="Limpar texto"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Finalização Fixo */}
      <div className="fixed bottom-28 left-0 right-0 p-6 pointer-events-none z-30">
        <button 
          onClick={handleContinue}
          disabled={uploading || isRecording || loadingTranscription}
          className="w-full bg-[#A855F7] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-200 pointer-events-auto active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          Ver análise da mentora
        </button>
      </div>
    </Layout>
  );
};
