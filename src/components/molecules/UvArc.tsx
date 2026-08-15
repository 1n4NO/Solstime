import { useId, useState } from 'react';
import type { UvReading } from '../../lib/uv';
import { uvCategory, uvColor } from '../../lib/uv';

type UvArcProps = { readings: UvReading[]; sunrise: number; sunset: number };

export function UvArc({ readings, sunrise, sunset }: UvArcProps) {
  const [hoveredReading, setHoveredReading] = useState<UvReading | null>(null);
  const gradientPrefix = `uv-gradient-${useId().replaceAll(':', '')}`;
  const daylightReadings = readings.filter((reading) => reading.minutes < sunset && reading.minutes + 60 > sunrise && reading.value > 0);
  if (!daylightReadings.length) return null;
  const peak = Math.max(...daylightReadings.map((reading) => reading.value));
  const firstReadingStart = Math.max(daylightReadings[0].minutes, sunrise);

  return <div className="uv-layer" role="img" aria-label={`Daylight UV index ${Math.round(peak)}, ${uvCategory(peak).toLowerCase()}`}>
    <svg className="uv-arc" viewBox="0 0 100 100" aria-hidden="true">
      <defs>{daylightReadings.map((reading, index) => {
        const nextReading = daylightReadings[index + 1] ?? reading;
        return <linearGradient key={reading.minutes} id={`${gradientPrefix}-${reading.minutes}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={uvColor(reading.value)} /><stop offset="100%" stopColor={uvColor(nextReading.value)} /></linearGradient>;
      })}</defs>
      {firstReadingStart > sunrise && <path className="uv-gap-arc" d={arcPath(sunrise, firstReadingStart, 17.45)} fill="none" stroke="#6c756d" strokeWidth="1.5" strokeLinecap="butt" />}
      {daylightReadings.map((reading) => {
        const start = Math.max(reading.minutes, sunrise);
        const end = Math.min(reading.minutes + 60, sunset);
        const path = annularArcPath(start, end, 16.7, 18.2);
        const hitPath = arcPath(start, end, 17.45);
        return <g key={reading.minutes}>
          <path d={path} fill={`url(#${gradientPrefix}-${reading.minutes})`} opacity=".92" aria-hidden="true" />
          <path className="uv-hit" d={hitPath} fill="none" stroke="transparent" strokeWidth="6" aria-label={`UV ${reading.value.toFixed(1)}, ${uvCategory(reading.value).toLowerCase()}`} onPointerEnter={() => setHoveredReading(reading)} onPointerLeave={() => setHoveredReading(null)} />
        </g>;
      })}
    </svg>
    {hoveredReading && <span className="uv-tooltip" style={tooltipPosition(hoveredReading.minutes)} role="status">UV {hoveredReading.value.toFixed(1)} · {uvCategory(hoveredReading.value)}</span>}
  </div>;
}

function arcPath(startMinutes: number, endMinutes: number, radius: number): string {
  const start = polarPoint(startMinutes, radius);
  const end = polarPoint(endMinutes, radius);
  const largeArc = endMinutes - startMinutes > 720 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function annularArcPath(startMinutes: number, endMinutes: number, innerRadius: number, outerRadius: number): string {
  const start = polarPoint(startMinutes, outerRadius);
  const end = polarPoint(endMinutes, outerRadius);
  const innerEnd = polarPoint(endMinutes, innerRadius);
  const innerStart = polarPoint(startMinutes, innerRadius);
  const largeArc = endMinutes - startMinutes > 720 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${end.x} ${end.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`;
}

function polarPoint(minutes: number, radius: number) {
  const radians = (((minutes / 4) - 180) * Math.PI) / 180;
  return { x: 50 + radius * Math.sin(radians), y: 50 - radius * Math.cos(radians) };
}

function tooltipPosition(minutes: number): { left: string; top: string } {
  const point = polarPoint(minutes + 30, 28);
  return { left: `${point.x}%`, top: `${point.y}%` };
}
