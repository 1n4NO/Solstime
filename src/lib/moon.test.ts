import { describe, expect, it } from 'vitest';
import { getMoonPhase } from './moon';

describe('getMoonPhase', () => {
  it('identifies the August 28, 2026 full moon', () => {
    const phase = getMoonPhase(new Date('2026-08-28T12:00:00.000Z'));

    expect(phase.name).toBe('Full moon');
    expect(phase.illumination).toBeGreaterThan(0.96);
  });

  it('keeps the cycle moving through full moon into waning phases', () => {
    const beforeFull = getMoonPhase(new Date('2026-08-27T12:00:00.000Z'));
    const full = getMoonPhase(new Date('2026-08-28T12:00:00.000Z'));
    const afterFull = getMoonPhase(new Date('2026-08-29T12:00:00.000Z'));

    expect(beforeFull.illumination).toBeLessThan(full.illumination);
    expect(afterFull.illumination).toBeLessThan(full.illumination);
    expect(afterFull.name).toBe('Waning gibbous');
  });
});
