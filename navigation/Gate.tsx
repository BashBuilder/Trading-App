// src/navigation/Gate.tsx
export function useSubscriptionGate() {
  /**
   * STUB — real logic comes later
   * This will eventually read from subscription store
   */
  const hasActiveSubscription = true;

  return {
    hasAccess: hasActiveSubscription,
  };
}
