import { useId } from 'react';
import type { MoonPhase } from '../../lib/moon';

export function MoonPhaseIcon({ phase, className = '', decorative = false }: { phase: MoonPhase; className?: string; decorative?: boolean }) {
  const clipId = `moon-texture-${useId().replaceAll(':', '')}`;
  const path = getIlluminatedPath(phase.progress);

  return (
    <svg className={`moon-phase-icon ${className}`} viewBox="0 0 24 24" role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : phase.name} aria-hidden={decorative}>
      <defs><clipPath id={clipId}><circle cx="12" cy="12" r="10" /></clipPath></defs>
      <circle cx="12" cy="12" r="10" className="moon-phase-base" />
      <image href="/images/moon-texture.png" x="2" y="2" width="20" height="20" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} className="moon-phase-texture" />
      {phase.illumination > 0.001 ? <path d={path} className="moon-phase-light" /> : null}
    </svg>
  );
}

function getIlluminatedPath(progress: number): string {
  const isWaxing = progress <= 0.5;
  const terminator = isWaxing ? Math.cos(progress * Math.PI * 2) : -Math.cos(progress * Math.PI * 2);
  const curveSteps = 96;
  const points: Array<[number, number]> = [];
  const addPoint = (x: number, y: number) => points.push([12 + x * 10, 12 + y * 10]);

  if (isWaxing) {
    for (let index = 0; index <= curveSteps; index += 1) {
      const y = -1 + (index / curveSteps) * 2;
      addPoint(terminator * Math.sqrt(Math.max(0, 1 - y * y)), y);
    }
    for (let index = 0; index <= curveSteps; index += 1) {
      const angle = Math.PI / 2 - (index / curveSteps) * Math.PI;
      addPoint(Math.cos(angle), Math.sin(angle));
    }
  } else {
    for (let index = 0; index <= curveSteps; index += 1) {
      const angle = -Math.PI / 2 - (index / curveSteps) * Math.PI;
      addPoint(Math.cos(angle), Math.sin(angle));
    }
    for (let index = 0; index <= curveSteps; index += 1) {
      const y = 1 - (index / curveSteps) * 2;
      addPoint(terminator * Math.sqrt(Math.max(0, 1 - y * y)), y);
    }
  }

  return smoothClosedPath(points);
}

function smoothClosedPath(points: Array<[number, number]>): string {
  if (points.length < 3) return '';
  const formatPoint = ([x, y]: [number, number]) => `${x.toFixed(3)} ${y.toFixed(3)}`;
  const midpoint = (first: [number, number], second: [number, number]): [number, number] => [(first[0] + second[0]) / 2, (first[1] + second[1]) / 2];
  const firstMidpoint = midpoint(points[0], points[1]);
  let path = `M${formatPoint(firstMidpoint)}`;

  for (let index = 1; index < points.length; index += 1) {
    const next = points[(index + 1) % points.length];
    path += ` Q${formatPoint(points[index])} ${formatPoint(midpoint(points[index], next))}`;
  }

  path += ` Q${formatPoint(points[0])} ${formatPoint(firstMidpoint)} Z`;
  return path;
}
