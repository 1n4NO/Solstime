import { createInitialState, DEFAULT_TIMEZONE_ID, SolsticeState, TIMEZONE_OPTIONS } from './product';

const STORAGE_KEY = 'solstice.state.v1';

export function loadState(): SolsticeState {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return createInitialState();
    const parsed = JSON.parse(stored) as Partial<SolsticeState>;
    const defaults = createInitialState();
    const timezones = Array.isArray(parsed.timezones) ? parsed.timezones.filter((timezone) => timezone && typeof timezone.id === 'string' && typeof timezone.timeZone === 'string') : defaults.timezones;
    const uniqueTimezones = timezones.filter((timezone, index, all) => all.findIndex((candidate) => candidate.id === timezone.id) === index);
    const safeTimezones = uniqueTimezones.length ? uniqueTimezones : defaults.timezones;
    const activeTimezoneId = safeTimezones.some((timezone) => timezone.id === parsed.activeTimezoneId) ? parsed.activeTimezoneId as string : safeTimezones.find((timezone) => timezone.id === DEFAULT_TIMEZONE_ID)?.id ?? safeTimezones[0].id;
    const plans = Array.isArray(parsed.plans) ? parsed.plans.filter((plan) => plan && typeof plan.id === 'string' && typeof plan.timezoneId === 'string' && typeof plan.startTime === 'string' && typeof plan.endTime === 'string') : [];
    return { version: 1, timezones: safeTimezones.length ? safeTimezones : TIMEZONE_OPTIONS.slice(0, 1), activeTimezoneId, plans };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: SolsticeState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
