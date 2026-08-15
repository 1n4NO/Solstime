export type TimeValidation = { valid: boolean; overnight: boolean; message?: string };

export function isValidTimeString(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function validatePlanTimes(startTime: string, endTime: string): TimeValidation {
  if (!isValidTimeString(startTime) || !isValidTimeString(endTime)) return { valid: false, overnight: false, message: 'Use valid times in 24-hour format.' };
  if (!startTime || !endTime) return { valid: false, overnight: false, message: 'Add a start time and end time.' };
  if (startTime === endTime) return { valid: false, overnight: false, message: 'Start and end time cannot be the same.' };
  return { valid: true, overnight: endTime < startTime };
}
