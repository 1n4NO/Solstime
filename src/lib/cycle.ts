export type CycleEntry = {
  id: string;
  startDate: string;
  endDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type OvulationEstimate = {
  cycleEntryId: string;
  estimatedDate: string;
  windowStart: string;
  windowEnd: string;
  confidence: 'low' | 'medium' | 'high';
  disclaimer: 'estimate-only';
};

export type CycleTrackerState = {
  entries: CycleEntry[];
  estimates: OvulationEstimate[];
  remindersEnabled: boolean;
};

export type CycleMarker = { phase: 'period' | 'ovulation'; progress: number };

function isoDate(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : value;
}

export function createCycleEntry(input: Pick<CycleEntry, 'id' | 'startDate'> & Partial<Pick<CycleEntry, 'endDate' | 'note'>>, now = new Date().toISOString()): CycleEntry | null {
  const startDate = isoDate(input.startDate);
  const endDate = input.endDate ? isoDate(input.endDate) : null;
  if (!startDate || (input.endDate && !endDate) || (endDate && endDate < startDate)) return null;
  return {
    id: input.id,
    startDate,
    ...(endDate ? { endDate } : {}),
    ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    createdAt: now,
    updatedAt: now,
  };
}

export function updateCycleEntry(entry: CycleEntry, patch: Partial<Pick<CycleEntry, 'startDate' | 'endDate' | 'note'>>, now = new Date().toISOString()): CycleEntry | null {
  return createCycleEntry({ id: entry.id, startDate: patch.startDate ?? entry.startDate, endDate: patch.endDate ?? entry.endDate, note: patch.note ?? entry.note }, entry.createdAt)
    ? { ...createCycleEntry({ id: entry.id, startDate: patch.startDate ?? entry.startDate, endDate: patch.endDate ?? entry.endDate, note: patch.note ?? entry.note }, entry.createdAt)!, updatedAt: now }
    : null;
}

export function estimateOvulation(entry: CycleEntry, averageCycleDays = 28): OvulationEstimate | null {
  if (!Number.isInteger(averageCycleDays) || averageCycleDays < 18 || averageCycleDays > 45) return null;
  const start = new Date(`${entry.startDate}T00:00:00Z`);
  const estimated = new Date(start);
  estimated.setUTCDate(estimated.getUTCDate() + averageCycleDays - 14);
  const windowStart = new Date(estimated);
  const windowEnd = new Date(estimated);
  windowStart.setUTCDate(windowStart.getUTCDate() - 2);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + 2);
  return {
    cycleEntryId: entry.id,
    estimatedDate: estimated.toISOString().slice(0, 10),
    windowStart: windowStart.toISOString().slice(0, 10),
    windowEnd: windowEnd.toISOString().slice(0, 10),
    confidence: 'low',
    disclaimer: 'estimate-only',
  };
}

export function deleteCycleEntry(state: CycleTrackerState, entryId: string): CycleTrackerState {
  return {
    ...state,
    entries: state.entries.filter((entry) => entry.id !== entryId),
    estimates: state.estimates.filter((estimate) => estimate.cycleEntryId !== entryId),
  };
}

export function exportCycleData(state: CycleTrackerState): string {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...state });
}

export function clearCycleData(): CycleTrackerState {
  return { entries: [], estimates: [], remindersEnabled: false };
}

export function cycleMarkerForDate(state: CycleTrackerState, date: string): CycleMarker | null {
  const entry = state.entries.find((candidate) => candidate.startDate <= date && (!candidate.endDate || date <= candidate.endDate));
  if (entry) {
    const start = Date.parse(`${entry.startDate}T00:00:00Z`);
    const end = Date.parse(`${entry.endDate ?? entry.startDate}T00:00:00Z`);
    return { phase: 'period', progress: end === start ? 1 : Math.max(0, Math.min(1, (Date.parse(`${date}T00:00:00Z`) - start) / (end - start))) };
  }
  const estimate = state.estimates.find((candidate) => candidate.windowStart <= date && date <= candidate.windowEnd);
  if (!estimate) return null;
  const start = Date.parse(`${estimate.windowStart}T00:00:00Z`);
  const end = Date.parse(`${estimate.windowEnd}T00:00:00Z`);
  return { phase: 'ovulation', progress: Math.max(0, Math.min(1, (Date.parse(`${date}T00:00:00Z`) - start) / Math.max(1, end - start))) };
}
