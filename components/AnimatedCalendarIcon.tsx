
import React from 'react';

// Use a local constant to avoid JSX intrinsic element type checking for the custom 'lord-icon' tag.
// This approach is more robust than global JSX namespace augmentation in various TypeScript environments.
const LordIcon = 'lord-icon' as any;

export const AnimatedCalendarIcon: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => {
  return (
    <div className={`${className} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative`}>
      {/* Using the LordIcon variable to prevent 'Property lord-icon does not exist on type JSX.IntrinsicElements' errors */}
      <LordIcon
          src="https://cdn.lordicon.com/uoljexdg.json"
          trigger="hover"
          colors="primary:#A855F7,secondary:#C084FC"
          style={{ width: '100%', height: '100%' }}>
      </LordIcon>
      
      {/* Glow extra de "partículas" ao redor no hover/toque */}
      <div className="absolute inset-0 bg-purple-100/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
    </div>
  );
};
