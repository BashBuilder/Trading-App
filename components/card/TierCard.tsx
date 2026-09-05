// // components/card/TierCard.tsx
// import { BillingCycle, Tier } from "@/services/subscription.service";
// import { Pressable, Text, View } from "react-native";

// interface TierCardProps {
//   tier: Tier;
//   billingCycle: BillingCycle;
//   onSelect: () => void;
//   isActive?: boolean;
//   isCancelled?: boolean;
//   isLoading?: boolean;
// }

// const CAPABILITY_LABELS: Record<string, string> = {
//   coreSignals: "Core Market Signals",
//   advancedIndicators: "Advanced Indicators",
//   analytics: "Structured Analytics",
// };

// const TIER_ACCENTS: Record<string, string> = {
//   explorer: "border-cyan-500/40",
//   strategist: "border-indigo-500/60",
//   mathematician: "border-violet-500/60",
// };

// const TIER_BADGE_COLORS: Record<string, string> = {
//   explorer: "bg-cyan-500/10 text-cyan-400",
//   strategist: "bg-indigo-500/10 text-indigo-400",
//   mathematician: "bg-violet-500/10 text-violet-400",
// };

// const TIER_BUTTON_COLORS: Record<string, string> = {
//   explorer: "bg-cyan-600",
//   strategist: "bg-indigo-600",
//   mathematician: "bg-violet-600",
// };

// const SAVINGS: Record<BillingCycle, string | null> = {
//   monthly: null,
//   annual: "Save 33%",
//   oneTime: "Best Value",
// };

// export function TierCard({
//   tier,
//   billingCycle,
//   onSelect,
//   isActive,
//   isCancelled,
//   isLoading,
// }: TierCardProps) {
//   const price = tier.price[billingCycle];
//   const saving = SAVINGS[billingCycle];

//   const cycleLabel =
//     billingCycle === "monthly"
//       ? "/ mo"
//       : billingCycle === "annual"
//         ? "/ yr"
//         : "lifetime";

//   const ctaLabel = isActive
//     ? isCancelled
//       ? "Reactivate"
//       : "Current Plan"
//     : "Select Plan";

//   return (
//     <Pressable
//       onPress={isActive && !isCancelled ? undefined : onSelect}
//       className={`p-5 rounded-2xl border mb-4 ${
//         isActive
//           ? `bg-neutral-900 ${TIER_ACCENTS[tier.id]}`
//           : "bg-neutral-900 border-neutral-800"
//       }`}
//     >
//       {/* Header row */}
//       <View className="flex-row justify-between items-start mb-3">
//         <View className="flex-1 mr-4">
//           <Text className="text-white text-base font-semibold tracking-wide">
//             {tier.name}
//           </Text>
//           <Text className="text-neutral-500 text-xs mt-1 leading-4">
//             {tier.description}
//           </Text>
//         </View>

//         <View className="items-end gap-1">
//           {isActive && (
//             <View
//               className={`px-2 py-0.5 rounded-full ${TIER_BADGE_COLORS[tier.id].split(" ")[0]}`}
//             >
//               <Text
//                 className={`text-xs font-medium ${TIER_BADGE_COLORS[tier.id].split(" ")[1]}`}
//               >
//                 {isCancelled ? "Cancelling" : "Active"}
//               </Text>
//             </View>
//           )}
//           {saving && !isActive && (
//             <View className="px-2 py-0.5 bg-emerald-500/10 rounded-full">
//               <Text className="text-emerald-400 text-xs font-medium">
//                 {saving}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Capabilities */}
//       <View className="mb-4 gap-1.5">
//         {["coreSignals", "advancedIndicators", "analytics"].map((cap) => {
//           const included = tier.capabilities.includes(cap);
//           return (
//             <View key={cap} className="flex-row items-center gap-2">
//               <Text
//                 className={`text-xs ${included ? "text-emerald-400" : "text-neutral-700"}`}
//               >
//                 {included ? "✓" : "✗"}
//               </Text>
//               <Text
//                 className={`text-xs ${included ? "text-neutral-300" : "text-neutral-700"}`}
//               >
//                 {CAPABILITY_LABELS[cap]}
//               </Text>
//             </View>
//           );
//         })}
//       </View>

//       {/* Price + CTA */}
//       <View className="flex-row justify-between items-center pt-3 border-t border-neutral-800">
//         <View>
//           <Text className="text-white text-xl font-bold">
//             ${price.toFixed(2)}
//           </Text>
//           <Text className="text-neutral-500 text-xs">{cycleLabel}</Text>
//         </View>

//         <Pressable
//           onPress={isActive && !isCancelled ? undefined : onSelect}
//           disabled={isLoading || (isActive && !isCancelled)}
//           className={`px-5 py-2.5 rounded-xl ${
//             isActive && !isCancelled
//               ? "bg-neutral-800"
//               : TIER_BUTTON_COLORS[tier.id]
//           }`}
//         >
//           <Text className="text-white text-sm font-semibold">
//             {isLoading ? "..." : ctaLabel}
//           </Text>
//         </Pressable>
//       </View>
//     </Pressable>
//   );
// }

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
  /** Live, localized App Store price string from RevenueCat (e.g. "$29.99") — takes
   * priority over tier.price so what's shown always matches what Apple actually charges. */
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

const SAVINGS: Partial<Record<BillingCycle, string>> = {
  annual: "Save ~33%",
  oneTime: "Best Value",
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
  const price = tier.price[billingCycle];
  const saving = SAVINGS[billingCycle];
  const badge = TIER_BADGE[tier.id] ?? TIER_BADGE.explorer;
  const buttonColor = TIER_BUTTON[tier.id] ?? TIER_BUTTON.explorer;
  const accent = TIER_ACCENTS[tier.id] ?? TIER_ACCENTS.explorer;

  const ctaLabel = isActive
    ? isCancelled
      ? "Reactivate"
      : "Current Plan"
    : "Select Plan";

  return (
    <Pressable
      onPress={isActive && !isCancelled ? undefined : onSelect}
      className={`p-5 rounded-2xl border mb-4 ${
        isActive
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
          {isActive && (
            <View className={`px-2 py-0.5 rounded-full ${badge.bg}`}>
              <Text className={`text-xs font-medium ${badge.text}`}>
                {isCancelled ? "Cancelling" : "Active"}
              </Text>
            </View>
          )}
          {saving && !isActive && (
            <View className="px-2 py-0.5 bg-emerald-500/10 rounded-full">
              <Text className="text-emerald-400 text-xs font-medium">
                {saving}
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
          <Text className="text-white text-xl font-bold">
            {livePriceLabel ?? `$${price?.toFixed(2) ?? "—"}`}
          </Text>
          <Text className="text-neutral-500 text-xs">
            {CYCLE_LABEL[billingCycle]}
          </Text>
        </View>
        <Pressable
          onPress={isActive && !isCancelled ? undefined : onSelect}
          disabled={isLoading || (isActive && !isCancelled)}
          className={`px-5 py-2.5 rounded-xl ${
            isActive && !isCancelled ? "bg-neutral-800" : buttonColor
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
