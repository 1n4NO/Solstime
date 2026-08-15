export const SOLSTICE_LOCATION = {
  latitude: 12.9716,
  longitude: 77.5946,
};

export type SolarTimes = {
  sunrise: number;
  sunset: number;
};

/** Maps a 24-hour value so noon is at 12 o'clock and midnight at 6 o'clock. */
export function dialAngle(hour: number): number {
  return (hour - 12) * 15;
}

/** Returns the compass-clock angle used by conic-gradient: 0deg is noon/top. */
export function dialGradientAngle(hour: number): number {
  return (dialAngle(hour) + 360) % 360;
}

function calendarParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
  };
}

function timezoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(date);
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]));
  const asUtc = Date.UTC(values.year, values.month - 1, values.day, values.hour % 24, values.minute, values.second);
  return Math.round((asUtc - date.getTime()) / 60_000);
}

function normalizeDegrees(value: number): number {
  return (value % 360 + 360) % 360;
}

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((current - start) / 86_400_000);
}

function solarHour(date: Date, latitude: number, longitude: number, timeZone: string, isSunrise: boolean): number {
  const zenith = 90.833;
  const longitudeHour = longitude / 15;
  const approximateTime = dayOfYear(date) + ((isSunrise ? 6 : 18) - longitudeHour) / 24;
  const meanAnomaly = 0.9856 * approximateTime - 3.289;
  const trueLongitude = normalizeDegrees(meanAnomaly + 1.916 * Math.sin(meanAnomaly * Math.PI / 180) + 0.020 * Math.sin(2 * meanAnomaly * Math.PI / 180) + 282.634);
  const rightAscension = normalizeDegrees(Math.atan(0.91764 * Math.tan(trueLongitude * Math.PI / 180)) * 180 / Math.PI);
  const longitudeQuadrant = Math.floor(trueLongitude / 90) * 90;
  const rightAscensionQuadrant = Math.floor(rightAscension / 90) * 90;
  const adjustedRightAscension = (rightAscension + longitudeQuadrant - rightAscensionQuadrant) / 15;
  const sinDeclination = 0.39782 * Math.sin(trueLongitude * Math.PI / 180);
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const latitudeRadians = latitude * Math.PI / 180;
  const cosHourAngle = (Math.cos(zenith * Math.PI / 180) - sinDeclination * Math.sin(latitudeRadians)) / (cosDeclination * Math.cos(latitudeRadians));

  if (cosHourAngle < -1 || cosHourAngle > 1) return isSunrise ? 6 : 18;

  const hourAngle = Math.acos(cosHourAngle) * 180 / Math.PI;
  const localHourAngle = (isSunrise ? 360 - hourAngle : hourAngle) / 15;
  const universalTime = (localHourAngle + adjustedRightAscension - 0.06571 * approximateTime - 6.622 - longitudeHour + 24) % 24;
  const timezoneOffset = timezoneOffsetMinutes(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12)), timeZone);
  return (universalTime * 60 + timezoneOffset + 1440) % 1440 / 60;
}

export function getSolarTimes(date: Date, location = SOLSTICE_LOCATION, timeZone = 'Asia/Kolkata'): SolarTimes {
  const parts = calendarParts(date, timeZone);
  const localDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  return {
    sunrise: solarHour(localDate, location.latitude, location.longitude, timeZone, true),
    sunset: solarHour(localDate, location.latitude, location.longitude, timeZone, false),
  };
}

export function formatTime(date: Date, timeZone = 'Asia/Kolkata'): string {
  return date.toLocaleTimeString('en-IN', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDate(date: Date, timeZone: string): string {
  return date.toLocaleDateString('en-IN', { timeZone, day: '2-digit', month: 'short', year: 'numeric' });
}

export function localHour(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23' }).formatToParts(date);
  return Number(parts.find((part) => part.type === 'hour')?.value ?? 0) + Number(parts.find((part) => part.type === 'minute')?.value ?? 0) / 60;
}

export function formatSolarTime(hour: number): string {
  const hours = Math.floor(hour);
  const minutes = Math.round((hour - hours) * 60) % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
