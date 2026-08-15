'use client';

import { useEffect, useState } from 'react';
import type { EventSegment } from '../../lib/events';

type EventArcLayerProps = { segments: EventSegment[]; currentTimezoneCity: string; isSwitching: boolean; onActiveChange: (segment: EventSegment | null) => void; activeEventId?: string };

const OUTER_RADIUS = 42;
const LANE_WIDTH = 6.5;

function point(radius: number, angle: number): [number, number] {
  const radians = angle * Math.PI / 180;
  return [50 + radius * Math.sin(radians), 50 - radius * Math.cos(radians)];
}

function annularPath(segment: EventSegment): string {
  const startAngle = (segment.startMinutes / 4) - 180;
  const endAngle = (segment.endMinutes / 4) - 180;
  const span = segment.endMinutes - segment.startMinutes;
  const outerRadius = OUTER_RADIUS - segment.column * LANE_WIDTH;
  const innerRadius = outerRadius - LANE_WIDTH;
  const [outerStartX, outerStartY] = point(outerRadius, startAngle);
  const [outerEndX, outerEndY] = point(outerRadius, endAngle);
  const [innerEndX, innerEndY] = point(innerRadius, endAngle);
  const [innerStartX, innerStartY] = point(innerRadius, startAngle);
  const largeArc = span > 720 ? 1 : 0;
  return `M ${outerStartX} ${outerStartY} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEndX} ${outerEndY} L ${innerEndX} ${innerEndY} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY} Z`;
}

function innerArcPath(segment: EventSegment): string {
  const startAngle = (segment.startMinutes / 4) - 180;
  const endAngle = (segment.endMinutes / 4) - 180;
  const span = segment.endMinutes - segment.startMinutes;
  const radius = OUTER_RADIUS - (segment.column + 1) * LANE_WIDTH;
  const [startX, startY] = point(radius, startAngle);
  const [endX, endY] = point(radius, endAngle);
  const largeArc = span > 720 ? 1 : 0;
  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
}

function midpoint(segment: EventSegment): { left: number; top: number } {
  const angle = ((segment.startMinutes + segment.endMinutes) / 8) - 180;
  const [left, top] = point(34 - segment.column * LANE_WIDTH, angle);
  return { left, top };
}

function displayTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

export function EventArcLayer({ segments, currentTimezoneCity, isSwitching, onActiveChange, activeEventId }: EventArcLayerProps) {
  const [hoveredId, setHoveredId] = useState<string>();
  const [pinnedId, setPinnedId] = useState<string>();
  useEffect(() => {
    if (!activeEventId) setPinnedId(undefined);
  }, [activeEventId]);
  const active = segments.find((segment) => segment.planId === (pinnedId ?? hoveredId ?? activeEventId));
  const activePosition = active ? midpoint(active) : null;

  return (
    <>
      <div className={`event-arc-rotating-layer${isSwitching ? ' event-arc-rotating-layer--switching' : ''}`}>
      <svg className="event-arc-layer" viewBox="0 0 100 100" aria-label="Planned events">
        {segments.map((segment) => {
          const path = annularPath(segment);
          const label = `${segment.label}, ${displayTime(segment.displayStartMinutes)} to ${displayTime(segment.displayEndMinutes)}, ${segment.planType}`;
          return (
            <g key={`${segment.planId}-${segment.startMinutes}`}>
              <path className="event-arc" d={path} fill={segment.color} stroke="#f3f0e8" strokeWidth="0.34" strokeLinejoin="round" aria-hidden="true" />
              {segment.hardStop && <path className="event-hard-stop" d={innerArcPath(segment)} fill="none" stroke="#e06f66" strokeWidth="0.7" strokeLinecap="butt" aria-hidden="true" />}
              <path className="event-arc-hit" d={path} fill="transparent" stroke="transparent" strokeWidth="0" tabIndex={0} role="button" aria-label={label} onPointerEnter={() => { setHoveredId(segment.planId); onActiveChange(segment); }} onPointerLeave={() => { setHoveredId(undefined); if (!pinnedId) onActiveChange(null); }} onFocus={() => { setHoveredId(segment.planId); onActiveChange(segment); }} onBlur={() => { if (!pinnedId) onActiveChange(null); }} onClick={() => { const nextPinnedId = pinnedId === segment.planId ? undefined : segment.planId; setPinnedId(nextPinnedId); onActiveChange(nextPinnedId ? segment : null); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); const nextPinnedId = pinnedId === segment.planId ? undefined : segment.planId; setPinnedId(nextPinnedId); onActiveChange(nextPinnedId ? segment : null); } }} />
            </g>
          );
        })}
      </svg>
      </div>
      {active && activePosition && <div className="event-popover" style={{ left: `${activePosition.left}%`, top: `${activePosition.top}%` }} role="status">
        <b>{active.label || 'Untitled plan'}</b>
        <span>{displayTime(active.displayStartMinutes)}–{displayTime(active.displayEndMinutes)} · {active.planType}</span>
        {active.sourceTimezoneCity !== currentTimezoneCity && <span>{displayTime(active.sourceStartMinutes)}–{displayTime(active.sourceEndMinutes)} · {active.sourceTimezoneCity}</span>}
      </div>}
    </>
  );
}
