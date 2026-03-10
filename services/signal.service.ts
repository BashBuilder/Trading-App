// services/signal.service.ts
import axios from "@/config/axios";

export type SignalDirection = "Long" | "Short";
export type SignalTier = "explorer" | "strategist" | "mathematician";
export type SignalStatus = "active" | "draft" | "closed";
export type AccessLevel = "full" | "preview" | "locked";

export interface Signal {
  id: string;
  pair: string;
  timeframe: string;
  direction: SignalDirection;
  confidence: number;
  tier: SignalTier;
  summary: string;
  time: string;
  // Only present on full access
  entry: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  chartImageUrl: string | null;
  analystNotes: string | null;
  accessLevel: AccessLevel;
  status?: SignalStatus;
}

export interface CreateSignalPayload {
  pair: string;
  timeframe: string;
  direction: SignalDirection;
  confidence: number;
  tier: SignalTier;
  summary: string;
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  chartImageUrl?: string;
  analystNotes?: string;
  status?: SignalStatus;
}

export const signalService = {
  getAll: async (): Promise<Signal[]> => {
    const res = await axios.get("signals");
    return res.data.payload;
  },

  getById: async (id: string): Promise<Signal> => {
    const res = await axios.get(`signals/${id}`);
    return res.data.payload;
  },

  // Admin
  adminGetAll: async (): Promise<Signal[]> => {
    const res = await axios.get("signals/admin/all");
    return res.data.payload;
  },

  adminCreate: async (payload: CreateSignalPayload): Promise<Signal> => {
    const res = await axios.post("signals", payload);
    return res.data.payload;
  },

  adminUpdate: async (
    id: string,
    payload: Partial<CreateSignalPayload>,
  ): Promise<void> => {
    await axios.put(`signals/${id}`, payload);
  },

  adminClose: async (id: string): Promise<void> => {
    await axios.delete(`signals/${id}`);
  },
};
