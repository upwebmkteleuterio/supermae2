"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, UserProfile, ChildMoodRecord, RoutineTask, ChildRecordType } from '../types';

interface AppContextType {
  state: AppState;
  login: (name: string, childName: string) => void;
  logout: () => void;
  navigate: (page: string) => void;
  saveChildMoodRecord: (record: Omit<ChildMoodRecord, 'id' | 'date'>) => void;
  toggleTask: (taskId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('supermae_state');
    return saved ? JSON.parse(saved) : {
      user: null,
      children_count: 1,
      child_mood_history: [],
      routine_tasks: [
        { id: '1', title: 'Medicação Manhã', completed: false, category: 'medico', time: '08:00' },
        { id: '2', title: 'Terapia Ocupacional', completed: false, category: 'terapeutico', time: '14:00' }
      ],
      currentPage: 'welcome'
    };
  });

  useEffect(() => {
    localStorage.setItem('supermae_state', JSON.stringify(state));
  }, [state]);

  const login = (name: string, childName: string) => {
    setState(prev => ({
      ...prev,
      user: { id: '1', name, child_name: childName, role: 'mae' },
      currentPage: 'home'
    }));
  };

  const logout = () => {
    setState(prev => ({ ...prev, user: null, currentPage: 'welcome' }));
  };

  const navigate = (page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const saveChildMoodRecord = (recordData: Omit<ChildMoodRecord, 'id' | 'date'>) => {
    const newRecord: ChildMoodRecord = {
      ...recordData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      child_mood_history: [newRecord, ...prev.child_mood_history]
    }));
  };

  const toggleTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      routine_tasks: prev.routine_tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    }));
  };

  return (
    <AppContext.Provider value={{ state, login, logout, navigate, saveChildMoodRecord, toggleTask }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};