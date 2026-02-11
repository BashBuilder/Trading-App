// src/config/tiers.ts

export type TierId = "explorer" | "strategist" | "mathematician";

export type TierCapability = "coreSignals" | "advancedIndicators" | "analytics";

export interface TierDefinition {
  id: TierId;
  name: string;
  description: string;
  price: {
    weekly: string;
    monthly: string;
  };
  capabilities: TierCapability[];
}

export const TIERS: Record<TierId, TierDefinition> = {
  explorer: {
    id: "explorer",
    name: "The Explorer",
    description:
      "Access to core market signals designed for structured observation.",
    price: {
      weekly: "$4.99",
      monthly: "$14.99",
    },
    capabilities: ["coreSignals"],
  },

  strategist: {
    id: "strategist",
    name: "The Strategist",
    description:
      "Expanded signal access with additional analytical indicators.",
    price: {
      weekly: "$7.99",
      monthly: "$24.99",
    },
    capabilities: ["coreSignals", "advancedIndicators"],
  },

  mathematician: {
    id: "mathematician",
    name: "The Mathematician",
    description:
      "Full analytical access including structured analytics and deeper insight.",
    price: {
      weekly: "$11.99",
      monthly: "$34.99",
    },
    capabilities: ["coreSignals", "advancedIndicators", "analytics"],
  },
};

export function tierHasCapability(
  tier: TierId,
  capability: TierCapability,
): boolean {
  return TIERS[tier].capabilities.includes(capability);
}
