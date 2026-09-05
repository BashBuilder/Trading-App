// components/card/TierCard.tsx
import { BillingCycle, Tier } from "@/services/tier.service";
import { Pressable, Text, View } from "react-native";

interface TierCardProps {
  tier: Tier;
  billingCycle: BillingCycle;
  onSelect: () => void;
  isActive?: boolean;
  isCancelled?: boolean;
  isLoading?: boolean;
  /** Live, localized App Store price string from RevenueCat (e.g. "$29.99") — the ONLY
   * price we show for a purchasable tier. If this hasn't loaded yet we show a loading
   * state rather than falling back to tier.price, since that number can drift from
   * whatever's actually configured in App Store Connect and showing the wrong price
   * before charging the right one is both misleading and an App Review risk. */
  livePriceLabel?: string;
}

const CAPABILITY_LABELS: Record<string, string> = {
  coreSignals: "Core Market Signals",
  advancedIndicators: "Advanced Indicators",
  analytics: "Structured Analytics",
};

const TIER_ACCENTS: Record<string, string> = {
  explorer: "border-cyan-500/40",
  strategist: "border-indigo-500/60",
  mathematician: "border-violet-500/60",
};

const TIER_BADGE: Record<string, { bg: string; text: string }> = {
  explorer: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  strategist: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
  mathematician: { bg: "bg-violet-500/10", text: "text-violet-400" },
};

const TIER_BUTTON: Record<string, string> = {
  explorer: "bg-cyan-600",
  strategist: "bg-indigo-600",
  mathematician: "bg-violet-600",
};

const CYCLE_LABEL: Record<BillingCycle, string> = {
  weekly: "/ wk",
  monthly: "/ mo",
  annual: "/ yr",
  oneTime: "lifetime",
};

export function TierCard({
  tier,
  billingCycle,
  onSelect,
  isActive,
  isCancelled,
  isLoading,
  livePriceLabel,
}: TierCardProps) {
  const badge = TIER_BADGE[tier.id] ?? TIER_BADGE.explorer;
  const buttonColor = TIER_BUTTON[tier.id] ?? TIER_BUTTON.explorer;
  const accent = TIER_ACCENTS[tier.id] ?? TIER_ACCENTS.explorer;

  // Explorer has no App Store product — it's the free default tier, not something to buy.
  const isFreeTier = tier.id === "explorer";
  const priceReady = isFreeTier || !!livePriceLabel;

  const ctaLabel = isFreeTier
    ? "Included"
    : isActive
      ? isCancelled
        ? "Reactivate"
        : "Current Plan"
      : priceReady
        ? "Select Plan"
        : "Loading…";

  const ctaDisabled =
    isFreeTier || isLoading || (isActive && !isCancelled) || !priceReady;

  return (
    <Pressable
      onPress={ctaDisabled ? undefined : onSelect}
      className={`p-5 rounded-2xl border mb-4 ${
        isActive || isFreeTier
          ? `bg-neutral-900 ${accent}`
          : "bg-neutral-900 border-neutral-800"
      }`}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-4">
          <Text className="text-white text-base font-semibold tracking-wide">
            {tier.name}
          </Text>
          <Text className="text-neutral-500 text-xs mt-1 leading-4">
            {tier.description}
          </Text>
        </View>
        <View className="items-end gap-1">
          {(isActive || isFreeTier) && (
            <View className={`px-2 py-0.5 rounded-full ${badge.bg}`}>
              <Text className={`text-xs font-medium ${badge.text}`}>
                {isFreeTier ? "Free" : isCancelled ? "Cancelling" : "Active"}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="mb-4 gap-1.5">
        {["coreSignals", "advancedIndicators", "analytics"].map((cap) => {
          const included = tier.capabilities.includes(cap as any);
          return (
            <View key={cap} className="flex-row items-center gap-2">
              <Text
                className={`text-xs ${included ? "text-emerald-400" : "text-neutral-700"}`}
              >
                {included ? "✓" : "✗"}
              </Text>
              <Text
                className={`text-xs ${included ? "text-neutral-300" : "text-neutral-700"}`}
              >
                {CAPABILITY_LABELS[cap]}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="flex-row justify-between items-center pt-3 border-t border-neutral-800">
        <View>
          {isFreeTier ? (
            <Text className="text-white text-xl font-bold">Free</Text>
          ) : priceReady ? (
            <>
              <Text className="text-white text-xl font-bold">
                {livePriceLabel}
              </Text>
              <Text className="text-neutral-500 text-xs">
                {CYCLE_LABEL[billingCycle]}
              </Text>
            </>
          ) : (
            <Text className="text-neutral-500 text-sm">Loading price…</Text>
          )}
        </View>
        <Pressable
          onPress={ctaDisabled ? undefined : onSelect}
          disabled={ctaDisabled}
          className={`px-5 py-2.5 rounded-xl ${
            ctaDisabled && !isLoading ? "bg-neutral-800" : buttonColor
          }`}
        >
          <Text className="text-white text-sm font-semibold">
            {isLoading ? "..." : ctaLabel}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
