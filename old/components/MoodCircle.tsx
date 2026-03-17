
import React from 'react';

interface MoodCircleProps {
  colors: string[];
  dayNum: number | string;
  isToday?: boolean;
  isSelected?: boolean;
  className?: string;
}

export const MoodCircle: React.FC<MoodCircleProps> = ({ colors, dayNum, isToday, isSelected, className = "w-10 h-10" }) => {
  return (
    <div className={`${className} rounded-full flex items-center justify-center transition-all relative ${isToday ? 'bg-purple-50 ring-2 ring-purple-100' : ''} ${isSelected ? 'scale-110' : ''}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
          {colors.length > 0 ? (
            colors.map((color, idx) => (
              <circle
                key={idx}
                cx="16" cy="16" r="14"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeDasharray={`${(1 / colors.length) * 88} 88`}
                strokeDashoffset={-((idx / colors.length) * 88)}
                className="transition-all duration-500"
              />
            ))
          ) : (
            <circle
              cx="16" cy="16" r="14"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>
      <span className={`text-[11px] font-bold z-10 ${colors.length > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
        {dayNum}
      </span>
    </div>
  );
};
