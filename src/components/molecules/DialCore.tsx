import { useEffect, useRef, useState } from 'react';
import { TimeReadout } from '../atoms/TimeReadout';
import { MoonPhaseIcon } from '../atoms/MoonPhaseIcon';
import { PlusIcon } from '../atoms/PlusIcon';
import type { TimezoneLocation } from '../../lib/product';
import type { MoonPhase } from '../../lib/moon';

type DialCoreProps = { time: string; timezone: TimezoneLocation; timezones: TimezoneLocation[]; moonPhase: MoonPhase; onTimezoneChange: (id: string) => void; onAdd: () => void };

export function DialCore({ time, timezone, timezones, moonPhase, onTimezoneChange, onAdd }: DialCoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timezoneMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!timezoneMenuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [isOpen]);

  const selectTimezone = (id: string) => {
    setIsOpen(false);
    onTimezoneChange(id);
  };

  return (
    <div className="dial-core">
      <MoonPhaseIcon phase={moonPhase} className="moon-phase-backdrop" decorative />
      <div className="core-timezone" ref={timezoneMenuRef}>
        <button className="core-timezone-trigger" type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
          <span className="core-timezone-value">{timezone.city}</span>
        </button>
        {isOpen && <div className="timezone-menu" role="listbox" aria-label="Select timezone">{timezones.map((option) => <button className={`timezone-option${option.id === timezone.id ? ' timezone-option--active' : ''}`} type="button" role="option" aria-selected={option.id === timezone.id} key={option.id} onClick={() => selectTimezone(option.id)}>{option.city}<small>{option.timeZone}</small></button>)}</div>}
      </div>
      <TimeReadout value={time} />
      <button className="core-add-button" type="button" aria-label="Add a new plan" onClick={onAdd}><PlusIcon /></button>
    </div>
  );
}
