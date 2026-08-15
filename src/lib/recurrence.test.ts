import { describe, expect, it } from 'vitest';
import { planOccursOnDate, resolveRecurringDay } from './recurrence';
import type { Plan } from './product';

const basePlan: Plan = { id: 'test', timezoneId: 'bengaluru', startTime: '09:00', endTime: '10:00', label: 'Test', planType: 'meeting', repeatRule: 'monthly', repeatDay: 31, hardStop: false };

describe('recurrence rules', () => {
  it('falls back to the last day of shorter months', () => {
    expect(resolveRecurringDay(2026, 2, 31)).toBe(28);
    expect(resolveRecurringDay(2028, 2, 31)).toBe(29);
  });

  it('matches monthly plans on the fallback date', () => {
    expect(planOccursOnDate(basePlan, new Date('2026-02-28T12:00:00Z'), 'Asia/Kolkata')).toBe(true);
    expect(planOccursOnDate(basePlan, new Date('2026-02-27T12:00:00Z'), 'Asia/Kolkata')).toBe(false);
  });
});
