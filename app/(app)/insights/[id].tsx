// app/(app)/signal/[id].tsx
import { Signal, signalService } from "@/services/signal.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const TIER_COLORS = {
  explorer: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
  strategist: {
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
  },
  mathematician: {
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
};

const TIER_DISPLAY = {
  explorer: "The Explorer",
  strategist: "The Strategist",
  mathematician: "The Mathematician",
};

function PriceLevel({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null;
  color: string;
}) {
  return (
    <View className="flex-1 items-center bg-neutral-900 border border-neutral-800 rounded-xl p-3">
      <Text className="text-neutral-500 text-xs mb-1">{label}</Text>
      <Text className={`font-bold text-base ${color}`}>
        {value != null ? value.toLocaleString() : "—"}
      </Text>
    </View>
  );
}

function LockedDetailBanner({ tier }: { tier: string }) {
  const router = useRouter();
  return (
    <View className="bg-neutral-900 border border-indigo-500/20 rounded-2xl p-6 items-center mb-5">
      <Text className="text-3xl mb-3">🔒</Text>
      <Text className="text-white font-semibold text-base text-center mb-1">
        Detail Access Restricted
      </Text>
      <Text className="text-neutral-500 text-sm text-center mb-4 leading-5">
        You need {TIER_DISPLAY[tier as keyof typeof TIER_DISPLAY] ?? tier} to
        view entry levels, analyst notes, and chart analysis.
      </Text>
      <Pressable
        onPress={() => router.push("/(app)/paywall")}
        className="px-6 py-3 bg-indigo-600 rounded-xl"
      >
        <Text className="text-white font-semibold">Upgrade Plan</Text>
      </Pressable>
    </View>
  );
}

export default function SignalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSignal();
  }, [id]);

  const loadSignal = async () => {
    try {
      setLoading(true);
      // Try full detail fetch first
      const data = await signalService.getById(id);
      setSignal(data);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        // Tier-gated — load from list to show preview
        try {
          const list = await signalService.getAll();
          const found = list.find((s) => s.id === id);
          if (found) setSignal(found);
          else setError("Signal not found.");
        } catch {
          setError("Unable to load signal.");
        }
      } else {
        setError("Unable to load signal.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator color="#6366f1" size="large" />
      </View>
    );
  }

  if (error || !signal) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center px-6">
        <Text className="text-neutral-400 text-center">
          {error ?? "Signal not found."}
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-indigo-400">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const isLong = signal.direction === "Long";
  const hasFullAccess = signal.accessLevel === "full";
  const tierColor = TIER_COLORS[signal.tier] ?? TIER_COLORS.explorer;

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="pt-14 px-6 pb-4 border-b border-neutral-800">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="p-1">
            <Text className="text-indigo-400 text-base">← Back</Text>
          </Pressable>

          <View
            className={`px-3 py-1 rounded-full border ${tierColor.border} ${tierColor.bg}`}
          >
            <Text className={`text-xs font-semibold ${tierColor.text}`}>
              {TIER_DISPLAY[signal.tier] ?? signal.tier}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View className="flex-row items-center justify-between mt-4">
          <View>
            <Text className="text-white text-2xl font-bold">{signal.pair}</Text>
            <View className="flex-row items-center gap-2 mt-1">
              <View className="px-2 py-0.5 bg-neutral-800 rounded-md">
                <Text className="text-neutral-400 text-xs">
                  {signal.timeframe}
                </Text>
              </View>
              <Text className="text-neutral-600 text-xs">
                {signal.time
                  ? new Date(signal.time).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </Text>
            </View>
          </View>

          <View
            className={`px-4 py-2 rounded-xl ${isLong ? "bg-emerald-500/15 border border-emerald-500/25" : "bg-red-500/15 border border-red-500/25"}`}
          >
            <Text
              className={`text-lg font-bold ${isLong ? "text-emerald-400" : "text-red-400"}`}
            >
              {signal.direction}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Confidence */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-neutral-400 text-sm">Confidence Level</Text>
            <Text className="text-white font-bold">{signal.confidence}%</Text>
          </View>
          <View className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <View
              style={{ width: `${signal.confidence}%` }}
              className={`h-2 rounded-full ${
                signal.confidence >= 80
                  ? "bg-emerald-500"
                  : signal.confidence >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
          </View>
        </View>

        {/* Summary */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4">
          <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-2">
            Summary
          </Text>
          <Text className="text-neutral-200 leading-5">{signal.summary}</Text>
        </View>

        {/* Price levels — full access only */}
        {hasFullAccess ? (
          <>
            <View className="flex-row gap-3 mb-4">
              <PriceLevel
                label="Entry"
                value={signal.entry}
                color="text-white"
              />
              <PriceLevel
                label="Stop Loss"
                value={signal.stopLoss}
                color="text-red-400"
              />
              <PriceLevel
                label="Take Profit"
                value={signal.takeProfit}
                color="text-emerald-400"
              />
            </View>

            {/* Chart image */}
            {signal.chartImageUrl && (
              <View className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-4">
                <Text className="text-neutral-500 text-xs uppercase tracking-widest p-4 pb-2">
                  Chart Analysis
                </Text>
                <Image
                  source={{ uri: signal.chartImageUrl }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Analyst notes */}
            {signal.analystNotes && (
              <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4">
                <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-2">
                  Analyst Notes
                </Text>
                <Text className="text-neutral-300 leading-6 text-sm">
                  {signal.analystNotes}
                </Text>
              </View>
            )}
          </>
        ) : (
          <LockedDetailBanner tier={signal.tier} />
        )}

        {/* Risk disclaimer */}
        <Text className="text-neutral-700 text-xs text-center leading-4 mt-2 px-4">
          Trading involves significant risk. This signal is for informational
          purposes only and does not constitute financial advice.
        </Text>
      </ScrollView>
    </View>
  );
}
