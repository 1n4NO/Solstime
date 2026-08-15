'use client';

import { useEffect, useRef, useState } from 'react';
import { AddButton } from '../atoms/AddButton';
import { BrandMark } from '../atoms/BrandMark';
import { PlanModal } from './PlanModal';
import { TimeDial } from './TimeDial';
import { createInitialState, Plan, SolsticeState, TimezoneLocation } from '../../lib/product';
import { loadState, saveState } from '../../lib/storage';

export function SolsticeApp() {
  const [state, setState] = useState<SolsticeState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const switchTimer = useRef<number | undefined>(undefined);

  useEffect(() => { setState(loadState()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveState(state); }, [hydrated, state]);
  useEffect(() => () => { if (switchTimer.current) window.clearTimeout(switchTimer.current); }, []);

  const activeTimezone = state.timezones.find((timezone) => timezone.id === state.activeTimezoneId) ?? state.timezones[0];

  const changeTimezone = (id: string) => {
    if (id === state.activeTimezoneId) return;
    setIsSwitching(true);
    setState((current) => ({ ...current, activeTimezoneId: id }));
    if (switchTimer.current) window.clearTimeout(switchTimer.current);
    switchTimer.current = window.setTimeout(() => setIsSwitching(false), 900);
  };

  const savePlan = (draft: Omit<Plan, 'id'>, newTimezone?: TimezoneLocation) => {
    setState((current) => {
      const timezones = newTimezone && !current.timezones.some((timezone) => timezone.id === newTimezone.id) ? [...current.timezones, newTimezone] : current.timezones;
      const plans = draft.startTime && draft.endTime && draft.label ? [...current.plans, { ...draft, id: crypto.randomUUID() }] : current.plans;
      return { ...current, timezones, plans, activeTimezoneId: current.activeTimezoneId || draft.timezoneId };
    });
    setModalOpen(false);
  };

  if (!activeTimezone) return null;

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#" aria-label="Solstice home"><BrandMark /><span>solstice</span></a>
      </header>
      <TimeDial timezone={activeTimezone} timezones={state.timezones} isSwitching={isSwitching} onTimezoneChange={changeTimezone} />
      <AddButton onClick={() => setModalOpen(true)} />
      <PlanModal open={modalOpen} savedTimezones={state.timezones} onClose={() => setModalOpen(false)} onSave={savePlan} />
    </main>
  );
}
