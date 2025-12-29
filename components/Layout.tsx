
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  themeColor?: string;
  headerTransparent?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  showBack = false, 
  themeColor = 'bg-slate-50',
  headerTransparent = false
}) => {
  const { goBack } = useApp();

  return (
    <div className={`min-h-screen flex flex-col ${themeColor} transition-colors duration-500`}>
      <header className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 transition-all duration-300 ${
        headerTransparent 
        ? 'bg-transparent' 
        : 'bg-white/80 backdrop-blur-md border-b border-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={goBack}
              className={`p-2 -ml-2 rounded-full transition-colors ${headerTransparent ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              <ChevronLeft className={`w-6 h-6 ${headerTransparent ? 'text-white' : 'text-slate-700'}`} />
            </button>
          )}
          <h1 className={`font-bold text-lg tracking-tight ${headerTransparent ? 'text-white' : 'text-slate-800'}`}>
            {title || (headerTransparent ? '' : 'Super Mãe')}
          </h1>
        </div>
      </header>

      <main className={`flex-1 ${headerTransparent ? '' : 'mt-16'} pb-32 safe-bottom animate-in fade-in duration-500`}>
        <div className="max-w-lg mx-auto w-full">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
