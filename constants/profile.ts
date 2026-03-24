export const TIER_COLORS: Record<
  string,
  { accent: string; bg: string; text: string; border: string }
> = {
  explorer: {
    accent: "border-cyan-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  strategist: {
    accent: "border-indigo-500",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
  },
  mathematician: {
    accent: "border-violet-500",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/30",
  },
};

export const CAPABILITY_LABELS: Record<string, string> = {
  coreSignals: "Core Signals",
  advancedIndicators: "Advanced Indicators",
  analytics: "Analytics",
};
