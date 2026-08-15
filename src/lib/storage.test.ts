import { describe, expect, it } from 'vitest';
import { DEFAULT_TIMEZONE_ID } from './product';
import { normalizeState } from './storage';

describe('normalizeState', () => {
  it('recovers defaults from malformed storage', () => {
    const state = normalizeState({ timezones: [{ id: 'broken', timeZone: 'UTC' }, null], activeTimezoneId: 'broken', plans: [{ id: 'bad' }] });

    expect(state.activeTimezoneId).toBe(DEFAULT_TIMEZONE_ID);
    expect(state.timezones).toHaveLength(1);
    expect(state.plans).toEqual([]);
  });

  it('drops plans that point to missing timezones and defaults invalid fields', () => {
    const state = normalizeState({
      timezones: [{ id: 'london', label: ' London ', city: 'London', timeZone: 'Europe/London', latitude: 51.5, longitude: -0.1 }],
      activeTimezoneId: 'london',
      plans: [
        { id: 'valid', timezoneId: 'london', startTime: '09:00', endTime: '10:00', label: 'Focus', planType: 'unknown', repeatRule: 'unknown', hardStop: 1 },
        { id: 'orphan', timezoneId: 'missing', startTime: '09:00', endTime: '10:00', label: 'Orphan' },
      ],
    });

    expect(state.timezones[0].label).toBe('London');
    expect(state.plans).toEqual([{ id: 'valid', timezoneId: 'london', startTime: '09:00', endTime: '10:00', label: 'Focus', planType: 'meeting', repeatRule: 'none', hardStop: false }]);
  });
});
