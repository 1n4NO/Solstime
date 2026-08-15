import { describe, expect, it } from 'vitest';
import { hasFeature, normalizeEntitlement } from './entitlements';

describe('entitlements', () => {
  it('resolves tier capabilities without applying UI gating', () => {
    expect(hasFeature({ tier: 'free', status: 'active' }, 'web-dial')).toBe(true);
    expect(hasFeature({ tier: 'free', status: 'active' }, 'dashboard')).toBe(false);
    expect(hasFeature({ tier: 'super-pro', status: 'active' }, 'dashboard')).toBe(true);
  });

  it('normalizes unknown or expired states safely', () => {
    expect(normalizeEntitlement({ tier: 'unknown', status: 'unknown' })).toEqual({ tier: 'free', status: 'active' });
    expect(hasFeature({ tier: 'super-pro', status: 'expired' }, 'dashboard')).toBe(false);
  });
});
