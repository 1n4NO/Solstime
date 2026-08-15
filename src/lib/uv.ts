export type UvReading = { minutes: number; value: number };

type OpenMeteoResponse = { hourly?: { time?: string[]; uv_index?: number[] } };

export async function fetchUvReadings(latitude: number, longitude: number, date: string, timeZone: string, signal?: AbortSignal): Promise<UvReading[]> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), hourly: 'uv_index', start_date: date, end_date: date, timezone: timeZone });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { signal });
  if (!response.ok) throw new Error(`UV request failed with status ${response.status}`);
  const data = await response.json() as OpenMeteoResponse;
  const times = data.hourly?.time ?? [];
  const values = data.hourly?.uv_index ?? [];

  return times.map((time, index) => ({ minutes: Number(time.slice(11, 13)) * 60 + Number(time.slice(14, 16)), value: values[index] })).filter((reading) => Number.isFinite(reading.minutes) && Number.isFinite(reading.value));
}

export function uvCategory(value: number): string {
  if (value < 3) return 'LOW';
  if (value < 6) return 'MODERATE';
  if (value < 8) return 'HIGH';
  if (value < 11) return 'VERY HIGH';
  return 'EXTREME';
}

export function uvColor(value: number): string {
  if (value < 3) return '#a9c7a4';
  if (value < 6) return '#f1b56e';
  if (value < 8) return '#e49a67';
  if (value < 11) return '#cf8a79';
  return '#bd6d77';
}
