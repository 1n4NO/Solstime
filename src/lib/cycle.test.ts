import { describe, expect, it } from 'vitest';
import { clearCycleData, createCycleEntry, deleteCycleEntry, estimateOvulation, exportCycleData, updateCycleEntry } from './cycle';

describe('private cycle tracking foundation', () => {
  it('creates and edits valid entries while rejecting impossible ranges', () => {
    const entry = createCycleEntry({ id: 'cycle-1', startDate: '2026-08-01', endDate: '2026-08-05', note: '  note  ' }, '2026-08-15T00:00:00.000Z');
    expect(entry?.note).toBe('note');
    expect(createCycleEntry({ id: 'bad', startDate: '2026-08-05', endDate: '2026-08-01' })).toBeNull();
    expect(updateCycleEntry(entry!, { endDate: '2026-08-06' })?.endDate).toBe('2026-08-06');
  });

  it('returns a clearly labeled low-confidence estimate', () => {
    const entry = createCycleEntry({ id: 'cycle-1', startDate: '2026-08-01' })!;
    const estimate = estimateOvulation(entry);
    expect(estimate?.estimatedDate).toBe('2026-08-15');
    expect(estimate?.disclaimer).toBe('estimate-only');
    expect(estimateOvulation(entry, 10)).toBeNull();
  });

  it('removes linked estimates and supports export/delete', () => {
    const state = { entries: [createCycleEntry({ id: 'cycle-1', startDate: '2026-08-01' })!], estimates: [{ cycleEntryId: 'cycle-1', estimatedDate: '2026-08-15', windowStart: '2026-08-13', windowEnd: '2026-08-17', confidence: 'low' as const, disclaimer: 'estimate-only' as const }], remindersEnabled: true };
    expect(JSON.parse(exportCycleData(state)).version).toBe(1);
    expect(deleteCycleEntry(state, 'cycle-1').entries).toHaveLength(0);
    expect(clearCycleData()).toEqual({ entries: [], estimates: [], remindersEnabled: false });
  });
});
