import type { Plan, PlanType } from './product';
import { PLAN_TYPE_COLORS } from './product';
import { planOccursOnDate } from './recurrence';

export type EventSegment = {
  planId: string;
  label: string;
  planType: PlanType;
  color: string;
  hardStop: boolean;
  startMinutes: number;
  endMinutes: number;
  column: number;
  columns: number;
  overnight: boolean;
};

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function overlaps(first: EventSegment, second: EventSegment): boolean {
  return first.startMinutes < second.endMinutes && second.startMinutes < first.endMinutes;
}

function makeSegment(plan: Plan, startMinutes: number, endMinutes: number, overnight: boolean): EventSegment {
  return { planId: plan.id, label: plan.label, planType: plan.planType, color: PLAN_TYPE_COLORS[plan.planType], hardStop: plan.hardStop, startMinutes, endMinutes, column: 0, columns: 1, overnight };
}

/** Expands plans for one local date into dial-ready segments. It does not render them. */
export function getEventSegments(plans: Plan[], date: Date, timeZone: string): EventSegment[] {
  const segments: EventSegment[] = [];
  plans.filter((plan) => planOccursOnDate(plan, date, timeZone)).forEach((plan) => {
    const start = toMinutes(plan.startTime);
    const rawEnd = toMinutes(plan.endTime);
    const overnight = rawEnd < start;
    const end = overnight ? rawEnd + 1440 : rawEnd;
    if (overnight) {
      segments.push(makeSegment(plan, start, 1440, true));
      segments.push(makeSegment(plan, 0, rawEnd, true));
    } else {
      segments.push(makeSegment(plan, start, end, false));
    }
  });
  return layoutOverlaps(segments);
}

/** Assigns stable columns for overlapping segments so a future dial layer can place them side by side. */
export function layoutOverlaps(segments: EventSegment[]): EventSegment[] {
  const sorted = [...segments].sort((a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes);
  const columns: EventSegment[][] = [];
  sorted.forEach((segment) => {
    let column = columns.findIndex((items) => !items.some((item) => overlaps(item, segment)));
    if (column === -1) { column = columns.length; columns.push([]); }
    segment.column = column;
    columns[column].push(segment);
  });
  return sorted.map((segment) => ({ ...segment, columns: Math.max(1, columns.filter((items) => items.some((item) => overlaps(item, segment))).length) }));
}
