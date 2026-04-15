import React, { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import { LayoutGrid, MessageCircle, Calendar, MessagesSquare, Settings, LucideIcon } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ViewState } from '../types';

interface NavItemConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  pages: ViewState[];
  target: ViewState;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', icon: LayoutGrid, label: 'Início', pages: ['home'], target: 'home' },
  { id: 'sentiments', icon: MessageCircle, label: 'Sentimentos', pages: ['sentiment_analysis'], target: 'sentiment_analysis' },
  { id: 'care', icon: Calendar, label: 'Cuidados', pages: [
    'care_agenda', 'mom_agenda', 'child_agenda', 'integrated_agenda', 
    'routines_list', 'routine_detail', 'habit_selection', 'add_child', 
    'children_selection', 'care_instances_target', 'care_instances_list', 
    'care_instances_intensity', 'care_instances_tasks'
  ], target: 'care_agenda' },
  { id: 'channels', icon: MessagesSquare, label: 'Canais', pages: ['channels_list'], target: 'channels_list' },
  { id: 'config', icon: Settings, label: 'Config', pages: ['settings', 'personal_data'], target: 'settings' },
];

// Adicionado 'animation_preview' à lista de páginas que escondem o menu
const HIDDEN_PAGES: ViewState[] = ['welcome', 'onboarding', 'breathing_exercise', 'channel_chat', 'animation_preview'];

export const BottomNav: React.FC = () => {
  const { state, navigate } = useApp();
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 });
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => {
    const index = NAV_ITEMS.findIndex(item => item.pages.includes(state.currentPage));
    return index === -1 ? 0 : index;
  }, [state.currentPage]);

  const updatePosition = () => {
    const activeElement = itemRefs.current[activeIndex];
    if (activeElement && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      if (elementRect.width > 0) {
        setIndicatorStyle({
          left: elementRect.left - containerRect.left,
          width: elementRect.width,
          opacity: 1
        });
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ResizeObserver) return;

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    itemRefs.current.forEach(ref => {
      if (ref) resizeObserver.observe(ref);
    });

    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  useLayoutEffect(() => {
    updatePosition();
    const timer = setTimeout(updatePosition, 50);
    const timer2 = setTimeout(updatePosition, 300);
    const timer3 = setTimeout(updatePosition, 600);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeIndex, state.currentPage]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activeIndex]);

  if (HIDDEN_PAGES.includes(state.currentPage) || state.isBreathingActive) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md z-50">
      <nav 
        ref={containerRef}
        className="relative bg-[#A855F7] rounded-full p-1.5 flex justify-between items-center shadow-[0_20px_50px_rgba(168,85,247,0.4)] border border-white/10 backdrop-blur-md overflow-hidden"
      >
        <div 
          className="absolute h-[calc(100%-12px)] bg-white rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg z-0"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity
          }}
        />

        {NAV_ITEMS.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              ref={el => { itemRefs.current[index] = el; }}
              onClick={() => navigate(item.target)}
              className={`relative z-10 flex items-center gap-2 py-2.5 px-4 rounded-full transition-colors duration-500 outline-none active:scale-95 ${
                isActive ? 'text-[#A855F7]' : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100'}`} />
              
              <div 
                className="overflow-hidden transition-all duration-500 ease-in-out flex items-center"
                style={{ 
                  maxWidth: isActive ? '140px' : '0px',
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? '4px' : '0px'
                }}
              >
                <span className="text-[11px] font-black whitespace-nowrap tracking-tight">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};