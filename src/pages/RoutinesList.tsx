"use client";

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ROUTINE_TEMPLATES } from '../constants/templates';
import { Heart, Zap, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const iconMap: Record<string, any> = {
  Heart,
  Zap
};

const RoutinesList = () => {
  const { state, navigate, deleteRoutine, updateRoutine, installTemplate } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartEdit = (routine: any) => {
    setEditingId(routine.id);
    setEditName(routine.name);
  };

  const handleSaveEdit = async (id: string) => {
    await updateRoutine(id, { name: editName });
    setEditingId(null);
  };

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Minhas Rotinas</h1>
        <p className="text-gray-500">Gerencie seus rituais diários</p>
      </header>

      {/* Templates Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 text-purple-700">Sugestões de Rotinas</h2>
        <div className="grid gap-4">
          {ROUTINE_TEMPLATES.map(template => {
            const isInstalled = state.routines.some(r => r.name === template.name);
            const Icon = iconMap[template.icon] || Heart;

            return (
              <div key={template.id} className="bg-purple-50 p-4 rounded-2xl flex items-center justify-between border border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">{template.name}</h3>
                    <p className="text-sm text-purple-600">{template.duration} • {template.habits.length} atividades</p>
                  </div>
                </div>
                {!isInstalled && (
                  <button 
                    onClick={() => installTemplate(template.id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Instalar
                  </button>
                )}
                {isInstalled && (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Instalado</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* User Routines */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Rotinas Ativas</h2>
        <div className="grid gap-4">
          {state.routines.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">Você ainda não tem rotinas.</p>
            </div>
          )}
          
          {state.routines.map(routine => {
            const Icon = iconMap[routine.icon] || Heart;
            const isEditing = editingId === routine.id;

            return (
              <div key={routine.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                    <Icon size={20} />
                  </div>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1 mr-4">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border-b-2 border-purple-500 outline-none w-full py-1 text-gray-800"
                        autoFocus
                      />
                      <button onClick={() => handleSaveEdit(routine.id)} className="text-green-600 p-1">
                        <Check size={20} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-red-500 p-1">
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-gray-800">{routine.name}</h3>
                      <p className="text-xs text-gray-500">{routine.habits.length} hábitos selecionados</p>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleStartEdit(routine)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm('Deseja excluir esta rotina?')) deleteRoutine(routine.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Action Button for Manual Creation */}
      <button 
        onClick={() => navigate('create-routine')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-all active:scale-95"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default RoutinesList;