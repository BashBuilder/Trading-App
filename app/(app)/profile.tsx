// app/(app)/profile.tsx
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAppSelector } from "@/hooks/hooks";
import {
  Subscription,
  subscriptionService,
} from "@/services/subscription.service";
import { clearToken } from "@/services/token.service";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const TIER_COLORS: Record<
  string,
  { accent: string; bg: string; text: string }
> = {
  explorer: {
    accent: "border-cyan-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
  },
  strategist: {
    accent: "border-indigo-500",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
  },
  mathematician: {
    accent: "border-violet-500",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
  },
};

const CAPABILITY_LABELS: Record<string, string> = {
  coreSignals: "Core Signals",
  advancedIndicators: "Advanced Indicators",
  analytics: "Analytics",
};

function Avatar({
  firstName,
  lastName,
  onLongPress,
}: {
  firstName?: string;
  lastName?: string;
  onLongPress: () => void;
}) {
  const initials =
    [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() ||
    "?";
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <Pressable
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={800}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center border-2 border-indigo-400/40"
      >
        <Text className="text-white text-2xl font-bold">{initials}</Text>
      </Animated.View>
    </Pressable>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-3.5 border-b border-neutral-800/60">
      <Text className="text-neutral-500 text-sm">{label}</Text>
      <Text className="text-neutral-200 text-sm font-medium">{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setSubLoading(true);
      const sub = await subscriptionService.getCurrent();
      setSubscription(sub);
    } catch {
      // silently fail — not critical for profile render
    } finally {
      setSubLoading(false);
    }
  };

  const handleAdminAccess = () => {
    if (user?.role !== "admin") {
      // Silently ignore for non-admins — no hint that admin exists
      return;
    }
    Alert.alert("Admin Panel", "Access the signal management dashboard?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open Admin",
        onPress: () => router.push("/(admin)/signals"),
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await clearToken();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return "Lifetime";
    return new Date(expiresAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tierColors = subscription?.tierId
    ? TIER_COLORS[subscription.tierId]
    : null;

  const isActiveSub = subscription && subscription.status === "active";

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <ScreenWrapper title="Profile">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="mt-2"
      >
        {/* ── Avatar + name ── */}
        <View className="items-center mb-8 pt-2">
          <Avatar
            firstName={user?.firstName}
            lastName={user?.lastName}
            onLongPress={handleAdminAccess}
          />

          <Text className="text-neutral-500 text-sm mt-1">
            {user?.email || "—"}
          </Text>

          {/* Tier badge */}
          {isActiveSub && tierColors && (
            <View
              className={`mt-3 px-3 py-1 rounded-full border ${tierColors.accent} ${tierColors.bg}`}
            >
              <Text className={`text-xs font-semibold ${tierColors.text}`}>
                {subscription.tierName}
              </Text>
            </View>
          )}
        </View>

        {/* ── Account details ── */}
        <View className="mb-6">
          <Text className="text-neutral-600 text-xs uppercase tracking-widest mb-2">
            Account
          </Text>
          <View className="bg-neutral-900 rounded-2xl px-4 border border-neutral-800">
            <InfoRow label="First Name" value={user?.firstName || "—"} />
            <InfoRow label="Last Name" value={user?.lastName || "—"} />
            <InfoRow label="Email" value={user?.email || "—"} />
          </View>
        </View>

        {/* ── Subscription card ── */}
        <View className="mb-6">
          <Text className="text-neutral-600 text-xs uppercase tracking-widest mb-2">
            Subscription
          </Text>

          {subLoading ? (
            <View className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 items-center">
              <ActivityIndicator color="#6366f1" size="small" />
            </View>
          ) : isActiveSub && tierColors ? (
            // Active subscription card
            <View
              className={`bg-neutral-900 rounded-2xl border ${tierColors.accent} overflow-hidden`}
            >
              {/* Top accent strip */}
              <View className={`h-0.5 w-full ${tierColors.bg}`} />

              <View className="p-5">
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-white font-semibold text-base">
                      {subscription.tierName}
                    </Text>
                    <Text className="text-neutral-500 text-xs mt-0.5 capitalize">
                      {subscription.billingCycle === "oneTime"
                        ? "Lifetime access"
                        : `${subscription.billingCycle} plan`}
                    </Text>
                  </View>

                  <View
                    className={`px-2.5 py-1 rounded-full ${
                      subscription.status === "cancelled"
                        ? "bg-red-500/10"
                        : "bg-emerald-500/10"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold capitalize ${
                        subscription.status === "cancelled"
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {subscription.status}
                    </Text>
                  </View>
                </View>

                {/* Capabilities */}
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {subscription.capabilities.map((cap) => (
                    <View
                      key={cap}
                      className="px-2.5 py-1 bg-neutral-800 rounded-lg"
                    >
                      <Text className="text-neutral-400 text-xs">
                        {CAPABILITY_LABELS[cap] || cap}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Expiry */}
                {subscription.expiresAt && (
                  <Text className="text-neutral-600 text-xs mb-4">
                    {subscription.status === "cancelled"
                      ? "Access until"
                      : "Renews"}{" "}
                    {formatExpiry(subscription.expiresAt)}
                  </Text>
                )}

                {/* Manage button */}
                <Pressable
                  onPress={() => router.push("/(app)/paywall")}
                  className={`py-3 rounded-xl items-center ${tierColors.bg} border ${tierColors.accent}`}
                >
                  <Text className={`text-sm font-semibold ${tierColors.text}`}>
                    Manage Subscription
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            // No subscription card
            <View className="bg-neutral-900 rounded-2xl border border-neutral-800 p-5">
              <Text className="text-white font-semibold mb-1">
                No Active Plan
              </Text>
              <Text className="text-neutral-500 text-sm mb-4 leading-5">
                Unlock structured market analysis with an EliteScope
                subscription.
              </Text>
              <Pressable
                onPress={() => router.push("/(app)/paywall")}
                className="bg-indigo-600 py-3 rounded-xl items-center"
              >
                <Text className="text-white text-sm font-semibold">
                  View Plans
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── Logout ── */}
        <Pressable
          onPress={handleLogout}
          className="border border-red-500/40 bg-red-500/5 py-4 rounded-2xl items-center mt-2"
        >
          <Text className="text-red-400 font-semibold">Sign Out</Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}
