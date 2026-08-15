'use client';

import { useEffect, useMemo, useState } from 'react';
import { dateKey, dialAngle, dialGradientAngle, formatDateLabel, formatSolarTime, formatTime, getSolarTimes, localHour, shiftDateKey } from '../../lib/time';
import type { Plan, TimezoneLocation } from '../../lib/product';
import { getEventSegments, type EventSegment } from '../../lib/events';
import { DialTick } from '../atoms/DialTick';
import { DialCore } from '../molecules/DialCore';
import { EventArcLayer } from '../molecules/EventArcLayer';
import { getMoonPhase } from '../../lib/moon';

type TimeDialProps = { timezone: TimezoneLocation; timezones: TimezoneLocation[]; plans: Plan[]; isSwitching: boolean; onTimezoneChange: (id: string) => void; onAdd: () => void };

export function TimeDial({ timezone, timezones, plans, isSwitching, onTimezoneChange, onAdd }: TimeDialProps) {
  const [now, setNow] = useState(() => new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [viewDate, setViewDate] = useState(() => dateKey(new Date(), timezone.timeZone));
  const [activeEvent, setActiveEvent] = useState<EventSegment | null>(null);
  const ticks = useMemo(() => Array.from({ length: 48 }, (_, index) => index), []);
  const viewDateObject = useMemo(() => new Date(`${viewDate}T12:00:00.000Z`), [viewDate]);
  const currentHour = localHour(now, timezone.timeZone);
  const solarTimes = getSolarTimes(viewDateObject, timezone, timezone.timeZone);
  const moonPhase = getMoonPhase(viewDateObject);
  const eventSegments = useMemo(() => getEventSegments(plans, timezones, viewDateObject, timezone.timeZone), [plans, timezones, viewDateObject, timezone.timeZone]);
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
  useEffect(() => setActiveEvent(null), [isSwitching]);

  return (
    <section className="dial-stage" aria-label="Solstime 24 hour planner">
      <div className="dial-wrap">
        <div className="dial-shadow" />
        <div className={`dial dial--${solarTimes.status}`} style={dialStyle} role="img" aria-label={solarTimes.status === 'normal' ? `24 hour dial showing daylight from ${formatSolarTime(solarTimes.sunrise)} to ${formatSolarTime(solarTimes.sunset)}` : `24 hour dial showing ${solarTimes.status === 'polar-day' ? 'continuous daylight' : 'continuous night'}`}>
          <div className={`dial-transition-layer${isSwitching ? ' dial-transition-layer--switching' : ''}`}>
            <div className="night-arc" />
            <div className="daylight-arc" />
            {solarTimes.sunriseAvailable && <button className="solar-line solar-line--sunrise" style={{ transform: `rotate(${dialAngle(solarTimes.sunrise)}deg)` }} aria-label={`Sunrise at ${formatSolarTime(solarTimes.sunrise)}`}><span className="solar-tooltip">Sunrise <b>{formatSolarTime(solarTimes.sunrise)}</b></span></button>}
            {solarTimes.sunsetAvailable && <button className="solar-line solar-line--sunset" style={{ transform: `rotate(${dialAngle(solarTimes.sunset)}deg)` }} aria-label={`Sunset at ${formatSolarTime(solarTimes.sunset)}`}><span className="solar-tooltip">Sunset <b>{formatSolarTime(solarTimes.sunset)}</b></span></button>}
            <div className="now-line" style={{ transform: `rotate(${dialAngle(currentHour)}deg)` }}><span /></div>
            <div className="ticks">{ticks.map((index) => <DialTick key={index} index={index} />)}</div>
          </div>
          <EventArcLayer segments={eventSegments} currentTimezoneCity={timezone.city} isSwitching={isSwitching} activeEventId={activeEvent?.planId} onActiveChange={setActiveEvent} />
          <DialCore time={formatTime(now, timezone.timeZone, !is24Hour)} is24Hour={is24Hour} dateLabel={formatDateLabel(viewDateObject, timezone.timeZone)} dateValue={viewDate} timezone={timezone} timezones={timezones} moonPhase={moonPhase} onTimezoneChange={onTimezoneChange} onToggleTimeFormat={() => setIs24Hour((current) => !current)} onDateChange={setViewDate} onShiftDate={(dayOffset) => setViewDate((current) => shiftDateKey(current, dayOffset))} onAdd={onAdd} />
        </div>
        <div className="dial-label dial-label--noon">NOON<span>12</span></div>
        <div className="dial-label dial-label--midnight">MIDNIGHT<span>00</span></div>
        <div className="dial-label dial-label--morning">06<span>AM</span></div>
        <div className="dial-label dial-label--evening">06<span>PM</span></div>
      </div>
    </section>
  );
}
