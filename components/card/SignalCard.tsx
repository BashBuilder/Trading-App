// components/signal-card/SignalCard.tsx
import { AccessLevel, Signal } from "@/services/signal.service";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const TIER_LABELS: Record<string, string> = {
  explorer: "Explorer",
  strategist: "Strategist",
  mathematician: "Mathematician",
};

const TIER_COLORS: Record<string, { text: string; bg: string }> = {
  explorer: { text: "text-cyan-400", bg: "bg-cyan-500/10" },
  strategist: { text: "text-indigo-400", bg: "bg-indigo-500/10" },
  mathematician: { text: "text-violet-400", bg: "bg-violet-500/10" },
};

const REQUIRED_TIER: Record<string, string> = {
  explorer: "Explorer",
  strategist: "Strategist",
  mathematician: "Mathematician",
};

function LockOverlay({
  accessLevel,
  tier,
}: {
  accessLevel: AccessLevel;
  tier: string;
}) {
  const router = useRouter();
  const isFullLock = accessLevel === "locked";

  return (
    <View
      className={`absolute inset-0 rounded-2xl items-center justify-center ${
        isFullLock ? "bg-slate-950/85" : "bg-slate-950/60"
      }`}
    >
      <Text className="text-2xl mb-2">🔒</Text>
      <Text className="text-white text-sm font-semibold text-center px-6">
        {isFullLock
          ? `${REQUIRED_TIER[tier]} tier required`
          : "Upgrade to view details"}
      </Text>
      <Text className="text-neutral-500 text-xs text-center mt-1 px-8">
        {isFullLock
          ? "Subscribe to unlock this signal"
          : "Your plan can see this signal but not the details"}
      </Text>
      <Pressable
        onPress={() => router.push("/(app)/paywall")}
        className="mt-3 px-5 py-2 bg-indigo-600 rounded-xl"
      >
        <Text className="text-white text-xs font-semibold">Upgrade Plan</Text>
      </Pressable>
    </View>
  );
}

export function SignalCard({ signal }: { signal: Signal }) {
  const router = useRouter();
  const isLong = signal.direction === "Long";
  const tierColor = TIER_COLORS[signal.tier];
  const isLocked = signal.accessLevel !== "full";

  const handlePress = () => {
    if (signal.accessLevel === "full") {
      // router.push(`/(app)/signal/${signal.id}`);
      // router.push(`/(app)/signal/${signal.id}`);
      router.push({
        pathname: "/(app)/signal/[id]",
        params: { id: signal.id },
      });
    } else if (signal.accessLevel === "preview") {
      router.push({
        pathname: "/(app)/signal/[id]",
        params: { id: signal.id },
      });
      // router.push(`/(app)/signal/${signal.id}`);
    }
    // locked: do nothing, overlay handles upgrade
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-4 overflow-hidden relative"
    >
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-white font-bold text-base">{signal.pair}</Text>
          <View className="px-2 py-0.5 bg-neutral-800 rounded-md">
            <Text className="text-neutral-400 text-xs">{signal.timeframe}</Text>
          </View>
        </View>

        <View
          className={`px-3 py-1 rounded-lg ${isLong ? "bg-emerald-500/15" : "bg-red-500/15"}`}
        >
          <Text
            className={`text-sm font-semibold ${isLong ? "text-emerald-400" : "text-red-400"}`}
          >
            {signal.direction}
          </Text>
        </View>
      </View>

      {/* Confidence */}
      <View className="mb-3">
        <View className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <View
            style={{ width: `${signal.confidence}%` }}
            className={`h-1.5 rounded-full ${isLong ? "bg-emerald-500" : "bg-red-400"}`}
          />
        </View>
        <Text className="text-neutral-500 text-xs mt-1">
          Confidence {signal.confidence}%
        </Text>
      </View>

      {/* Summary */}
      <Text className="text-neutral-400 text-sm mb-3" numberOfLines={2}>
        {signal.summary}
      </Text>

      {/* Footer */}
      <View className="flex-row justify-between items-center">
        <View className={`px-2.5 py-0.5 rounded-full ${tierColor.bg}`}>
          <Text className={`text-xs font-medium ${tierColor.text}`}>
            {TIER_LABELS[signal.tier]}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="text-neutral-600 text-xs">
            {signal.time
              ? new Date(signal.time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })
              : "—"}
          </Text>
          {!isLocked && (
            <View className="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/20 rounded-lg">
              <Text className="text-indigo-400 text-xs font-medium">
                Details →
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Lock overlay */}
      {isLocked && (
        <LockOverlay accessLevel={signal.accessLevel} tier={signal.tier} />
      )}
    </Pressable>
  );
}
