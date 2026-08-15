const SYNODIC_MONTH = 29.530588853;
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

export type MoonPhase = { progress: number; name: string; illumination: number };

export function getMoonPhase(date: Date): MoonPhase {
  const daysSinceReference = (date.getTime() - REFERENCE_NEW_MOON) / 86_400_000;
  const progress = ((daysSinceReference % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH / SYNODIC_MONTH;
  const illumination = (1 - Math.cos(progress * Math.PI * 2)) / 2;
  const name = progress < 0.02 || progress >= 0.98 ? 'New moon' : progress < 0.23 ? 'Waxing crescent' : progress < 0.27 ? 'First quarter' : progress < 0.483 ? 'Waxing gibbous' : progress < 0.527 ? 'Full moon' : progress < 0.73 ? 'Waning gibbous' : progress < 0.77 ? 'Last quarter' : progress < 0.98 ? 'Waning crescent' : 'New moon';
  return { progress, name, illumination };
}
