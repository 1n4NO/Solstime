import { createInitialState, DEFAULT_TIMEZONE_ID, Plan, PlanType, RepeatRule, SolstimeState, ThemeId, THEME_OPTIONS, TimezoneLocation } from './product';
import { LOCALE_OPTIONS, type LocaleId } from './i18n';

const STORAGE_KEY = 'solstime.state.v1';
const LEGACY_STORAGE_KEY = ['sol', 'stice'].join('') + '.state.v1';

// Theme IDs are UI vocabulary, not a persisted entitlement. Storage uses opaque
// tokens so changing a readable value cannot activate a different theme.
const THEME_STORAGE_TOKENS: Record<ThemeId, string> = {
  amber: 'th_7f2a', mist: 'th_91c4', moss: 'th_2db8', slate: 'th_64e1', aqua: 'th_8a3d',
  rosewood: 'th_5c9b', paper: 'th_0e76', violet: 'th_3a4f', ocean: 'th_b281', clay: 'th_6d0a',
  graphite: 'th_4e92', seafoam: 'th_aa17', dusk: 'th_c63e', 'touch-grass': 'th_f08b',
};
const THEME_IDS_BY_TOKEN = Object.fromEntries(Object.entries(THEME_STORAGE_TOKENS).map(([id, token]) => [token, id])) as Record<string, ThemeId>;

function encodeThemeId(themeId: ThemeId): string {
  return THEME_STORAGE_TOKENS[themeId];
}

function decodeThemeId(value: unknown): ThemeId | null {
  if (typeof value !== 'string') return null;
  const decoded = THEME_IDS_BY_TOKEN[value] ?? value;
  return THEME_OPTIONS.some((theme) => theme.id === decoded) ? decoded as ThemeId : null;
}

function serializeState(state: SolstimeState): string {
  return JSON.stringify({ ...state, themeId: encodeThemeId(state.themeId) });
}

const planTypes: PlanType[] = ['meeting', 'event', 'sync-up', 'stand-up'];
const repeatRules: RepeatRule[] = ['none', 'daily', 'weekdays', 'weekends', 'weekly', 'monthly', 'annual'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function normalizeTimezone(value: unknown): TimezoneLocation | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.timeZone !== 'string' || typeof value.label !== 'string' || typeof value.city !== 'string') return null;
  if (!Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) return null;
  const latitude = value.latitude as number;
  const longitude = value.longitude as number;
  return { id: value.id, label: value.label.trim() || value.city, city: value.city, timeZone: value.timeZone, latitude, longitude, ...(value.isDefault === true ? { isDefault: true } : {}) };
}

function normalizePlan(value: unknown, timezoneIds: Set<string>): Plan | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.timezoneId !== 'string' || !timezoneIds.has(value.timezoneId) || typeof value.startTime !== 'string' || typeof value.endTime !== 'string' || typeof value.label !== 'string') return null;
  const planType = planTypes.includes(value.planType as PlanType) ? value.planType as PlanType : 'meeting';
  const repeatRule = repeatRules.includes(value.repeatRule as RepeatRule) ? value.repeatRule as RepeatRule : 'none';
  return { id: value.id, timezoneId: value.timezoneId, startTime: value.startTime, endTime: value.endTime, label: value.label, planType, repeatRule, ...(typeof value.date === 'string' ? { date: value.date } : {}), ...(typeof value.repeatDay === 'number' ? { repeatDay: value.repeatDay } : {}), ...(typeof value.repeatMonth === 'number' ? { repeatMonth: value.repeatMonth } : {}), hardStop: value.hardStop === true };
}

export function normalizeState(value: unknown): SolstimeState {
  const defaults = createInitialState();
  if (!isRecord(value)) return defaults;
  const timezones = Array.isArray(value.timezones) ? value.timezones.map(normalizeTimezone).filter((timezone): timezone is TimezoneLocation => Boolean(timezone)) : [];
  const uniqueTimezones = timezones.filter((timezone, index, all) => all.findIndex((candidate) => candidate.id === timezone.id) === index);
  const safeTimezones = uniqueTimezones.length ? uniqueTimezones : defaults.timezones;
  const activeTimezoneId = safeTimezones.some((timezone) => timezone.id === value.activeTimezoneId) ? value.activeTimezoneId as string : safeTimezones.find((timezone) => timezone.id === DEFAULT_TIMEZONE_ID)?.id ?? safeTimezones[0].id;
  const timezoneIds = new Set(safeTimezones.map((timezone) => timezone.id));
  const plans = Array.isArray(value.plans) ? value.plans.map((plan) => normalizePlan(plan, timezoneIds)).filter((plan): plan is Plan => Boolean(plan)) : [];
  const themeId = decodeThemeId(value.themeId) ?? defaults.themeId;
  const locale = LOCALE_OPTIONS.some((option) => option.id === value.locale) ? value.locale as LocaleId : defaults.locale;
  return { version: 1, themeId, locale, timezones: safeTimezones, activeTimezoneId, plans };
}

export function loadState(): SolstimeState {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) return createInitialState();
    const normalized = normalizeState(JSON.parse(stored) as unknown);
    // Rewrite on every successful load so readable legacy theme IDs are migrated
    // to opaque tokens immediately.
    window.localStorage.setItem(STORAGE_KEY, serializeState(normalized));
    return normalized;
  } catch {
    return createInitialState();
  }
}

export function saveState(state: SolstimeState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeState(state));
    return true;
  } catch {
    return false;
  }
}
