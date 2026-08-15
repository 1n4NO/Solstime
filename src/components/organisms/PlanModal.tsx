'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EMPTY_PLAN, Plan, PlanType, RepeatRule, TIMEZONE_OPTIONS, TimezoneLocation } from '../../lib/product';

type PlanDraft = Omit<Plan, 'id'>;
type PlanModalProps = { open: boolean; savedTimezones: TimezoneLocation[]; onClose: () => void; onSave: (draft: PlanDraft, timezone?: TimezoneLocation) => void };

const planTypes: Array<{ value: PlanType; label: string }> = [
  { value: 'meeting', label: 'Meeting' }, { value: 'event', label: 'Event' }, { value: 'sync-up', label: 'Sync-up' }, { value: 'stand-up', label: 'Stand-up' },
];
const repeatOptions: Array<{ value: RepeatRule; label: string }> = [
  { value: 'none', label: 'Does not repeat' }, { value: 'daily', label: 'Daily' }, { value: 'weekdays', label: 'Weekdays' }, { value: 'weekends', label: 'Weekends' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual' },
];

export function PlanModal({ open, savedTimezones, onClose, onSave }: PlanModalProps) {
  const [draft, setDraft] = useState<PlanDraft>({ ...EMPTY_PLAN, timezoneId: '' });
  const [showAddTimezone, setShowAddTimezone] = useState(false);
  const [newTimezoneId, setNewTimezoneId] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft({ ...EMPTY_PLAN, timezoneId: '' }); setShowAddTimezone(false); setNewTimezoneId(''); setCustomDate(''); setError('');
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('select')?.focus(), 0);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onClose]);

  const availableTimezones = useMemo(() => TIMEZONE_OPTIONS.filter((option) => !savedTimezones.some((saved) => saved.id === option.id)), [savedTimezones]);
  const hasEventDraft = Boolean(draft.startTime || draft.endTime || draft.label);
  const canSave = Boolean(draft.timezoneId) && (!hasEventDraft || Boolean(draft.startTime && draft.endTime && draft.label && (draft.repeatRule !== 'none' || draft.date !== 'custom' || customDate)));

  if (!open) return null;

  const update = <K extends keyof PlanDraft>(key: K, value: PlanDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const addTimezoneToDraft = () => {
    if (!newTimezoneId) return;
    update('timezoneId', newTimezoneId); setShowAddTimezone(false); setNewTimezoneId('');
  };

  const save = () => {
    if (!canSave) return;
    if (hasEventDraft) {
      if (!draft.startTime || !draft.endTime || !draft.label) return setError('Add a start time, end time, and label.');
      if (draft.startTime === draft.endTime) return setError('Start and end time cannot be the same.');
      if (draft.repeatRule === 'none' && draft.date === 'custom' && !customDate) return setError('Choose a custom date.');
    }
    const selected = TIMEZONE_OPTIONS.find((option) => option.id === draft.timezoneId);
    onSave({ ...draft, date: draft.date === 'custom' ? customDate : draft.date }, selected && !savedTimezones.some((timezone) => timezone.id === selected.id) ? selected : undefined);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="plan-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="plan-modal-title">
        <div className="modal-header"><div><p className="modal-kicker">New moment</p><h2 id="plan-modal-title">Add to your day</h2></div><button className="modal-close" type="button" onClick={onClose} aria-label="Close modal">×</button></div>

        <div className="modal-form">
          <label className="field"><span>Timezone</span><select value={draft.timezoneId} onChange={(event) => update('timezoneId', event.target.value)}><option value="">Choose a timezone</option>{savedTimezones.map((timezone) => <option key={timezone.id} value={timezone.id}>{timezone.label}</option>)}</select></label>
          <button className="add-timezone-toggle" type="button" onClick={() => setShowAddTimezone((value) => !value)}>{showAddTimezone ? '− Close timezone list' : '+ Add a timezone'}</button>
          {showAddTimezone && <div className="timezone-add-row"><select value={newTimezoneId} onChange={(event) => setNewTimezoneId(event.target.value)} aria-label="New timezone"><option value="">Choose a timezone to add</option>{availableTimezones.map((timezone) => <option key={timezone.id} value={timezone.id}>{timezone.label}</option>)}</select><button className="small-action" type="button" onClick={addTimezoneToDraft} disabled={!newTimezoneId}>Add</button></div>}

          <div className="form-divider" />
          <div className="field-row"><label className="field"><span>Start time</span><input type="time" value={draft.startTime} onChange={(event) => update('startTime', event.target.value)} /></label><label className="field"><span>End time</span><input type="time" value={draft.endTime} onChange={(event) => update('endTime', event.target.value)} /></label></div>
          <label className="field"><span>Label</span><input type="text" value={draft.label} onChange={(event) => update('label', event.target.value)} placeholder="What is this time for?" maxLength={80} /></label>

          <fieldset className="field-group"><legend>Plan type</legend><div className="type-options">{planTypes.map((type) => <label className={`type-option type-option--${type.value}`} key={type.value}><input type="radio" name="plan-type" checked={draft.planType === type.value} onChange={() => update('planType', type.value)} /><span>{type.label}</span></label>)}</div></fieldset>
          <label className="field"><span>Repeat event</span><select value={draft.repeatRule} onChange={(event) => update('repeatRule', event.target.value as RepeatRule)}>{repeatOptions.map((repeat) => <option key={repeat.value} value={repeat.value}>{repeat.label}</option>)}</select></label>
          {draft.repeatRule === 'none' && <fieldset className="field-group"><legend>Date</legend><div className="date-options"><label><input type="radio" name="one-time-date" checked={draft.date === 'today'} onChange={() => update('date', 'today')} /><span>Today</span></label><label><input type="radio" name="one-time-date" checked={draft.date === 'tomorrow'} onChange={() => update('date', 'tomorrow')} /><span>Tomorrow</span></label><label><input type="radio" name="one-time-date" checked={draft.date === 'custom'} onChange={() => update('date', 'custom')} /><span>Custom date</span></label></div>{draft.date === 'custom' && <input className="custom-date" type="date" value={customDate} onChange={(event) => setCustomDate(event.target.value)} aria-label="Custom event date" />}</fieldset>}
          <label className="toggle-row"><span><b>Hard stop</b><small>Protect this time from overrun</small></span><input type="checkbox" checked={draft.hardStop} onChange={(event) => update('hardStop', event.target.checked)} /><i /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
        <div className="modal-footer"><button className="cancel-button" type="button" onClick={onClose}>Cancel</button><button className="save-button" type="button" disabled={!canSave} onClick={save}>Save</button></div>
      </div>
    </div>
  );
}
