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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!timezoneMenuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const activeIndex = timezones.findIndex((option) => option.id === timezone.id);
    optionRefs.current[activeIndex >= 0 ? activeIndex : 0]?.focus();
    const handleMenuKeyDown = (event: KeyboardEvent) => {
      const currentIndex = optionRefs.current.findIndex((option) => option === document.activeElement);
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        optionRefs.current[(currentIndex + 1) % timezones.length]?.focus();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        optionRefs.current[(currentIndex - 1 + timezones.length) % timezones.length]?.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        optionRefs.current[0]?.focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        optionRefs.current[timezones.length - 1]?.focus();
      }
    };
    document.addEventListener('keydown', handleMenuKeyDown);
    return () => document.removeEventListener('keydown', handleMenuKeyDown);
  }, [isOpen, timezones, timezone.id]);

  const selectTimezone = (id: string) => {
    setIsOpen(false);
    triggerRef.current?.focus();
    onTimezoneChange(id);
  };

  return (
    <div className="dial-core">
      <MoonPhaseIcon phase={moonPhase} className="moon-phase-backdrop" decorative />
      <div className="core-timezone" ref={timezoneMenuRef}>
        <button ref={triggerRef} className="core-timezone-trigger" type="button" aria-label={`Timezone: ${timezone.city}. Choose timezone`} aria-controls="timezone-menu" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
          <span className="core-timezone-value">{timezone.city}</span>
        </button>
        {isOpen && <div className="timezone-menu" id="timezone-menu" role="listbox" aria-label="Select timezone">{timezones.map((option, index) => <button ref={(element) => { optionRefs.current[index] = element; }} className={`timezone-option${option.id === timezone.id ? ' timezone-option--active' : ''}`} type="button" role="option" aria-selected={option.id === timezone.id} key={option.id} onClick={() => selectTimezone(option.id)}>{option.city}<small>{option.timeZone}</small></button>)}</div>}
      </div>
      <TimeReadout value={time} />
      <button className="core-add-button" type="button" aria-label="Add a new plan" onClick={onAdd}><PlusIcon /></button>
    </div>
  );
}
