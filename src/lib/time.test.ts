import { describe, expect, it } from 'vitest';
import { dateKey, formatDateLabel, getSolarTimes, localTimeStatus, shiftDateKey } from './time';

describe('time calculations', () => {
  it('uses the selected timezone calendar when resolving tomorrow', () => {
    const date = new Date('2026-08-15T23:30:00.000Z');
    expect(dateKey(date, 'Asia/Kolkata')).toBe('2026-08-16');
    expect(dateKey(date, 'Asia/Kolkata', 1)).toBe('2026-08-17');
  });

  it('formats the local date label for the central dial', () => {
    expect(formatDateLabel(new Date('2026-08-15T18:30:00.000Z'), 'Asia/Kolkata')).toBe('Aug 16, SUN');
    expect(shiftDateKey('2026-08-31', 1)).toBe('2026-09-01');
    expect(shiftDateKey('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('returns ordered solar times for Bengaluru', () => {
    const solar = getSolarTimes(new Date('2026-08-15T12:00:00.000Z'), { latitude: 12.9716, longitude: 77.5946 }, 'Asia/Kolkata');
    expect(solar.sunrise).toBeGreaterThan(4);
    expect(solar.sunrise).toBeLessThan(8);
    expect(solar.sunset).toBeGreaterThan(17);
    expect(solar.sunset).toBeLessThan(20);
    expect(solar.status).toBe('normal');
  });

  it('identifies polar conditions without inventing solar markers', () => {
    const solar = getSolarTimes(new Date('2026-06-21T12:00:00.000Z'), { latitude: 78.2232, longitude: 15.6469 }, 'Arctic/Longyearbyen');
    expect(solar.status).toBe('polar-day');
    expect(solar.sunriseAvailable).toBe(false);
    expect(solar.sunsetAvailable).toBe(false);
  });

  it('detects daylight-saving gaps and ambiguous fall-back times', () => {
    expect(localTimeStatus('2026-03-08', '02:30', 'America/New_York')).toBe('nonexistent');
    expect(localTimeStatus('2026-11-01', '01:30', 'America/New_York')).toBe('ambiguous');
    expect(localTimeStatus('2026-08-15', '', 'Asia/Kolkata')).toBe('nonexistent');
  });
});
