type TimeReadoutProps = { value: string };

export function TimeReadout({ value }: TimeReadoutProps) {
  return <strong className="time-readout">{value}</strong>;
}
