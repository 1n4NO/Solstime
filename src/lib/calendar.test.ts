import { describe, expect, it } from 'vitest';
import { eventsForTimezone, formatEventTime, isCalendarSnapshotStale, normalizeProviderEvent } from './calendar';

describe('calendar foundation', () => {
  it('normalizes provider instants and rejects malformed ranges', () => {
    const event = normalizeProviderEvent({
      id: 'evt-1',
      title: '  Focus time  ',
      start: '2026-08-15T09:00:00+05:30',
      end: '2026-08-15T10:30:00+05:30',
      isAllDay: false,
    }, 'connection-1');

    expect(event?.title).toBe('Focus time');
    expect(event?.start).toBe('2026-08-15T03:30:00.000Z');
    expect(normalizeProviderEvent({ id: 'bad', start: 'x', end: 'y' }, 'c')).toBeNull();
  });

  it('renders one instant in the active timezone', () => {
    expect(formatEventTime('2026-08-15T03:30:00.000Z', 'Asia/Kolkata')).toBe('09:00');
    expect(eventsForTimezone([{
      id: 'evt-1', connectionId: 'c', title: 'Call', start: '2026-08-15T03:30:00.000Z', end: '2026-08-15T04:30:00.000Z', isAllDay: false, readOnly: true,
    }], 'America/New_York')[0].displayStart).toBe('23:30');
  });

  it('marks missing, explicit, and old syncs as stale', () => {
    expect(isCalendarSnapshotStale({ connections: [], events: [], stale: false })).toBe(true);
    expect(isCalendarSnapshotStale({ connections: [], events: [], syncedAt: '2026-08-15T10:00:00.000Z', stale: false }, Date.parse('2026-08-15T10:10:00.000Z'))).toBe(false);
    expect(isCalendarSnapshotStale({ connections: [], events: [], syncedAt: '2026-08-15T10:00:00.000Z', stale: false }, Date.parse('2026-08-15T10:16:00.000Z'))).toBe(true);
  });
});
