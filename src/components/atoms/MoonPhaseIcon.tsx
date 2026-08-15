import type { MoonPhase } from '../../lib/moon';

export function MoonPhaseIcon({ phase, className = '', decorative = false }: { phase: MoonPhase; className?: string; decorative?: boolean }) {
  const waxing = phase.progress <= 0.5;
  const innerRadius = Math.abs(Math.cos(phase.progress * Math.PI * 2) * 10).toFixed(2);
  const path = waxing
    ? `M12 2 A10 10 0 0 1 12 22 A${innerRadius} 10 0 0 0 12 2 Z`
    : `M12 2 A10 10 0 0 0 12 22 A${innerRadius} 10 0 0 1 12 2 Z`;

  return (
    <svg className={`moon-phase-icon ${className}`} viewBox="0 0 24 24" role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : phase.name} aria-hidden={decorative}>
      <circle cx="12" cy="12" r="10" className="moon-phase-base" />
      {phase.illumination > 0.02 && <path d={path} className="moon-phase-light" />}
    </svg>
  );
}
