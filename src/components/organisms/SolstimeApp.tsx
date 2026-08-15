'use client';

import { useEffect, useRef, useState } from 'react';
import { BrandMark } from '../atoms/BrandMark';
import { PlanModal } from './PlanModal';
import { TimeDial } from './TimeDial';
import { createInitialState, Plan, SolstimeState, THEME_OPTIONS, TimezoneLocation } from '../../lib/product';
import { loadState, saveState } from '../../lib/storage';
import { copy, localeTag, LOCALE_OPTIONS, type LocaleId } from '../../lib/i18n';

export function SolstimeApp() {
  const [state, setState] = useState<SolstimeState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [timezoneAnnouncement, setTimezoneAnnouncement] = useState('');
  const [isWidgetSurface, setIsWidgetSurface] = useState(false);
  const switchTimer = useRef<number | undefined>(undefined);

  useEffect(() => { setState(loadState()); setHydrated(true); }, []);
  useEffect(() => {
    const widget = new URLSearchParams(window.location.search).get('surface') === 'widget';
    setIsWidgetSurface(widget);
    document.body.classList.toggle('widget-surface', widget);
    return () => document.body.classList.remove('widget-surface');
  }, []);
  useEffect(() => { document.documentElement.lang = state.locale; document.documentElement.dir = state.locale === 'ar' ? 'rtl' : 'ltr'; }, [state.locale]);
  useEffect(() => { if (hydrated) setStorageError(!saveState(state)); }, [hydrated, state]);
  useEffect(() => () => { if (switchTimer.current) window.clearTimeout(switchTimer.current); }, []);

  const activeTimezone = state.timezones.find((timezone) => timezone.id === state.activeTimezoneId) ?? state.timezones[0];

  const changeTimezone = (id: string) => {
    if (id === state.activeTimezoneId) return;
    const nextTimezone = state.timezones.find((timezone) => timezone.id === id);
    if (nextTimezone) setTimezoneAnnouncement(copy(state.locale).showingTime(nextTimezone.city));
    setIsSwitching(true);
    setState((current) => ({ ...current, activeTimezoneId: id }));
    if (switchTimer.current) window.clearTimeout(switchTimer.current);
    switchTimer.current = window.setTimeout(() => setIsSwitching(false), 900);
  };

  const savePlan = (draft: Omit<Plan, 'id'>, newTimezone?: TimezoneLocation) => {
    setState((current) => {
      const timezones = newTimezone && !current.timezones.some((timezone) => timezone.id === newTimezone.id) ? [...current.timezones, newTimezone] : current.timezones;
      const hasEvent = Boolean(draft.startTime && draft.endTime && draft.label);
      const plans = hasEvent ? [...current.plans, { ...draft, id: crypto.randomUUID() }] : current.plans;
      return { ...current, timezones, plans, activeTimezoneId: hasEvent ? draft.timezoneId : current.activeTimezoneId };
    });
    setModalOpen(false);
  };

  const addTimezone = (timezone: TimezoneLocation) => {
    setState((current) => current.timezones.some((item) => item.id === timezone.id) ? current : { ...current, timezones: [...current.timezones, timezone] });
  };

  const renameTimezone = (id: string, label: string) => {
    setState((current) => ({ ...current, timezones: current.timezones.map((timezone) => timezone.id === id ? { ...timezone, label: label || timezone.label } : timezone) }));
  };

  const removeTimezone = (id: string) => {
    setState((current) => {
      const timezone = current.timezones.find((item) => item.id === id);
      if (!timezone || timezone.isDefault || current.timezones.length === 1) return current;
      const timezones = current.timezones.filter((item) => item.id !== id);
      return { ...current, timezones, activeTimezoneId: current.activeTimezoneId === id ? timezones[0].id : current.activeTimezoneId };
    });
  };

  const changeTheme = (themeId: SolstimeState['themeId']) => {
    setState((current) => ({ ...current, themeId }));
  };

  const changeLocale = (locale: LocaleId) => setState((current) => ({ ...current, locale }));

  if (!activeTimezone) return null;

  const freeThemes = THEME_OPTIONS.filter((theme) => theme.tier === 'free');
  const proThemes = THEME_OPTIONS.filter((theme) => theme.tier === 'pro');
  // Preview mode stays enabled while the theme system is being reviewed.
  // Entitlement gating is applied in the final release step (ST-206).
  const themePreviewMode = true;
  const languageCopy = copy(state.locale);

  return (
    <main className={`app-shell${isWidgetSurface ? ' app-shell--widget' : ''}`} data-theme={state.themeId}>
      <header className="topbar">
        <a className="wordmark" href="#" aria-label="Solstime home"><BrandMark /><span>solstime</span></a>
        <label className="theme-picker">
          <span>{languageCopy.theme}</span>
          <select value={state.themeId} onChange={(event) => changeTheme(event.target.value as SolstimeState['themeId'])} aria-label={languageCopy.chooseTheme}>
            <optgroup label={languageCopy.free}>
              {freeThemes.map((theme) => <option key={theme.id} value={theme.id}>{theme.label}</option>)}
            </optgroup>
            <optgroup label={languageCopy.pro}>
              {proThemes.map((theme) => <option key={theme.id} value={theme.id} disabled={!themePreviewMode}>{theme.label} · Pro</option>)}
            </optgroup>
          </select>
        </label>
        <label className="theme-picker">
          <span>{languageCopy.language}</span>
          <select value={state.locale} onChange={(event) => changeLocale(event.target.value as LocaleId)} aria-label={languageCopy.language}>
            {LOCALE_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </label>
      </header>
      <TimeDial timezone={activeTimezone} timezones={state.timezones} plans={state.plans} cycle={state.cycle} circadian={state.circadian} locale={state.locale} isSwitching={isSwitching} onTimezoneChange={changeTimezone} onAdd={() => setModalOpen(true)} />
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">{timezoneAnnouncement}</div>
      {storageError && <div className="storage-notice" role="status">Changes could not be saved on this device.</div>}
      <PlanModal open={modalOpen} savedTimezones={state.timezones} activeTimezoneId={state.activeTimezoneId} locale={state.locale} themeId={state.themeId} cycle={state.cycle} circadian={state.circadian} isWidgetSurface={isWidgetSurface} onLocaleChange={changeLocale} onThemeChange={changeTheme} onCycleChange={(cycle) => setState((current) => ({ ...current, cycle }))} onCircadianChange={(circadian) => setState((current) => ({ ...current, circadian }))} onClose={() => setModalOpen(false)} onSave={savePlan} onAddTimezone={addTimezone} onRenameTimezone={renameTimezone} onRemoveTimezone={removeTimezone} />
    </main>
  );
}
