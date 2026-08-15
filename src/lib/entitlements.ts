import { TIER_FEATURES, type AccountTier } from './product';

export type FeatureId = string;

export type EntitlementState = {
  tier: AccountTier;
  status: 'active' | 'trialing' | 'grace' | 'expired' | 'signed-out' | 'offline';
  checkedAt?: string;
};

export const DEFAULT_ENTITLEMENT: EntitlementState = {
  tier: 'free',
  status: 'active',
};

export function hasFeature(entitlement: EntitlementState, feature: FeatureId): boolean {
  if (entitlement.status === 'signed-out' || entitlement.status === 'expired') return false;
  return TIER_FEATURES[entitlement.tier].includes(feature);
}

export function isPaidTier(tier: AccountTier): boolean {
  return tier === 'pro' || tier === 'super-pro';
}

export function isSuperPro(tier: AccountTier): boolean {
  return tier === 'super-pro';
}

export function normalizeEntitlement(value: unknown): EntitlementState {
  if (!value || typeof value !== 'object') return DEFAULT_ENTITLEMENT;
  const candidate = value as Partial<EntitlementState>;
  const tier: AccountTier = candidate.tier === 'pro' || candidate.tier === 'super-pro' ? candidate.tier : 'free';
  const statuses: EntitlementState['status'][] = ['active', 'trialing', 'grace', 'expired', 'signed-out', 'offline'];
  const status = statuses.includes(candidate.status as EntitlementState['status']) ? candidate.status as EntitlementState['status'] : 'active';
  return { tier, status, ...(typeof candidate.checkedAt === 'string' ? { checkedAt: candidate.checkedAt } : {}) };
}
