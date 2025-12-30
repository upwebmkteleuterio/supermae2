
import React, { useState, useEffect } from 'react';

// Use a local constant to avoid JSX intrinsic element type checking for the custom 'lord-icon' tag.
const LordIcon = 'lord-icon' as any;

export const AnimatedCalendarIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  const [trigger, setTrigger] = useState<'loop' | 'hover'>('loop');

  useEffect(() => {
    // Faz o ícone animar sozinho por 3 segundos (aprox. 2 ciclos completos) 
    // e depois muda para o modo 'hover' para interações futuras.
    const timer = setTimeout(() => {
      setTrigger('hover');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative group">
      {/* Caixa Lilás (Container do ícone) - Agora com rounded-2xl conforme solicitado */}
      <div className={`${className} bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-500 relative z-10 overflow-hidden`}>
        {/* Lordicon configurado para cores Brancas */}
        <LordIcon
            src="https://cdn.lordicon.com/uoljexdg.json"
            trigger={trigger}
            colors="primary:#ffffff,secondary:#ffffff"
            style={{ width: '70%', height: '70%' }}>
        </LordIcon>
        
        {/* Reflexo interno para efeito de vidro/glossy */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Glow externo de pulso suave */}
      <div className="absolute inset-0 bg-purple-400/30 blur-xl rounded-full scale-90 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10"></div>
    </div>
  );
};
