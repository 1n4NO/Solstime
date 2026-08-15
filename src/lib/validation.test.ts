import { describe, expect, it } from 'vitest';
import { isValidTimeString, validatePlanTimes } from './validation';

describe('plan time validation', () => {
  it('accepts valid 24-hour times and detects overnight plans', () => {
    expect(validatePlanTimes('22:30', '01:15')).toEqual({ valid: true, overnight: true });
  });

  it('rejects malformed and equal times', () => {
    expect(isValidTimeString('25:00')).toBe(false);
    expect(validatePlanTimes('09:00', '09:00').valid).toBe(false);
  });
});
