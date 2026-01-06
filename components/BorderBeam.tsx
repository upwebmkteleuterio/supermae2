import React from 'react';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  size = 150,
  duration = 10,
  delay = 0,
  colorFrom = "#A855F7",
  colorTo = "#EAB308",
}) => {
  return (
    <div
      style={{
        "--size": size,
        "--duration": `${duration}s`,
        "--delay": `${delay}s`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
      } as React.CSSProperties}
      className="pointer-events-none absolute inset-0 rounded-[inherit] [border:2px_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <div
        className="absolute inset-0 aspect-square h-[calc(var(--size)*1px)] w-[calc(var(--size)*1px)] animate-border-beam [animation-delay:var(--delay)] [background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] [offset-anchor:calc(var(--size)*0.5px)_calc(var(--size)*0.5px)] [offset-path:rect(0_100%_100%_0_round_32px)]"
      />
    </div>
  );
};