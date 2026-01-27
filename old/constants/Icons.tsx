
import React from 'react';
import { 
  Sun, 
  Moon, 
  Coffee, 
  Heart, 
  Smile, 
  Star, 
  Music, 
  BookOpen, 
  Dumbbell, 
  Zap, 
  Cloud, 
  Sparkles,
  Timer,
  Brush,
  LucideIcon
} from 'lucide-react';

export interface IconOption {
  id: string;
  icon: LucideIcon;
}

export const ICON_GALLERY: IconOption[] = [
  { id: 'Sun', icon: Sun },
  { id: 'Moon', icon: Moon },
  { id: 'Coffee', icon: Coffee },
  { id: 'Heart', icon: Heart },
  { id: 'Smile', icon: Smile },
  { id: 'Star', icon: Star },
  { id: 'Music', icon: Music },
  { id: 'BookOpen', icon: BookOpen },
  { id: 'Dumbbell', icon: Dumbbell },
  { id: 'Zap', icon: Zap },
  { id: 'Cloud', icon: Cloud },
  { id: 'Sparkles', icon: Sparkles },
  { id: 'Timer', icon: Timer },
  { id: 'Brush', icon: Brush },
];

export const getRoutineIcon = (iconId: string | undefined, className: string = "w-6 h-6") => {
  const iconObj = ICON_GALLERY.find(i => i.id === iconId) || ICON_GALLERY[ICON_GALLERY.length - 1];
  const IconComponent = iconObj.icon;
  return <IconComponent className={className} />;
};
