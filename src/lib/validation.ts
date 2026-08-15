export type TimeValidation = { valid: boolean; overnight: boolean; message?: string };

export function validatePlanTimes(startTime: string, endTime: string): TimeValidation {
  if (!startTime || !endTime) return { valid: false, overnight: false, message: 'Add a start time and end time.' };
  if (startTime === endTime) return { valid: false, overnight: false, message: 'Start and end time cannot be the same.' };
  return { valid: true, overnight: endTime < startTime };
}
