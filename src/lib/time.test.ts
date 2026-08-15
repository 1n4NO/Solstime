import { describe, expect, it } from 'vitest';
import { dateKey, getSolarTimes } from './time';

describe('time calculations', () => {
  it('uses the selected timezone calendar when resolving tomorrow', () => {
    const date = new Date('2026-08-15T23:30:00.000Z');
    expect(dateKey(date, 'Asia/Kolkata')).toBe('2026-08-16');
    expect(dateKey(date, 'Asia/Kolkata', 1)).toBe('2026-08-17');
  });

  it('returns ordered solar times for Bengaluru', () => {
    const solar = getSolarTimes(new Date('2026-08-15T12:00:00.000Z'), { latitude: 12.9716, longitude: 77.5946 }, 'Asia/Kolkata');
    expect(solar.sunrise).toBeGreaterThan(4);
    expect(solar.sunrise).toBeLessThan(8);
    expect(solar.sunset).toBeGreaterThan(17);
    expect(solar.sunset).toBeLessThan(20);
  });
});
