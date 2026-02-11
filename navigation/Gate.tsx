import { useSubscriptionStore } from "../features/subscription/subscription.store";

export function useSubscriptionGate() {
  const subscription = useSubscriptionStore();

  return {
    hasAccess: subscription.isActive,
    tier: subscription.tier,
  };
}
