import { BillingCycle, TierCapability } from "@/services/tier.service";

export const TIER_DISPLAY: Record<string, string> = {
  explorer: "The Explorer",
  strategist: "The Strategist",
  mathematician: "The Mathematician",
};
export const CAPABILITY_TIER: Record<string, string> = {
  coreSignals: "explorer",
  advancedIndicators: "strategist",
  analytics: "mathematician",
};
export const TIER_RANK: Record<string, number> = {
  explorer: 0,
  strategist: 1,
  mathematician: 2,
};

export const REQUIRED_TIER: Record<string, string> = {
  explorer: "Explorer",
  strategist: "Strategist",
  mathematician: "Mathematician",
};
export const TIER_LABELS: Record<string, string> = {
  explorer: "Explorer",
  strategist: "Strategist",
  mathematician: "Mathematician",
};
export const ALL_CAPABILITIES: TierCapability[] = [
  "coreSignals",
  "advancedIndicators",
  "analytics",
];
export const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  active: { text: "text-emerald-400", bg: "bg-emerald-500/10" },
  draft: { text: "text-yellow-400", bg: "bg-yellow-500/10" },
  closed: { text: "text-neutral-500", bg: "bg-neutral-800" },
  cancelled: { text: "text-red-400", bg: "bg-red-500/10" },
};
export const BILLING_CYCLES: { key: BillingCycle; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  // { key: "annual", label: "Annual" },
  // { key: "oneTime", label: "Lifetime" },
];
