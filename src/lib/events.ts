import type { Plan, PlanType } from './product';
import type { TimezoneLocation } from './product';
import { PLAN_TYPE_COLORS } from './product';
import { planOccursOnDate } from './recurrence';
import { dateKey, localDateTimeToDate, localHour } from './time';

export type EventSegment = {
  planId: string;
  label: string;
  planType: PlanType;
  color: string;
  hardStop: boolean;
  sourceStartMinutes: number;
  sourceEndMinutes: number;
  displayStartMinutes: number;
  displayEndMinutes: number;
  sourceTimezoneCity: string;
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

function makeSegment(plan: Plan, startMinutes: number, endMinutes: number, overnight: boolean, displayStartMinutes: number, displayEndMinutes: number, sourceTimezoneCity: string): EventSegment {
  return { planId: plan.id, label: plan.label, planType: plan.planType, color: PLAN_TYPE_COLORS[plan.planType], hardStop: plan.hardStop, sourceStartMinutes: toMinutes(plan.startTime), sourceEndMinutes: toMinutes(plan.endTime), displayStartMinutes, displayEndMinutes, sourceTimezoneCity, startMinutes, endMinutes, column: 0, columns: 1, overnight };
}

/** Expands plans for one local date into dial-ready segments. It does not render them. */
export function getEventSegments(plans: Plan[], timezones: TimezoneLocation[], date: Date, targetTimeZone: string): EventSegment[] {
  const segments: EventSegment[] = [];
  const targetDate = dateKey(date, targetTimeZone);
  plans.forEach((plan) => {
    const sourceTimezone = timezones.find((timezone) => timezone.id === plan.timezoneId);
    if (!sourceTimezone || !planOccursOnDate(plan, date, sourceTimezone.timeZone)) return;
    const start = toMinutes(plan.startTime);
    const rawEnd = toMinutes(plan.endTime);
    const overnight = rawEnd < start;
    const sourceDate = dateKey(date, sourceTimezone.timeZone);
    const endDate = overnight ? dateKey(date, sourceTimezone.timeZone, 1) : sourceDate;
    const startDateTime = localDateTimeToDate(sourceDate, plan.startTime, sourceTimezone.timeZone);
    const endDateTime = localDateTimeToDate(endDate, plan.endTime, sourceTimezone.timeZone);
    if (!startDateTime || !endDateTime || endDateTime <= startDateTime) return;
    const targetStartDate = dateKey(startDateTime, targetTimeZone);
    const targetEndDate = dateKey(endDateTime, targetTimeZone);
    if (targetStartDate > targetDate || targetEndDate < targetDate) return;
    const displayStart = targetStartDate === targetDate ? Math.round(localHour(startDateTime, targetTimeZone) * 60) : 0;
    const displayEnd = targetEndDate === targetDate ? Math.round(localHour(endDateTime, targetTimeZone) * 60) : 1440;
    if (displayEnd <= displayStart) return;
    segments.push(makeSegment(plan, displayStart, displayEnd, overnight, displayStart, displayEnd, sourceTimezone.city));
  });
  return layoutOverlaps(segments);
}

/** Assigns stable columns for overlapping segments so a future dial layer can place them side by side. */
export function layoutOverlaps(segments: EventSegment[]): EventSegment[] {
  const sorted = [...segments].sort((a, b) => a.startMinutes - b.startMinutes || b.endMinutes - a.endMinutes || a.planId.localeCompare(b.planId));
  const columns: EventSegment[][] = [];
  sorted.forEach((segment) => {
    let column = columns.findIndex((items) => !items.some((item) => overlaps(item, segment)));
    if (column === -1) { column = columns.length; columns.push([]); }
    segment.column = column;
    columns[column].push(segment);
  });
  return sorted.map((segment) => ({ ...segment, columns: Math.max(1, columns.filter((items) => items.some((item) => overlaps(item, segment))).length) }));
}
