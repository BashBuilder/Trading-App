// src/features/subscription/subscription.types.ts

import { TierId } from "@/config/tier";

export interface SubscriptionState {
  isActive: boolean;
  tier: TierId | null;
}
