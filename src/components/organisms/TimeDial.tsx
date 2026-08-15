'use client';

import { useEffect, useMemo, useState } from 'react';
import { dateKey, dialAngle, dialGradientAngle, formatDateLabel, formatSolarTime, formatTime, getSolarTimes, localHour, shiftDateKey } from '../../lib/time';
import type { Plan, TimezoneLocation } from '../../lib/product';
import { getEventSegments, type EventSegment } from '../../lib/events';
import { DialTick } from '../atoms/DialTick';
import { DialCore } from '../molecules/DialCore';
import { EventArcLayer } from '../molecules/EventArcLayer';
import { getMoonPhase } from '../../lib/moon';
import { fetchUvReadings, type UvReading } from '../../lib/uv';
import { UvArc } from '../molecules/UvArc';
import { fetchWeatherReadings } from '../../lib/weather';
import type { WeatherReading } from '../../lib/weather';
import { WeatherLayer } from '../molecules/WeatherLayer';
import { NoonMidnightMark } from '../atoms/NoonMidnightMark';
import { copy, localeTag, type LocaleId } from '../../lib/i18n';
import type { CycleTrackerState } from '../../lib/cycle';
import { cycleMarkerForDate } from '../../lib/cycle';
import type { ManualCircadianCycle } from '../../lib/circadian';
import { getCircadianOverlay } from '../../lib/circadian';

type TimeDialProps = { timezone: TimezoneLocation; timezones: TimezoneLocation[]; plans: Plan[]; cycle: CycleTrackerState; circadian: ManualCircadianCycle; locale: LocaleId; isSwitching: boolean; onTimezoneChange: (id: string) => void; onAdd: () => void };

export function TimeDial({ timezone, timezones, plans, cycle, circadian, locale, isSwitching, onTimezoneChange, onAdd }: TimeDialProps) {
  const [now, setNow] = useState(() => new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [viewDate, setViewDate] = useState(() => dateKey(new Date(), timezone.timeZone));
  const [uvReadings, setUvReadings] = useState<UvReading[]>([]);
  const [weatherReadings, setWeatherReadings] = useState<WeatherReading[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventSegment | null>(null);
  const ticks = useMemo(() => Array.from({ length: 48 }, (_, index) => index), []);
  const viewDateObject = useMemo(() => new Date(`${viewDate}T12:00:00.000Z`), [viewDate]);
  const currentHour = localHour(now, timezone.timeZone);
  const solarTimes = getSolarTimes(viewDateObject, timezone, timezone.timeZone);
  const moonPhase = getMoonPhase(viewDateObject);
  const cycleMarker = cycleMarkerForDate(cycle, viewDate);
  const circadianOverlay = getCircadianOverlay(circadian);
  const circadianStyle = circadianOverlay ? { '--circadian-start': `${dialGradientAngle(circadianOverlay.startMinutes / 60)}deg`, '--circadian-duration': `${circadianOverlay.durationMinutes / 4}deg` } as React.CSSProperties : undefined;
  const eventSegments = useMemo(() => getEventSegments(plans, timezones, viewDateObject, timezone.timeZone), [plans, timezones, viewDateObject, timezone.timeZone]);
  const currentMinutes = Math.round(currentHour * 60);
  const currentUv = nearestReading(uvReadings, currentMinutes);
  const currentWeather = nearestReading(weatherReadings, currentMinutes);
  const text = copy(locale);
  const sunriseAngle = solarTimes.status === 'polar-day' ? 0 : solarTimes.status === 'polar-night' ? 360 : dialGradientAngle(solarTimes.sunrise);
  const sunsetAngle = solarTimes.status === 'polar-day' ? 360 : solarTimes.status === 'polar-night' ? 0 : dialGradientAngle(solarTimes.sunset);
  const dialStyle = {
    '--sunrise-angle': `${sunriseAngle}deg`,
    '--sunset-angle': `${sunsetAngle}deg`,
  } as React.CSSProperties;

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);
  useEffect(() => {
    setViewDate(dateKey(new Date(), timezone.timeZone));
    setActiveEvent(null);
  }, [timezone.id, timezone.timeZone]);
  useEffect(() => {
    const controller = new AbortController();
    setUvReadings([]);
    fetchUvReadings(timezone.latitude, timezone.longitude, viewDate, timezone.timeZone, controller.signal)
      .then(setUvReadings)
      .catch((error: unknown) => {
        if ((error as Error).name !== 'AbortError') setUvReadings([]);
      });
    return () => controller.abort();
  }, [timezone.latitude, timezone.longitude, timezone.timeZone, viewDate]);
  useEffect(() => {
    const controller = new AbortController();
    setWeatherReadings([]);
    fetchWeatherReadings(timezone.latitude, timezone.longitude, viewDate, timezone.timeZone, controller.signal)
      .then(setWeatherReadings)
      .catch((error: unknown) => { if ((error as Error).name !== 'AbortError') setWeatherReadings([]); });
    return () => controller.abort();
  }, [timezone.latitude, timezone.longitude, timezone.timeZone, viewDate]);
  useEffect(() => setActiveEvent(null), [isSwitching]);

  return (
    <section className="dial-stage" aria-label="Solstime 24 hour planner">
      <div className="dial-wrap">
        <div className="dial-shadow" />
        <div className={`dial dial--${solarTimes.status}`} style={dialStyle} role="img" aria-label={solarTimes.status === 'normal' ? `24 hour dial showing daylight from ${formatSolarTime(solarTimes.sunrise)} to ${formatSolarTime(solarTimes.sunset)}` : `24 hour dial showing ${solarTimes.status === 'polar-day' ? 'continuous daylight' : 'continuous night'}`}>
          <div className={`dial-transition-layer${isSwitching ? ' dial-transition-layer--switching' : ''}`}>
            <div className="night-arc" />
            <div className="daylight-arc" />
          </div>
          {solarTimes.status === 'normal' && <div className={`uv-rotating-layer${isSwitching ? ' uv-rotating-layer--switching' : ''}`}><UvArc readings={uvReadings} sunrise={solarTimes.sunrise * 60} sunset={solarTimes.sunset * 60} locale={locale} /></div>}
          {weatherReadings.length > 0 && <div className={`weather-rotating-layer${isSwitching ? ' weather-rotating-layer--switching' : ''}`}><WeatherLayer readings={weatherReadings} /></div>}
          {circadianOverlay && <div className="circadian-overlay" style={circadianStyle} aria-label="Manual circadian cycle overlay" />}
          <div className="dial-foreground-layer">
            {solarTimes.sunriseAvailable && <button className="solar-line solar-line--sunrise" style={{ transform: `rotate(${dialAngle(solarTimes.sunrise)}deg)` }} aria-label={`${text.sunrise} ${formatSolarTime(solarTimes.sunrise)}`}><span className="solar-tooltip">{text.sunrise} <b>{formatSolarTime(solarTimes.sunrise)}</b></span></button>}
            {solarTimes.sunsetAvailable && <button className="solar-line solar-line--sunset" style={{ transform: `rotate(${dialAngle(solarTimes.sunset)}deg)` }} aria-label={`${text.sunset} ${formatSolarTime(solarTimes.sunset)}`}><span className="solar-tooltip">{text.sunset} <b>{formatSolarTime(solarTimes.sunset)}</b></span></button>}
            <div className="now-line" style={{ transform: `rotate(${dialAngle(currentHour)}deg)` }} aria-label={`Current time ${formatTime(now, timezone.timeZone, !is24Hour, localeTag(locale))}`}>
              <span />
              <span className="now-tooltip" role="status">
                <b>{formatTime(now, timezone.timeZone, !is24Hour, localeTag(locale))}</b>
                {currentUv && <span>UV {currentUv.value.toFixed(1)}</span>}
                {currentWeather && <span>{text.temperature}: {Math.round(currentWeather.temperature)}°</span>}
                {currentWeather && (currentWeather.rain > 0 || currentWeather.snow > 0) && <span>{currentWeather.snow > 0 ? `${text.snow} ${currentWeather.snow.toFixed(1)} mm` : `${text.precipitation} ${Math.round(currentWeather.rain)}%`}</span>}
              </span>
            </div>
            <div className="ticks">{ticks.map((index) => <DialTick key={index} index={index} />)}</div>
          </div>
          <EventArcLayer segments={eventSegments} currentTimezoneCity={timezone.city} locale={locale} isSwitching={isSwitching} activeEventId={activeEvent?.planId} onActiveChange={setActiveEvent} />
          <DialCore time={formatTime(now, timezone.timeZone, !is24Hour, localeTag(locale))} is24Hour={is24Hour} dateLabel={formatDateLabel(viewDateObject, timezone.timeZone, localeTag(locale))} dateValue={viewDate} timezone={timezone} timezones={timezones} moonPhase={moonPhase} cycleMarker={cycleMarker} locale={locale} onTimezoneChange={onTimezoneChange} onToggleTimeFormat={() => setIs24Hour((current) => !current)} onDateChange={setViewDate} onShiftDate={(dayOffset) => setViewDate((current) => shiftDateKey(current, dayOffset))} onAdd={onAdd} />
        </div>
        <div className="dial-label dial-label--noon"><NoonMidnightMark type="sun" /><span>12</span></div>
        <div className="dial-label dial-label--midnight"><span>00</span><NoonMidnightMark type="moon" /></div>
        <div className="dial-label dial-label--morning">06<span>AM</span></div>
        <div className="dial-label dial-label--evening">06<span>PM</span></div>
      </div>
    </section>
  );
}

function nearestReading<T extends { minutes: number }>(readings: T[], minutes: number): T | null {
  if (readings.length === 0) return null;
  return readings.reduce((nearest, reading) => Math.abs(reading.minutes - minutes) < Math.abs(nearest.minutes - minutes) ? reading : nearest);
}
