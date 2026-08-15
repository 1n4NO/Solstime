import { useEffect, useRef, useState } from 'react';
import { Kicker } from '../atoms/Kicker';
import { TimeReadout } from '../atoms/TimeReadout';
import type { TimezoneLocation } from '../../lib/product';

type DialCoreProps = { time: string; timezone: TimezoneLocation; timezones: TimezoneLocation[]; onTimezoneChange: (id: string) => void };

export function DialCore({ time, timezone, timezones, onTimezoneChange }: DialCoreProps) {
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
      <div className="core-timezone" ref={timezoneMenuRef}>
        <button className="core-timezone-trigger" type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
          <Kicker>LOCAL TIME</Kicker>
          <span className="core-timezone-value">{timezone.city}</span>
          <span className="core-timezone-caret" aria-hidden="true">⌄</span>
        </button>
        {isOpen && <div className="timezone-menu" role="listbox" aria-label="Select timezone">{timezones.map((option) => <button className={`timezone-option${option.id === timezone.id ? ' timezone-option--active' : ''}`} type="button" role="option" aria-selected={option.id === timezone.id} key={option.id} onClick={() => selectTimezone(option.id)}>{option.city}<small>{option.timeZone}</small></button>)}</div>}
      </div>
      <TimeReadout value={time} />
      <span className="core-status"><span className="pulse" /> deep work window</span>
    </div>
  );
}
