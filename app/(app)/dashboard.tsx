// app/(app)/dashboard.tsx
import { useAppSelector } from "@/hooks/hooks";
import { Signal, signalService } from "@/services/signal.service";
import {
  Subscription,
  subscriptionService,
} from "@/services/subscription.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function MarketRegimeCard() {
  // In production: fetch from a dedicated /market/regime endpoint
  const regimes = [
    { label: "Overall Bias", value: "Bullish", color: "text-emerald-400" },
    { label: "Volatility", value: "Moderate", color: "text-yellow-400" },
    { label: "Session", value: "London", color: "text-cyan-400" },
  ];

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-5 overflow-hidden">
      {/* Top accent */}
      <View className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500/50" />

      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-neutral-500 text-xs uppercase tracking-widest">
            Market Regime
          </Text>
          <Text className="text-white text-2xl font-bold mt-1">Mixed</Text>
        </View>
        <View className="px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <Text className="text-emerald-400 text-xs font-medium">Live</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        {regimes.map((r) => (
          <View key={r.label} className="items-center">
            <Text className={`text-sm font-semibold ${r.color}`}>
              {r.value}
            </Text>
            <Text className="text-neutral-600 text-xs mt-0.5">{r.label}</Text>
          </View>
        ))}
      </View>

      <Text className="text-neutral-700 text-xs mt-4">Updated {timeStr}</Text>
    </View>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
      <Text className="text-neutral-500 text-xs mb-1">{label}</Text>
      <Text className="text-white text-xl font-bold">{value}</Text>
      {sub && <Text className="text-neutral-600 text-xs mt-0.5">{sub}</Text>}
    </View>
  );
}

function SignalPreviewCard({
  signal,
  onPress,
}: {
  signal: Signal;
  onPress: () => void;
}) {
  const isLong = signal.direction === "Long";
  const isLocked = signal.accessLevel !== "full";

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
        <Text className="text-neutral-500 text-xs">{signal.summary}</Text>
        {isLocked && (
          <View className="px-2 py-0.5 bg-neutral-800 rounded-md">
            <Text className="text-neutral-500 text-xs">🔒</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [sigs, sub] = await Promise.all([
        signalService.getAll(),
        subscriptionService.getCurrent(),
      ]);
      setSignals(sigs);
      setSubscription(sub);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const activeSignals = signals.filter((s) => s.accessLevel === "full").length;
  const tierColors = subscription?.tierId
    ? TIER_COLORS[subscription.tierId]
    : null;

  return (
    <View className="flex-1 bg-slate-950 px-6 pt-14">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
      >
        {/* ── Header ── */}
        <View className="mb-6">
          <Text className="text-neutral-500 text-sm">
            {getGreeting()}, {user?.firstName ?? "Trader"}
          </Text>
          <Text className="text-white text-2xl font-bold mt-0.5">
            Market Intelligence
          </Text>
        </View>

        {/* ── Subscription banner / nudge ── */}
        {subscription?.status === "active" && tierColors ? (
          <View
            className={`flex-row items-center justify-between px-4 py-2.5 rounded-xl border ${tierColors.border} ${tierColors.bg} mb-5`}
          >
            <Text className={`text-xs font-semibold ${tierColors.text}`}>
              {TIER_DISPLAY[subscription.tierId]}
            </Text>
            <Pressable onPress={() => router.push("/(app)/paywall")}>
              <Text className="text-neutral-500 text-xs">Manage →</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => router.push("/(app)/paywall")}
            className="bg-indigo-600/15 border border-indigo-500/30 rounded-xl px-4 py-3 mb-5 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-indigo-300 text-sm font-semibold">
                No active plan
              </Text>
              <Text className="text-indigo-400/60 text-xs mt-0.5">
                Unlock full signal access
              </Text>
            </View>
            <Text className="text-indigo-400 text-xs font-semibold">
              View Plans →
            </Text>
          </Pressable>
        )}

        {/* ── Market regime ── */}
        <MarketRegimeCard />

        {/* ── Stats row ── */}
        <View className="flex-row gap-3 mb-5">
          <StatCard
            label="Live Signals"
            value={String(signals.length)}
            sub="across all tiers"
          />
          <StatCard
            label="Your Access"
            value={String(activeSignals)}
            sub="signals unlocked"
          />
        </View>

        {/* ── Active instruments ── */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white font-semibold">
              Active Opportunities
            </Text>
            <Pressable onPress={() => router.push("/(app)/insights")}>
              <Text className="text-indigo-400 text-xs">View all →</Text>
            </Pressable>
          </View>

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator color="#6366f1" />
            </View>
          ) : signals.length === 0 ? (
            <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 items-center">
              <Text className="text-neutral-500 text-sm">
                No active signals
              </Text>
            </View>
          ) : (
            signals.slice(0, 4).map((signal) => (
              <SignalPreviewCard
                key={signal.id}
                signal={signal}
                // onPress={() => router.push(`/(app)/signal/${signal.id}`)}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/insights/[id]",
                    params: { id: signal.id },
                  })
                }
              />
            ))
          )}
        </View>

        {/* ── Quick tools ── */}
        <View>
          <Text className="text-white font-semibold mb-3">Quick Access</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.push("/(app)/tools")}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4"
            >
              <Text className="text-2xl mb-1">⚙️</Text>
              <Text className="text-white text-sm font-medium">Tools</Text>
              <Text className="text-neutral-600 text-xs">Risk & Scanner</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/(app)/insights")}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-4"
            >
              <Text className="text-2xl mb-1">📡</Text>
              <Text className="text-white text-sm font-medium">Signals</Text>
              <Text className="text-neutral-600 text-xs">All live signals</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
