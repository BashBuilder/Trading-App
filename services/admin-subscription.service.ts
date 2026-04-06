// services/admin-subscription.service.ts
import axios from "@/config/axios";
import { BillingCycle } from "./tier.service";

export interface AdminSubscription {
  id: string;
  uid: string;
  tierId: string;
  tierName: string;
  billingCycle: BillingCycle;
  price: number;
  status: "active" | "cancelled" | "expired";
  capabilities: string[];
  subscribedAt: string;
  expiresAt: string | null;
  cancelledAt?: string;
  addedByAdmin?: boolean;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const adminSubscriptionService = {
  getAll: async (status?: string): Promise<AdminSubscription[]> => {
    const params = status && status !== "all" ? `?status=${status}` : "";
    const res = await axios.get(`admin/subscriptions${params}`);
    return res.data.payload;
  },

  searchByEmail: async (email: string): Promise<AdminSubscription[]> => {
    const res = await axios.get(
      `admin/subscriptions?email=${encodeURIComponent(email)}`,
    );
    return res.data.payload;
  },

  getHistory: async (uid: string) => {
    const res = await axios.get(`admin/subscriptions/history/${uid}`);
    return res.data.payload;
  },

  add: async (payload: {
    uid: string;
    tierId: string;
    billingCycle: BillingCycle | "custom";
    durationDays?: number;
  }): Promise<AdminSubscription> => {
    const res = await axios.post("admin/subscriptions", payload);
    return res.data.payload;
  },

  cancel: async (uid: string): Promise<void> => {
    const sanitizeUid = encodeURIComponent(uid);
    await axios.delete(`admin/subscriptions/${sanitizeUid}`);
  },
};
