"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  AlertTriangle, 
  Pill, 
  Trophy, 
  MessageSquare,
  Smile,
  Frown,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ChildRecordType } from '../types';

const ChildMoodDiary = () => {
  const { state, saveChildMoodRecord, navigate } = useApp();
  const [selectedType, setSelectedType] = useState<ChildRecordType>('humor');
  const [mood, setMood] = useState('bem');
  const [note, setNote] = useState('');
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    saveChildMoodRecord({
      type: selectedType,
      mood,
      note,
      medication_name: selectedType === 'medicacao' ? medName : undefined,
      dosage: selectedType === 'medicacao' ? dosage : undefined,
      is_milestone: selectedType === 'conquista'
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setNote('');
      setMedName('');
      setDosage('');
    }, 2000);
  };

  const recordTypes = [
    { id: 'humor', label: 'Humor', icon: Smile, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'progresso', label: 'Progresso', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'alerta', label: 'Alerta', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'medicacao', label: 'Medicação', icon: Pill, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'conquista', label: 'Conquista', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('home')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Diário do {state.user?.child_name}</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Seleção de Tipo de Registro */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">O que você quer registrar?</h2>
          <div className="grid grid-cols-5 gap-2">
            {recordTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as ChildRecordType)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                    isSelected ? `${type.bg} ring-2 ring-current ${type.color}` : 'bg-white text-gray-400'
                  }`}
                >
                  <Icon size={24} className="mb-1" />
                  <span className="text-[10px] font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Estado Geral (Humor) */}
        <section className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Smile size={18} className="text-blue-500" />
            Estado geral agora
          </h3>
          <div className="flex justify-between px-2">
            {[
              { id: 'otimo', icon: Smile, label: 'Ótimo', color: 'text-green-500' },
              { id: 'bem', icon: Smile, label: 'Bem', color: 'text-blue-500' },
              { id: 'agitado', icon: Zap, label: 'Agitado', color: 'text-yellow-500' },
              { id: 'crise', icon: Frown, label: 'Crise', color: 'text-red-500' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  mood === m.id ? 'bg-gray-100 scale-110' : 'opacity-40 grayscale'
                }`}
              >
                <m.icon size={32} className={m.color} />
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Campos Dinâmicos */}
        <section className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-500" />
            Detalhes do registro
          </h3>
          
          {selectedType === 'medicacao' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome do medicamento"
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Dosagem (ex: 5ml, 1 comprimido)"
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>
          )}

          <textarea
            placeholder={
              selectedType === 'alerta' ? "O que aconteceu? Descreva o sinal de alerta..." :
              selectedType === 'conquista' ? "Qual foi a grande conquista de hoje?" :
              selectedType === 'progresso' ? "O que ele(a) evoluiu hoje?" :
              "Escreva uma observação..."
            }
            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 min-h-[120px] text-sm"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={handleSave}
            disabled={!note && selectedType !== 'medicacao'}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {showSuccess ? (
              <><CheckCircle2 size={20} /> Registro Salvo!</>
            ) : (
              'Salvar no Diário'
            )}
          </button>
        </section>

        {/* Histórico Recente */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Histórico Recente</h3>
          <div className="space-y-3">
            {state.child_mood_history.slice(0, 5).map((record) => (
              <div key={record.id} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {record.type}
                  </span>
                  <div className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                    {record.mood}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{record.note}</p>
                {record.medication_name && (
                  <div className="mt-2 text-xs font-medium text-purple-600 flex items-center gap-1">
                    <Pill size={12} /> {record.medication_name} ({record.dosage})
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChildMoodDiary;