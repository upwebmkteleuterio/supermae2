"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { CalendarHeader } from '../components/CalendarHeader';
import { AlertCircle, Zap, Sparkles, CalendarDays, Plus, Info, BrainCircuit } from 'lucide-react';
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
  
  const lastAnalyzedHashRef = useRef<string>("");

  const momTasks = state.manualMomAgenda.filter(t => t.date === state.selectedDate);
  const childTasks = state.manualChildAgenda.filter(t => t.date === state.selectedDate);
  
  const combinedMap = new Map<string, AgendaItem>();
  [...momTasks, ...childTasks].forEach(t => combinedMap.set(t.id, t));
  const combined = Array.from(combinedMap.values()).sort((a, b) => a.time.localeCompare(b.time));

  useEffect(() => {
    const fetchInsights = async () => {
      if (combined.length === 0) {
        setInsights([]);
        return;
      }

      const currentHash = combined.map(t => `${t.id}-${t.time}-${t.completed}`).join('|') + state.selectedDate;
      if (currentHash === lastAnalyzedHashRef.current) return;

      setLoadingIA(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analise esta agenda combinada de uma mãe atípica e seu filho. 
        Categorias Ativas: Terapêutico, Sensorial, Comunicacional, Lúdico, Médico, Autonomia, Relacional e Educacional.
        
        REGRAS DE NEGÓCIO PARA INSIGHTS:
        1. Identifique conflitos se houver terapias (Terapêutico) ou consultas (Médico) sobrepostas.
        2. Se houver muitas tarefas "Educacionais" ou "Terapêuticas" seguidas, sugira uma pausa de "Cuidado Sensorial" ou "Lúdico".
        3. Identifique se a mãe tem tempo para si (Relacional) em meio às demandas do filho.
        4. Analise a carga sensorial do dia (muitas saídas de casa podem causar sobrecarga).
        
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
        setInsights([{title: "Análise inteligente", text: "Seu dia parece organizado. Continue observando os sinais de cansaço.", type: 'suggest'}]);
      } finally {
        setLoadingIA(false);
      }
    };
    fetchInsights();
  }, [state.selectedDate, combined.length, state.manualMomAgenda, state.manualChildAgenda]);

  return (
    <Layout title="Agenda Integrada" showBack themeColor="bg-indigo-50/10">
      <div className="px-6 pt-6 pb-32">
        <CalendarHeader />

        {/* Banner de Inteligência Terapêutica */}
        <div className="bg-indigo-600 rounded-[2rem] p-6 mb-8 border border-indigo-400 flex items-start gap-4 shadow-xl shadow-indigo-100">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm">
             <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Visão 360° da Jornada</h4>
            <p className="text-indigo-100 text-[10px] font-medium leading-relaxed">
              Minha IA analisa o equilíbrio entre terapias, escola e o seu bem-estar emocional em tempo real.
            </p>
          </div>
        </div>

        {/* Carousel de Insights Estratégicos */}
        <div className="mb-10 -mx-6">
          <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar snap-x snap-mandatory">
            {loadingIA ? (
              <div className="min-w-[85%] bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 snap-center relative overflow-hidden">
                <div className="skeleton w-32 h-4 mb-4 rounded-full opacity-50"></div>
                <div className="skeleton w-full h-16 rounded-2xl opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-relaxed">
                     Processando rotina terapêutica...
                   </p>
                </div>
              </div>
            ) : combined.length === 0 ? (
              <div className="min-w-[85%] bg-white border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] text-slate-400 flex items-center gap-4 snap-center">
                <Sparkles className="w-8 h-8 opacity-20" />
                <p className="text-xs font-bold leading-tight">Adicione as terapias e atividades escolares para receber orientações da IA.</p>
              </div>
            ) : (
              insights.map((insight, idx) => (
                <div key={idx} className={`min-w-[85%] p-8 rounded-[2.5rem] shadow-lg snap-center border-b-4 ${
                  insight.type === 'conflict' ? 'bg-rose-50 border-rose-500' : 'bg-white border-indigo-500'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {insight.type === 'conflict' ? <AlertCircle className="text-rose-600 w-5 h-5" /> : <Zap className="text-indigo-600 w-5 h-5" />}
                    <h4 className={`font-black uppercase tracking-widest text-[9px] ${insight.type === 'conflict' ? 'text-rose-700' : 'text-indigo-400'}`}>
                      {insight.title}
                    </h4>
                  </div>
                  <p className={`text-sm leading-relaxed font-bold ${insight.type === 'conflict' ? 'text-slate-700' : 'text-slate-800'}`}>
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
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            Linha do Tempo
          </h3>
          <button 
            onClick={() => { setEditingTask(undefined); setShowModal(true); }}
            className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
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
    </Layout>
  );
};