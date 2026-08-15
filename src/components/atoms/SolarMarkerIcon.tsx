type SolarMarkerIconProps = { type: 'sunrise' | 'sunset' };

export function SolarMarkerIcon({ type }: SolarMarkerIconProps) {
  return (
    <svg className="solar-marker-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="11" r="4" />
      <path d="M12 2v3M12 17v3M3 11h3M18 11h3M5.64 4.64l2.12 2.12M16.24 15.24l2.12 2.12M18.36 4.64l-2.12 2.12M7.76 15.24l-2.12 2.12" />
      {type === 'sunrise' ? <path d="M3 20h18M6 18l6-6 6 6" /> : <path d="M3 20h18M6 15l6 6 6-6" />}
    </svg>
  );
}
