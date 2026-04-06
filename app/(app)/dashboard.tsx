import SignalPreviewCard from "@/components/signal-preview";
import { TIER_DISPLAY } from "@/constants/constants";
import { TIER_COLORS } from "@/constants/profile";
import { useAppSelector } from "@/hooks/hooks";
import { updateSubscription } from "@/hooks/processes/subscription-reducer";
import { Signal, signalService } from "@/services/signal.service";
import { subscriptionService } from "@/services/subscription.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
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

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { subscription } = useAppSelector((state) => state.subscription);

  const fetchData = async () => {
    try {
      const [sigs, sub] = await Promise.all([
        signalService.getAll(),
        subscriptionService.getCurrent(),
      ]);
      setSignals(sigs);
      dispatch(updateSubscription(sub));
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
          <View className="flex-row items-center gap-2">
            <Image
              source={require("../../assets/images/elite-scope-icon.png")}
              alt="EliteScope"
              className="w-8 h-16"
            />
            <Text className="text-white text-2xl font-bold mt-0.5">
              Elite Scope Market Intelligence
            </Text>
          </View>
        </View>

        {/* ── Subscription banner / nudge ── */}
        {subscription?.status === "active" && tierColors ? (
          <View
            className={`flex-row items-center justify-between px-4 py-2.5 rounded-xl border ${tierColors?.border || ""} ${tierColors.bg} mb-5`}
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

// -----------
