import { Signal } from "@/services/signal.service";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function SignalPreviewCard({
  signal,
  onPress,
}: {
  signal: Signal;
  onPress: () => void;
}) {
  const router = useRouter();
  const isLong = signal.direction === "Long";
  const isLocked = signal.accessLevel !== "full";

  // Locked — show only pair + timeframe + lock, nothing else
  if (isLocked) {
    return (
      <Pressable
        onPress={() => router.push("/(app)/paywall")}
        className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-4 mb-3 flex-row justify-between items-center"
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-neutral-600 font-bold">{signal.pair}</Text>
          <Text className="text-neutral-700 text-xs">{signal.timeframe}</Text>
          {/* <Text className="text-neutral-700 text-xs">{signal.timeframe}</Text> */}
          <Text className="text-neutral-600 text-xs capitalize">
            {signal.time
              ? new Date(signal.time).toLocaleTimeString("en-US", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  // timeZoneName: "short",
                })
              : "—"}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="px-2 py-0.5 bg-neutral-800 rounded-md">
            <Text className="text-neutral-600 text-xs capitalize">
              {signal.tier}
            </Text>
          </View>
          <Text className="text-neutral-600 text-sm">🔒</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-3"
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-white font-bold">{signal.pair}</Text>
          <Text className="text-neutral-600 text-xs">{signal.timeframe}</Text>
        </View>

        <View
          className={`px-2.5 py-0.5 rounded-lg ${isLong ? "bg-emerald-500/15" : "bg-red-500/15"}`}
        >
          <Text
            className={`text-xs font-semibold ${isLong ? "text-emerald-400" : "text-red-400"}`}
          >
            {signal.direction}
          </Text>
        </View>
      </View>

      {/* Confidence bar */}
      <View className="h-1 bg-neutral-800 rounded-full overflow-hidden mb-2">
        <View
          style={{ width: `${signal.confidence}%` }}
          className={`h-1 rounded-full ${isLong ? "bg-emerald-500" : "bg-red-500"}`}
        />
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-neutral-500 text-xs" numberOfLines={1}>
          {signal.summary}
        </Text>
      </View>
    </Pressable>
  );
}
