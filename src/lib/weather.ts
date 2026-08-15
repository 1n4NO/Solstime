export type WeatherReading = { minutes: number; temperature: number; rain: number; snow: number };

type ForecastResponse = { hourly?: { time?: string[]; temperature_2m?: number[]; precipitation_probability?: number[]; rain?: number[]; snowfall?: number[] } };

export async function fetchWeatherReadings(latitude: number, longitude: number, date: string, timeZone: string, signal?: AbortSignal): Promise<WeatherReading[]> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), hourly: 'temperature_2m,precipitation_probability,rain,snowfall', start_date: date, end_date: date, timezone: timeZone });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { signal });
  if (!response.ok) throw new Error(`Weather request failed with status ${response.status}`);
  const data = await response.json() as ForecastResponse;
  const times = data.hourly?.time ?? [];
  const temperatures = data.hourly?.temperature_2m ?? [];
  const probability = data.hourly?.precipitation_probability ?? [];
  const rain = data.hourly?.rain ?? [];
  const snow = data.hourly?.snowfall ?? [];
  return times.map((time, index) => ({ minutes: Number(time.slice(11, 13)) * 60 + Number(time.slice(14, 16)), temperature: temperatures[index], rain: Math.max(probability[index] ?? 0, rain[index] ?? 0), snow: snow[index] ?? 0 })).filter((reading) => Object.values(reading).every(Number.isFinite));
}
