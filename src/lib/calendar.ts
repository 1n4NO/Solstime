export type CalendarProvider = 'google' | 'outlook';

export type CalendarConnectionStatus = 'connected' | 'needs-auth' | 'error' | 'disconnected';

export type CalendarConnection = {
  id: string;
  provider: CalendarProvider;
  calendarId: string;
  calendarName: string;
  status: CalendarConnectionStatus;
  color?: string;
  visible: boolean;
  lastSyncedAt?: string;
  errorCode?: 'expired-token' | 'rate-limited' | 'provider-unavailable' | 'unknown';
};

export type ExternalCalendarEvent = {
  id: string;
  connectionId: string;
  title: string;
  start: string;
  end: string;
  sourceTimezone?: string;
  location?: string;
  isAllDay: boolean;
  readOnly: true;
};

export type CalendarSyncSnapshot = {
  connections: CalendarConnection[];
  events: ExternalCalendarEvent[];
  syncedAt?: string;
  stale: boolean;
};

export type CalendarSyncResult = {
  connectionId: string;
  events: ExternalCalendarEvent[];
  status: 'ok' | 'error';
  errorCode?: CalendarConnection['errorCode'];
};

export type ProviderEventInput = {
  id: string;
  title?: string;
  start: string;
  end: string;
  sourceTimezone?: string;
  location?: string;
  isAllDay?: boolean;
};

function validDate(value: string): string | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function normalizeProviderEvent(
  input: ProviderEventInput,
  connectionId: string,
): ExternalCalendarEvent | null {
  const start = validDate(input.start);
  const end = validDate(input.end);
  if (!input.id || !start || !end || new Date(end) <= new Date(start)) return null;

  return {
    id: input.id,
    connectionId,
    title: input.title?.trim() || 'Untitled event',
    start,
    end,
    ...(input.sourceTimezone ? { sourceTimezone: input.sourceTimezone } : {}),
    ...(input.location?.trim() ? { location: input.location.trim() } : {}),
    isAllDay: input.isAllDay === true,
    readOnly: true,
  };
}

export function formatEventTime(iso: string, timeZone: string, locale = 'en-US'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function eventsForTimezone(
  events: ExternalCalendarEvent[],
  timeZone: string,
): Array<ExternalCalendarEvent & { displayStart: string; displayEnd: string }> {
  return events.map((event) => ({
    ...event,
    displayStart: formatEventTime(event.start, timeZone),
    displayEnd: formatEventTime(event.end, timeZone),
  }));
}

export function visibleEvents(snapshot: CalendarSyncSnapshot): ExternalCalendarEvent[] {
  const visibleConnections = new Set(
    snapshot.connections.filter((connection) => connection.visible && connection.status === 'connected').map((connection) => connection.id),
  );
  return snapshot.events.filter((event) => visibleConnections.has(event.connectionId));
}

export function mergeSyncResults(
  connections: CalendarConnection[],
  results: CalendarSyncResult[],
  syncedAt = new Date().toISOString(),
): CalendarSyncSnapshot {
  const events = results.flatMap((result) => result.status === 'ok' ? result.events : []);
  const hasProviderFailure = results.some((result) => result.status === 'error');
  return {
    connections: connections.map((connection) => {
      const result = results.find((candidate) => candidate.connectionId === connection.id);
      if (!result || result.status === 'ok') return { ...connection, status: 'connected', lastSyncedAt: syncedAt, errorCode: undefined };
      return { ...connection, status: 'error', errorCode: result.errorCode };
    }),
    events,
    syncedAt,
    stale: hasProviderFailure,
  };
}

export function isCalendarSnapshotStale(snapshot: CalendarSyncSnapshot, now = Date.now(), maxAgeMs = 15 * 60_000): boolean {
  if (snapshot.stale || !snapshot.syncedAt) return true;
  const syncedAt = Date.parse(snapshot.syncedAt);
  return Number.isNaN(syncedAt) || now - syncedAt > maxAgeMs;
}
