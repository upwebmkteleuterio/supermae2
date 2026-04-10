"use client";

import { supabase } from '../lib/supabase';

export interface DiagnosticLog {
  timestamp: string;
  strategy: 'Direct' | 'Nested' | 'Raw/String';
  status: 'SUCCESS' | 'ERROR';
  payload: any;
  error?: any;
}

export const runDeepScan = async (userId: string) => {
  const logs: DiagnosticLog[] = [];

  // Strategy 1: Busca Direta
  try {
    const { data, error } = await supabase
      .from('indications_partners')
      .select('*')
      .limit(5);
    
    logs.push({
      timestamp: new Date().toISOString(),
      strategy: 'Direct',
      status: error ? 'ERROR' : 'SUCCESS',
      payload: data,
      error: error
    });
  } catch (e) { console.error(e); }

  // Strategy 2: Busca por Relacionamento
  try {
    const { data, error } = await supabase
      .from('indications_partners')
      .select(`
        id, name, user_id,
        profiles (name)
      `)
      .limit(5);

    logs.push({
      timestamp: new Date().toISOString(),
      strategy: 'Nested',
      status: error ? 'ERROR' : 'SUCCESS',
      payload: data,
      error: error
    });
  } catch (e) { console.error(e); }

  // Strategy 3: Busca por Filtro Bruto
  try {
    const { data, error } = await supabase
      .from('indications_partners')
      .select('*')
      .filter('user_id', 'eq', userId);

    logs.push({
      timestamp: new Date().toISOString(),
      strategy: 'Raw/String',
      status: error ? 'ERROR' : 'SUCCESS',
      payload: data,
      error: error
    });
  } catch (e) { console.error(e); }

  return logs;
};