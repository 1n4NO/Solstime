import type { WeatherReading } from '../../lib/weather';

type WeatherLayerProps = { readings: WeatherReading[] };

export function WeatherLayer({ readings }: WeatherLayerProps) {
  const visible = readings;
  if (!visible.length) return null;
  const temperatures = visible.map((reading) => reading.temperature);
  const minimum = Math.min(...temperatures);
  const maximum = Math.max(...temperatures);
  return <div className="weather-layer" aria-label="Temperature and precipitation forecast">
    <svg className="temperature-ring" viewBox="0 0 100 100" aria-hidden="true">
      {visible.map((reading, index) => {
        const start = reading.minutes;
        const end = reading.minutes + 60;
        const ratio = maximum === minimum ? .5 : (reading.temperature - minimum) / (maximum - minimum);
        return <path key={`temperature-${reading.minutes}`} d={arcPath(start, end, 49)} stroke={temperatureColor(ratio)} strokeWidth=".7" fill="none" strokeLinecap="butt" />;
      })}
    </svg>
    <svg className="precipitation-ring" viewBox="0 0 100 100" aria-hidden="true">
      {visible.filter((reading) => reading.rain > 0 || reading.snow > 0).map((reading) => {
        const start = reading.minutes;
        const end = reading.minutes + 60;
        return <path key={`precipitation-${reading.minutes}`} d={arcPath(start, end, 47.8)} stroke={reading.snow > 0 ? 'var(--snow)' : 'var(--rain)'} strokeWidth="1.4" fill="none" strokeLinecap="butt" opacity=".9" />;
      })}
    </svg>
  </div>;
}

function arcPath(startMinutes: number, endMinutes: number, radius: number): string {
  const start = point(startMinutes, radius);
  const end = point(endMinutes, radius);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}

function point(minutes: number, radius: number) {
  const radians = (((minutes / 4) - 180) * Math.PI) / 180;
  return { x: 50 + radius * Math.sin(radians), y: 50 - radius * Math.cos(radians) };
}

function temperatureColor(ratio: number): string {
  if (ratio < .34) return 'var(--weather-cold)';
  if (ratio < .67) return 'var(--weather-mild)';
  return 'var(--weather-warm)';
}
