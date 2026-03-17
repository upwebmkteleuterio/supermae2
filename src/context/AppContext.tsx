"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ROUTINE_TEMPLATES } from '../constants/routines';
import { toast } from 'react-hot-toast';

interface AppContextType {
  user: any;
  children: any[];
  currentChild: any | null;
  loading: boolean;
  currentPage: string;
  navigate: (page: string) => void;
  applyRoutineTemplate: (templateId: string, date: string) => Promise<void>;
  refreshAgenda: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  const [user, setUser] = useState<any>(null);
  const [childList, setChildList] = useState<any[]>([]);
  const [currentChild, setCurrentChild] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: childs } = await supabase.from('children').select('*').eq('user_id', session.user.id);
        setChildList(childs || []);
        if (childs && childs.length > 0) setCurrentChild(childs[0]);
      }
      setLoading(false);
    };
    initSession();
  }, []);

  const navigate = (page: string) => setCurrentPage(page);

  const refreshAgenda = async () => {
    // Esta função será chamada pelas páginas para atualizar as listas
    // Implementação real depende da página, mas o trigger pode ser um estado simples
  };

  const applyRoutineTemplate = async (templateId: string, date: string) => {
    if (!user) return;
    
    const template = ROUTINE_TEMPLATES[templateId];
    if (!template) return;

    const itemsToInsert = template.tasks.map(task => ({
      user_id: user.id,
      title: task.title,
      category: task.category,
      priority: task.priority,
      status: 'pending',
      date: date,
      child_id: currentChild?.id || null
    }));

    const { error } = await supabase.from('agenda_items').insert(itemsToInsert);

    if (error) {
      toast.error("Erro ao aplicar rotina: " + error.message);
      throw error;
    } else {
      toast.success(`Rotina "${template.name}" aplicada com sucesso!`);
      await refreshAgenda();
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      children: childList, 
      currentChild, 
      loading, 
      currentPage, 
      navigate,
      applyRoutineTemplate,
      refreshAgenda
    }}>
      {reactChildren}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};