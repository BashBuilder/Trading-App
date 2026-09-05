// services/subscription.service.ts
import axios from "@/config/axios";
import { BillingCycle, Tier } from "./tier.service";

export type TierId = "explorer" | "strategist" | "mathematician";
export type SubscriptionStatus = "active" | "cancelled" | "expired";

export interface TierPrice {
  monthly: number;
  annual: number;
  oneTime: number;
}

export interface Subscription {
  uid: string;
  tierId: TierId;
  tierName: string;
  billingCycle: BillingCycle;
  price: number;
  status: SubscriptionStatus;
  capabilities: string[];
  subscribedAt: string;
  expiresAt: string | null;
  cancelledAt?: string;
}

export const subscriptionService = {
  getTiers: async (): Promise<Tier[]> => {
    const res = await axios.get("subscriptions/tiers");
    return res.data.payload;
  },

  getCurrent: async (): Promise<Subscription | null> => {
    const res = await axios.get("subscriptions/current");
    return res.data.payload;
  },

  subscribe: async (
    tierId: TierId,
    billingCycle: BillingCycle,
  ): Promise<Subscription> => {
    const res = await axios.post("subscriptions/subscribe", {
      tierId,
      billingCycle,
    });
    return res.data.payload;
  },

  cancel: async (): Promise<void> => {
    await axios.post("subscriptions/cancel");
  },

  /** Pulls the latest entitlement state directly from RevenueCat via the backend —
   * call this right after a purchase/restore so the UI doesn't wait on webhook latency. */
  sync: async (): Promise<{ tier: TierId }> => {
    const res = await axios.post("subscriptions/sync");
    return res.data.payload;
  },
};
