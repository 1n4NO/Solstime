'use client';

import { useEffect, useMemo, useState } from 'react';
import { dialAngle, dialGradientAngle, formatSolarTime, formatTime, getSolarTimes, localHour } from '../../lib/time';
import type { TimezoneLocation } from '../../lib/product';
import { DialTick } from '../atoms/DialTick';
import { DialCore } from '../molecules/DialCore';
import { getMoonPhase } from '../../lib/moon';

type TimeDialProps = { timezone: TimezoneLocation; timezones: TimezoneLocation[]; isSwitching: boolean; onTimezoneChange: (id: string) => void; onAdd: () => void };

export function TimeDial({ timezone, timezones, isSwitching, onTimezoneChange, onAdd }: TimeDialProps) {
  const [now, setNow] = useState(() => new Date());
  const ticks = useMemo(() => Array.from({ length: 48 }, (_, index) => index), []);
  const currentHour = localHour(now, timezone.timeZone);
  const solarTimes = getSolarTimes(now, timezone, timezone.timeZone);
  const moonPhase = getMoonPhase(now);
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

  return (
    <section className="dial-stage" aria-label="Solstice 24 hour planner">
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
          <DialCore time={formatTime(now, timezone.timeZone)} timezone={timezone} timezones={timezones} moonPhase={moonPhase} onTimezoneChange={onTimezoneChange} onAdd={onAdd} />
        </div>
        <div className="dial-label dial-label--noon">NOON<span>12</span></div>
        <div className="dial-label dial-label--midnight">MIDNIGHT<span>00</span></div>
        <div className="dial-label dial-label--morning">06<span>AM</span></div>
        <div className="dial-label dial-label--evening">06<span>PM</span></div>
      </div>
    </section>
  );
}
