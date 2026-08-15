export type ManualCircadianCycle = { bedtime: string; wakeTime: string; enabled: boolean };
export type CircadianOverlay = { startMinutes: number; endMinutes: number; durationMinutes: number };
export const EMPTY_CIRCADIAN_CYCLE: ManualCircadianCycle = { bedtime: '', wakeTime: '', enabled: false };

function timeToMinutes(value: string): number | null {
  if (!/^\d{2}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(':').map(Number);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function getCircadianOverlay(cycle: ManualCircadianCycle): CircadianOverlay | null {
  if (!cycle.enabled) return null;
  const startMinutes = timeToMinutes(cycle.bedtime);
  const wakeMinutes = timeToMinutes(cycle.wakeTime);
  if (startMinutes === null || wakeMinutes === null || startMinutes === wakeMinutes) return null;
  const endMinutes = wakeMinutes > startMinutes ? wakeMinutes : wakeMinutes + 24 * 60;
  return { startMinutes, endMinutes, durationMinutes: endMinutes - startMinutes };
}

export function normalizeCircadianCycle(value: unknown): ManualCircadianCycle {
  if (!value || typeof value !== 'object') return EMPTY_CIRCADIAN_CYCLE;
  const candidate = value as Partial<ManualCircadianCycle>;
  const cycle = { bedtime: typeof candidate.bedtime === 'string' ? candidate.bedtime : '', wakeTime: typeof candidate.wakeTime === 'string' ? candidate.wakeTime : '', enabled: candidate.enabled === true };
  return getCircadianOverlay(cycle) ? cycle : EMPTY_CIRCADIAN_CYCLE;
}
