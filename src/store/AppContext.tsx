"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ROUTINE_TEMPLATES } from '../constants/templates';

interface Routine {
  id: string;
  name: string;
  icon: string;
  habits: string[];
  isTemplate?: boolean;
}

interface AppState {
  user: any;
  routines: Routine[];
  currentPage: string;
}

interface AppContextType {
  state: AppState;
  navigate: (page: string) => void;
  addRoutine: (routine: Omit<Routine, 'id'>) => Promise<void>;
  updateRoutine: (id: string, updates: Partial<Routine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  installTemplate: (templateId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    routines: JSON.parse(localStorage.getItem('routines') || '[]'),
    currentPage: 'dashboard'
  });

  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(state.routines));
  }, [state.routines]);

  const navigate = (page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const addRoutine = async (routine: Omit<Routine, 'id'>) => {
    const newRoutine = { ...routine, id: crypto.randomUUID() };
    setState(prev => ({
      ...prev,
      routines: [...prev.routines, newRoutine]
    }));
  };

  const updateRoutine = async (id: string, updates: Partial<Routine>) => {
    setState(prev => ({
      ...prev,
      routines: prev.routines.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const deleteRoutine = async (id: string) => {
    setState(prev => ({
      ...prev,
      routines: prev.routines.filter(r => r.id !== id)
    }));
  };

  const installTemplate = async (templateId: string) => {
    const template = ROUTINE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    // Check if already installed
    if (state.routines.some(r => r.name === template.name)) {
      return;
    }

    await addRoutine({
      name: template.name,
      icon: template.icon,
      habits: template.habits,
      isTemplate: true
    });
  };

  return (
    <AppContext.Provider value={{ state, navigate, addRoutine, updateRoutine, deleteRoutine, installTemplate }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};