// services/tier.service.ts
import axios from "@/config/axios";

export type TierCapability = "coreSignals" | "advancedIndicators" | "analytics";
export type BillingCycle = "weekly" | "monthly" | "annual" | "oneTime";

export interface TierPrice {
  weekly: number;
  monthly: number;
  annual: number;
  oneTime: number;
}

export interface Tier {
  id: string;
  name: string;
  description: string;
  capabilities: TierCapability[];
  price: TierPrice;
  order: number;
}

export const tierService = {
  getAll: async (): Promise<Tier[]> => {
    const res = await axios.get("tiers");
    return res.data.payload;
  },

  getById: async (id: string): Promise<Tier> => {
    const res = await axios.get(`tiers/${id}`);
    return res.data.payload;
  },

  // Admin
  adminUpdate: async (id: string, payload: Partial<Tier>): Promise<void> => {
    await axios.put(`tiers/${id}`, payload);
  },
};
