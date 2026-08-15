import type { Plan } from './product';
import { dateKey } from './time';

function dateParts(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day, weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay() || 7 };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Returns the actual day used when a recurring date falls outside a month. */
export function resolveRecurringDay(year: number, month: number, requestedDay: number): number {
  return Math.min(requestedDay, daysInMonth(year, month));
}

export function planOccursOnDate(plan: Plan, date: Date, timeZone: string): boolean {
  const localDate = dateParts(dateKey(date, timeZone));
  switch (plan.repeatRule) {
    case 'none': return plan.date === `${localDate.year}-${String(localDate.month).padStart(2, '0')}-${String(localDate.day).padStart(2, '0')}`;
    case 'daily': return true;
    case 'weekdays': return localDate.weekday <= 5;
    case 'weekends': return localDate.weekday >= 6;
    case 'weekly': return localDate.weekday === (plan.repeatDay ?? 1);
    case 'monthly': return localDate.day === resolveRecurringDay(localDate.year, localDate.month, plan.repeatDay ?? 1);
    case 'annual': return localDate.month === (plan.repeatMonth ?? 1) && localDate.day === resolveRecurringDay(localDate.year, localDate.month, plan.repeatDay ?? 1);
  }
}
