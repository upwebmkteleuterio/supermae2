
import React from 'react';

export const AIIcon: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="loader">
        <div className="loader_cube loader_cube--color"></div>
        <div className="loader_cube loader_cube--glowing"></div>
      </div>

      <style>{`
        .loader {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader_cube {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 30px;
        }

        .loader_cube--glowing {
          z-index: 2;
          background-color: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-blur: 4px;
        }

        .loader_cube--color {
          z-index: 1;
          filter: blur(4px);
          background: linear-gradient(135deg, #1afbf0, #da00ff);
          /* Animação suavizada para 3.5s */
          animation: loadtwo 3.5s ease-in-out infinite;
        }

        @keyframes loadtwo {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(-80deg) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};
