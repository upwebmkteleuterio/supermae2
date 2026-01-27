
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  themeColor?: string;
  headerTransparent?: boolean;
  rightAction?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  showBack = false, 
  onBack,
  themeColor = 'bg-slate-50',
  headerTransparent = false,
  rightAction
}) => {
  const { goBack } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${themeColor} transition-colors duration-500`}>
      <header className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 transition-all duration-300 ${
        headerTransparent 
        ? 'bg-transparent pointer-events-none' 
        : 'bg-white/80 backdrop-blur-md border-b border-slate-100'
      }`}>
        <div className={`flex items-center gap-3 overflow-hidden ${headerTransparent ? 'pointer-events-auto' : ''}`}>
          {showBack && (
            <button 
              onClick={handleBack}
              className={`p-2 -ml-2 rounded-full transition-colors ${headerTransparent ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              <ChevronLeft className={`w-6 h-6 ${headerTransparent ? 'text-white' : 'text-slate-700'}`} />
            </button>
          )}
          <h1 className={`font-bold text-lg tracking-tight truncate ${headerTransparent ? 'text-white' : 'text-slate-800'}`}>
            {title || (headerTransparent ? '' : 'Super Mãe')}
          </h1>
        </div>
        {rightAction && <div className={`flex items-center ${headerTransparent ? 'pointer-events-auto' : ''}`}>{rightAction}</div>}
      </header>

      <main className={`flex-1 ${headerTransparent ? '' : 'mt-16'} pb-32 safe-bottom animate-in fade-in duration-500`}>
        <div className="max-w-lg mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
