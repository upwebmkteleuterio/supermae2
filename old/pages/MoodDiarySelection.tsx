
import React from 'react';
import { Layout } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { SOSButton } from '../components/SOSButton';
import { 
  Smile, 
  Baby, 
  ChevronRight,
  ArrowLeft,
  BarChart3
} from 'lucide-react';

export const MoodDiarySelection: React.FC = () => {
  const { navigate, goBack } = useApp();

  return (
    <Layout headerTransparent themeColor="bg-[#FDFCFE]">
      <div className="pt-12 px-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('home')} className="p-3 bg-purple-100/50 rounded-full text-purple-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Diário emocional</h1>
        </div>
        <SOSButton />
      </div>

      <div className="px-6 space-y-3 pb-32">
        <DiaryListItem 
          icon={<Smile className="w-6 h-6" />} 
          label="Meu diário emocional" 
          onClick={() => navigate('mood_diary')} 
        />
        <DiaryListItem 
          icon={<Baby className="w-6 h-6" />} 
          label="Diário emocional do filho" 
          onClick={() => navigate('child_mood_children_selection')} 
        />
        <DiaryListItem 
          icon={<BarChart3 className="w-6 h-6" />} 
          label="Dashboard de emoções" 
          onClick={() => navigate('mood_dashboard')} 
        />
      </div>
    </Layout>
  );
};

const DiaryListItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  isUnderConstruction?: boolean;
}> = ({ icon, label, onClick, isUnderConstruction }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[1.8rem] p-5 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-all group relative"
  >
    {isUnderConstruction && (
      <div className="absolute -top-2 left-8 z-10 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border border-white">
        Em construção
      </div>
    )}
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-[#F3E8FF] text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
        {icon}
      </div>
      <span className="text-slate-700 font-bold text-sm">{label}</span>
    </div>
    <ChevronRight className="w-6 h-6 text-purple-300" />
  </button>
);
