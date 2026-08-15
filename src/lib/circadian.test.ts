import { describe, expect, it } from 'vitest';
import { EMPTY_CIRCADIAN_CYCLE, getCircadianOverlay, normalizeCircadianCycle } from './circadian';

describe('manual circadian overlay', () => {
  it('plots a sleep window across midnight', () => {
    expect(getCircadianOverlay({ bedtime: '22:30', wakeTime: '06:30', enabled: true })).toEqual({ startMinutes: 1350, endMinutes: 1830, durationMinutes: 480 });
  });
  it('rejects incomplete or identical times', () => {
    expect(getCircadianOverlay({ bedtime: '', wakeTime: '06:30', enabled: true })).toBeNull();
    expect(getCircadianOverlay({ bedtime: '06:30', wakeTime: '06:30', enabled: true })).toBeNull();
    expect(normalizeCircadianCycle({ bedtime: '25:00', wakeTime: '06:30', enabled: true })).toEqual(EMPTY_CIRCADIAN_CYCLE);
  });
});
