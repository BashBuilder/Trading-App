import { TierCapability, tierHasCapability } from "@/config/tier";
import { SubscriptionState } from "./subscription.types";

export function hasCapability(
  state: SubscriptionState,
  capability: TierCapability,
): boolean {
  if (!state.isActive || !state.tier) return false;
  return tierHasCapability(state.tier, capability);
}
