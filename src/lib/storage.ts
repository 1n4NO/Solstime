import { createInitialState, SolsticeState } from './product';

const STORAGE_KEY = 'solstice.state.v1';

export function loadState(): SolsticeState {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return createInitialState();
    const parsed = JSON.parse(stored) as SolsticeState;
    if (parsed.version !== 1 || !Array.isArray(parsed.timezones) || !Array.isArray(parsed.plans)) return createInitialState();
    return parsed;
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
