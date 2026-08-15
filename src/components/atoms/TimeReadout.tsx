type TimeReadoutProps = { value: string; is24Hour: boolean; onToggle: () => void };

export function TimeReadout({ value, is24Hour, onToggle }: TimeReadoutProps) {
  const [clock, period] = value.split(/\s+(?=[ap]m$)/i);
  return <button className="time-readout" type="button" onClick={onToggle} aria-label={`Current time ${value}. Switch to ${is24Hour ? '12-hour' : '24-hour'} format`}><span>{clock}</span>{period && <span className="time-readout-period">{period.toUpperCase()}</span>}</button>;
}
