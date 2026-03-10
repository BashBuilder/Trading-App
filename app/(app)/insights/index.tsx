// app/(app)/insights.tsx
// import { SignalCard } from "@/components/signal-card/SignalCard";
import { SignalCard } from "@/components/card/SignalCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Signal, SignalTier, signalService } from "@/services/signal.service";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

type Filter = "All" | "Explorer" | "Strategist" | "Mathematician" | "Unlocked";

const FILTERS: Filter[] = [
  "All",
  "Unlocked",
  "Explorer",
  "Strategist",
  "Mathematician",
];

const TIER_MAP: Record<string, SignalTier> = {
  Explorer: "explorer",
  Strategist: "strategist",
  Mathematician: "mathematician",
};

export default function InsightsScreen() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSignals = async () => {
    try {
      const data = await signalService.getAll();
      setSignals(data);
    } catch {
      // handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSignals();
  };

  const filtered =
    activeFilter === "All"
      ? signals
      : activeFilter === "Unlocked"
        ? signals.filter((s) => s.accessLevel === "full")
        : signals.filter((s) => s.tier === TIER_MAP[activeFilter]);

  const unlockedCount = signals.filter((s) => s.accessLevel === "full").length;

  return (
    <ScreenWrapper title="Market Signals">
      {/* Sub-header */}
      <Text className="text-neutral-500 text-sm mb-5 -mt-2">
        Institutional-grade trading insights
      </Text>

      {/* Stats strip */}
      <View className="flex-row gap-3 mb-5">
        <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5">
          <Text className="text-white font-bold text-lg">{signals.length}</Text>
          <Text className="text-neutral-500 text-xs">Live signals</Text>
        </View>
        <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5">
          <Text className="text-emerald-400 font-bold text-lg">
            {unlockedCount}
          </Text>
          <Text className="text-neutral-500 text-xs">Unlocked</Text>
        </View>
        <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5">
          <Text className="text-neutral-400 font-bold text-lg">
            {signals.length - unlockedCount}
          </Text>
          <Text className="text-neutral-500 text-xs">Locked</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-5"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f)}
              className={`px-4 py-2 mr-2 rounded-xl border ${
                active
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-neutral-900 border-neutral-800"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  active ? "text-white" : "text-neutral-400"
                }`}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Signal list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
      >
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator color="#6366f1" size="large" />
            <Text className="text-neutral-500 mt-3 text-sm">
              Loading signals...
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-neutral-600 text-4xl mb-3">📡</Text>
            <Text className="text-neutral-400 text-sm">No signals found</Text>
          </View>
        ) : (
          filtered.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
