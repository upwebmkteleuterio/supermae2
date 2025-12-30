
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { CalendarHeader } from '../components/CalendarHeader';
import { AlertCircle, Zap, Sparkles, CalendarDays, Plus, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AgendaList } from '../components/AgendaList';
import { TaskModal } from '../components/TaskModal';
import { AgendaItem } from '../types';

export const IntegratedAgenda: React.FC = () => {
  const { state, deleteAgendaItem, updateAgendaItem, addAgendaItem } = useApp();
  const [insights, setInsights] = useState<{title: string, text: string, type: 'conflict' | 'suggest'}[]>([]);
  const [loadingIA, setLoadingIA] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<AgendaItem | undefined>(undefined);
  
  // Cache Ref para evitar chamadas duplicadas e economizar tokens
  const lastAnalyzedHashRef = useRef<string>("");

  const momTasks = state.manualMomAgenda.filter(t => t.date === state.selectedDate);
  const childTasks = state.manualChildAgenda.filter(t => t.date === state.selectedDate);
  
  // Unificar por ID para evitar duplicatas visuais
  const combinedMap = new Map<string, AgendaItem>();
  [...momTasks, ...childTasks].forEach(t => combinedMap.set(t.id, t));
  const combined = Array.from(combinedMap.values()).sort((a, b) => a.time.localeCompare(b.time));

  useEffect(() => {
    const fetchInsights = async () => {
      if (combined.length === 0) {
        setInsights([]);
        return;
      }

      // Gerar Hash baseado na lista (IDs e Horários) e na data para cache
      const currentHash = combined.map(t => `${t.id}-${t.time}-${t.completed}`).join('|') + state.selectedDate;
      if (currentHash === lastAnalyzedHashRef.current) return;

      setLoadingIA(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analise esta agenda combinada e identifique conflitos de horário reais. 
        REGRAS DE NEGÓCIO: 
        1. Tarefas com o mesmo ID ou Título no mesmo horário NÃO SÃO CONFLITOS, são tarefas integradas.
        2. Alerte apenas se a mãe tiver compromissos diferentes em locais/horários que se sobrepõem.
        3. Sugira pausas de autocuidado se houver blocos de mais de 3 horas sem pausa.
        
        Agenda Atual: ${JSON.stringify(combined)} 
        Responda APENAS JSON: [{title, text, type: 'conflict' | 'suggest'}]`;

        const res = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt
        });
        
        const data = JSON.parse(res.text || "[]");
        setInsights(data);
        lastAnalyzedHashRef.current = currentHash;
      } catch (e) {
        setInsights([{title: "Análise inteligente", text: "Seu dia parece organizado. Continue assim!", type: 'suggest'}]);
      } finally {
        setLoadingIA(false);
      }
    };
    fetchInsights();
  }, [state.selectedDate, combined.length, state.manualMomAgenda, state.manualChildAgenda]);

  return (
    <Layout title="Agenda Integrada" showBack themeColor="bg-purple-50/10">
      <div className="px-6 pt-6 pb-32">
        <CalendarHeader />

        {/* Texto Explicativo */}
        <div className="bg-indigo-50 rounded-[2rem] p-6 mb-8 border border-indigo-100 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
             <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-indigo-900 font-bold text-sm mb-1">Harmonia na rotina</h4>
            <p className="text-indigo-400 text-[10px] font-medium leading-relaxed">
              Aqui você vê seus compromissos e os do seu filho em uma única linha do tempo. Nossa IA analisa conflitos e sugere pausas para garantir seu bem-estar.
            </p>
          </div>
        </div>

        {/* Carousel Insights */}
        <div className="mb-10 -mx-6">
          <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar snap-x snap-mandatory">
            {loadingIA ? (
              <div className="min-w-[85%] bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 snap-center relative overflow-hidden">
                <div className="skeleton w-32 h-4 mb-4 rounded-full opacity-50"></div>
                <div className="skeleton w-full h-16 rounded-2xl opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-relaxed">
                     Analisando sua rotina integrada...
                   </p>
                </div>
              </div>
            ) : combined.length === 0 ? (
              <div className="min-w-[85%] bg-purple-600 p-8 rounded-[3rem] text-white shadow-lg flex items-center gap-4 snap-center border-b-4 border-purple-800">
                <Sparkles className="w-8 h-8 opacity-50" />
                <p className="text-sm font-bold">Adicione tarefas para ativar a análise inteligente.</p>
              </div>
            ) : (
              insights.map((insight, idx) => (
                <div key={idx} className={`min-w-[85%] p-8 rounded-[3rem] shadow-lg snap-center border-b-4 ${
                  insight.type === 'conflict' ? 'bg-amber-50 border-amber-500' : 'bg-indigo-600 text-white border-indigo-900'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {insight.type === 'conflict' ? <AlertCircle className="text-amber-600 w-5 h-5" /> : <Zap className="text-white w-5 h-5" />}
                    <h4 className={`font-black uppercase tracking-widest text-[10px] ${insight.type === 'conflict' ? 'text-amber-700' : 'text-indigo-200'}`}>
                      {insight.title}
                    </h4>
                  </div>
                  <p className={`text-sm leading-relaxed font-bold ${insight.type === 'conflict' ? 'text-slate-700' : 'text-white'}`}>
                    {insight.text}
                  </p>
                </div>
              ))
            )}
            <div className="min-w-[15%]"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-500" />
            Agenda Combinada
          </h3>
          <button 
            onClick={() => { setEditingTask(undefined); setShowModal(true); }}
            className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <AgendaList 
          tasks={combined}
          onEdit={(task) => { setEditingTask(task); setShowModal(true); }}
          onDelete={(id) => deleteAgendaItem(id)}
          owner="mãe"
          showTags
        />
      </div>

      {showModal && (
        <TaskModal 
          onClose={() => setShowModal(false)}
          onSave={(task) => { 
            if (editingTask) updateAgendaItem(task as AgendaItem);
            else addAgendaItem(task as AgendaItem); 
            setShowModal(false); 
          }}
          initialTask={editingTask}
          date={state.selectedDate}
        />
      )}
    </div>
  );
};
