export type PlanType = 'meeting' | 'event' | 'sync-up' | 'stand-up';
export type RepeatRule = 'none' | 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly' | 'annual';
export type OneTimeDate = 'today' | 'tomorrow' | 'custom';
export type ThemeTier = 'free' | 'pro';
import type { LocaleId } from './i18n';
export type AccountTier = 'free' | 'pro' | 'super-pro';

export type TierOption = { id: AccountTier; label: string; price: number; description: string };

export const TIER_OPTIONS: TierOption[] = [
  { id: 'free', label: 'Free', price: 0, description: 'The essential day dial and orientation tools' },
  { id: 'pro', label: 'Pro', price: 9.99, description: 'Your day across every surface' },
  { id: 'super-pro', label: 'Super Pro', price: 24.99, description: 'Shared planning, habits, and deeper reflection' },
];

export const TIER_FEATURES: Record<AccountTier, readonly string[]> = {
  free: ['web-dial', 'free-themes', 'moon-phase', 'weather', 'uv-index', 'mac-widget', 'chrome-extensions', 'one-calendar'],
  pro: ['web-dial', 'free-themes', 'pro-themes', 'moon-phase', 'weather', 'uv-index', 'mac-widget', 'chrome-extensions', 'multiple-calendars', 'iphone-app', 'iphone-widget', 'apple-watch', 'circadian-sync', 'cross-surface-sync', 'period-ovulation'],
  'super-pro': ['web-dial', 'free-themes', 'pro-themes', 'moon-phase', 'weather', 'uv-index', 'mac-widget', 'chrome-extensions', 'multiple-calendars', 'iphone-app', 'iphone-widget', 'apple-watch', 'circadian-sync', 'cross-surface-sync', 'period-ovulation', 'family-sharing-3', 'custom-watch-face', 'alarms-notifications', 'dashboard', 'habit-tracker', 'professional-insights', 'journal-prompts'],
};
export type ThemeId = 'amber' | 'mist' | 'moss' | 'slate' | 'aqua' | 'rosewood' | 'paper' | 'violet' | 'ocean' | 'clay' | 'graphite' | 'seafoam' | 'dusk' | 'touch-grass';

export type ThemeOption = { id: ThemeId; label: string; description: string; tier: ThemeTier };

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'amber', label: 'Amber', description: 'Warm light on deep green', tier: 'free' },
  { id: 'mist', label: 'Mist', description: 'Cool grey with soft blue', tier: 'free' },
  { id: 'moss', label: 'Moss', description: 'Quiet green with pale gold', tier: 'free' },
  { id: 'slate', label: 'Slate', description: 'Blue-grey and mineral', tier: 'pro' },
  { id: 'aqua', label: 'Aqua', description: 'Clear water and cool stone', tier: 'pro' },
  { id: 'rosewood', label: 'Rosewood', description: 'Dusty rose and dark wood', tier: 'pro' },
  { id: 'paper', label: 'Paper', description: 'Warm paper and graphite', tier: 'pro' },
  { id: 'violet', label: 'Violet', description: 'Deep violet and lavender', tier: 'pro' },
  { id: 'ocean', label: 'Ocean', description: 'Deep blue and sea glass', tier: 'pro' },
  { id: 'clay', label: 'Clay', description: 'Terracotta and sage', tier: 'pro' },
  { id: 'graphite', label: 'Graphite', description: 'Charcoal and silver', tier: 'pro' },
  { id: 'seafoam', label: 'Seafoam', description: 'Soft green and blue', tier: 'pro' },
  { id: 'dusk', label: 'Dusk', description: 'Indigo and quiet lilac', tier: 'pro' },
  { id: 'touch-grass', label: 'Touch Grass', description: 'Living grass texture and moss', tier: 'pro' },
];

export type TimezoneLocation = {
  id: string;
  label: string;
  city: string;
  timeZone: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
};

export type Plan = {
  id: string;
  timezoneId: string;
  startTime: string;
  endTime: string;
  label: string;
  planType: PlanType;
  repeatRule: RepeatRule;
  date?: string;
  repeatDay?: number;
  repeatMonth?: number;
  hardStop: boolean;
};

export type SolstimeState = {
  version: 1;
  themeId: ThemeId;
  locale: LocaleId;
  timezones: TimezoneLocation[];
  activeTimezoneId: string;
  plans: Plan[];
};

export const DEFAULT_TIMEZONE_ID = 'bengaluru';

export const TIMEZONE_OPTIONS: TimezoneLocation[] = [
  { id: 'bengaluru', label: 'Bengaluru, India', city: 'Bengaluru', timeZone: 'Asia/Kolkata', latitude: 12.9716, longitude: 77.5946, isDefault: true },
  { id: 'london', label: 'London, United Kingdom', city: 'London', timeZone: 'Europe/London', latitude: 51.5072, longitude: -0.1276 },
  { id: 'new-york', label: 'New York, United States', city: 'New York', timeZone: 'America/New_York', latitude: 40.7128, longitude: -74.0060 },
  { id: 'los-angeles', label: 'Los Angeles, United States', city: 'Los Angeles', timeZone: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437 },
  { id: 'dubai', label: 'Dubai, United Arab Emirates', city: 'Dubai', timeZone: 'Asia/Dubai', latitude: 25.2048, longitude: 55.2708 },
  { id: 'tokyo', label: 'Tokyo, Japan', city: 'Tokyo', timeZone: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { id: 'sydney', label: 'Sydney, Australia', city: 'Sydney', timeZone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093 },
  { id: 'utc', label: 'UTC', city: 'UTC', timeZone: 'UTC', latitude: 0, longitude: 0 },
];

export const PLAN_TYPE_COLORS: Record<PlanType, string> = {
  meeting: 'var(--event-meeting)',
  event: 'var(--event-event)',
  'sync-up': 'var(--event-sync)',
  'stand-up': 'var(--event-standup)',
};

export const EMPTY_PLAN: Omit<Plan, 'id'> = {
  timezoneId: DEFAULT_TIMEZONE_ID,
  startTime: '',
  endTime: '',
  label: '',
  planType: 'meeting',
  repeatRule: 'none',
  date: 'today',
  repeatDay: 1,
  repeatMonth: 1,
  hardStop: false,
};

export function createInitialState(): SolstimeState {
  return { version: 1, themeId: 'amber', locale: 'en', timezones: [TIMEZONE_OPTIONS[0]], activeTimezoneId: DEFAULT_TIMEZONE_ID, plans: [] };
}
