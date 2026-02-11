import { useState } from "react";
// import { SubscriptionState } from "./subscription.types";
import { TierId } from "@/config/tier";
import { SubscriptionState } from "./subscription.types";

let currentState: SubscriptionState = {
  isActive: false,
  tier: null,
};

const listeners = new Set<(state: SubscriptionState) => void>();

function setState(next: SubscriptionState) {
  currentState = next;
  listeners.forEach((l) => l(currentState));
}

export function useSubscriptionStore(): SubscriptionState & {
  activate: (tier: TierId) => void;
  deactivate: () => void;
} {
  const [state, setLocalState] = useState(currentState);

  // subscribe
  if (!listeners.has(setLocalState)) {
    listeners.add(setLocalState);
  }

  return {
    ...state,
    activate: (tier) =>
      setState({
        isActive: true,
        tier,
      }),
    deactivate: () =>
      setState({
        isActive: false,
        tier: null,
      }),
  };
}
