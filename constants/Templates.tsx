"use client";

export interface RoutineTemplate {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  duration: string;
  habitIds: string[];
}

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'template-abraco-mae',
    name: 'Abraço de Mãe',
    icon: 'Heart',
    subtitle: 'Acolhedora',
    description: 'Promover acolhimento emocional e pausa gentil.',
    duration: '15-30 min',
    habitIds: ['se3', 'se1', 'se2', 'ts3', 'cl6', 'se11']
  },
  {
    id: 'template-super-mae',
    name: 'Super Mãe em Movimento',
    icon: 'Zap',
    subtitle: 'Enérgica',
    description: 'Estimular disposição e ação.',
    duration: '20-40 min',
    habitIds: ['cl1', 'cl4', 'ea5', 'ov2', 'cb6', 'pr5']
  }
];