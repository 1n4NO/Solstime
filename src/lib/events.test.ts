import { describe, expect, it } from 'vitest';
import { getEventSegments, layoutOverlaps } from './events';
import { TIMEZONE_OPTIONS } from './product';
import type { Plan } from './product';

const plan = (id: string, startTime: string, endTime: string, timezoneId = 'bengaluru'): Plan => ({ id, timezoneId, startTime, endTime, label: id, planType: 'meeting', repeatRule: 'none', date: '2026-08-15', hardStop: false });

describe('event segments', () => {
  it('moves later-starting overlaps inward and keeps equal-start later finishes inward', () => {
    const segments = layoutOverlaps([
      { ...getEventSegments([plan('early', '09:00', '12:00')], TIMEZONE_OPTIONS, new Date('2026-08-15T12:00:00Z'), 'Asia/Kolkata')[0] },
      { ...getEventSegments([plan('late', '10:00', '11:00')], TIMEZONE_OPTIONS, new Date('2026-08-15T12:00:00Z'), 'Asia/Kolkata')[0] },
      { ...getEventSegments([plan('same-start', '09:00', '13:00')], TIMEZONE_OPTIONS, new Date('2026-08-15T12:00:00Z'), 'Asia/Kolkata')[0] },
    ]);

    expect(segments.find((segment) => segment.planId === 'early')?.column).toBe(1);
    expect(segments.find((segment) => segment.planId === 'same-start')?.column).toBe(0);
    expect(segments.find((segment) => segment.planId === 'late')?.column).toBe(2);
  });

  it('splits overnight events while preserving their source range', () => {
    const segments = getEventSegments([plan('overnight', '22:00', '02:00')], TIMEZONE_OPTIONS, new Date('2026-08-15T12:00:00Z'), 'Asia/Kolkata');
    expect(segments).toHaveLength(1);
    expect(segments[0].startMinutes).toBe(1320);
    expect(segments[0].endMinutes).toBe(1440);
    expect(segments[0].sourceStartMinutes).toBe(1320);
    expect(segments[0].sourceEndMinutes).toBe(120);
  });

  it('projects event times from their source timezone into the active timezone', () => {
    const segments = getEventSegments([plan('london-event', '09:00', '10:00', 'london')], TIMEZONE_OPTIONS, new Date('2026-08-15T12:00:00Z'), 'Asia/Kolkata');
    expect(segments[0].startMinutes).toBe(810);
    expect(segments[0].endMinutes).toBe(870);
  });
});
