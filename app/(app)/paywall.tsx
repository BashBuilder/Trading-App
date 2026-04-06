// app/(app)/paywall.tsx
import { TierCard } from "@/components/card/TierCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import { LINKS } from "@/config/links";
import { BILLING_CYCLES } from "@/constants/constants";
import { useAppSelector } from "@/hooks/hooks";
import { updateSubscription } from "@/hooks/processes/subscription-reducer";
import { subscriptionService } from "@/services/subscription.service";
import { BillingCycle, Tier } from "@/services/tier.service";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function PaywallScreen() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [loadingTierId, setLoadingTierId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const { subscription } = useAppSelector((state) => state.subscription);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setPageLoading(true);
      const [tiersData, subData] = await Promise.all([
        subscriptionService.getTiers(),
        subscriptionService.getCurrent(),
      ]);
      setTiers(tiersData);
      dispatch(updateSubscription(subData));
    } catch (err) {
      Alert.alert("Error", "Failed to load subscription data.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubscribe = async (tierId: string) => {
    // If already active on same tier, do nothing
    if (subscription?.tierId === tierId && subscription?.status === "active")
      return;

    Alert.alert(
      "Confirm Subscription",
      `Subscribe to ${tiers.find((t) => t.id === tierId)?.name} (${billingCycle})?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setLoadingTierId(tierId);
              const sub = await subscriptionService.subscribe(
                tierId as any,
                billingCycle,
              );
              dispatch(updateSubscription(sub));
              // setCurrentSub(sub);
              Alert.alert("Success", "Your subscription is now active.");
            } catch (error: any) {
              Alert.alert(
                "Error",
                JSON.stringify(error.response?.data?.message || error.body) ||
                  "Subscription failed. Please try again.",
              );
            } finally {
              setLoadingTierId(null);
            }
          },
        },
      ],
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Subscription",
      "Your access will continue until the end of the current billing period. Are you sure?",
      [
        { text: "Keep Plan", style: "cancel" },
        {
          text: "Cancel Plan",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelling(true);
              await subscriptionService.cancel();
              dispatch(
                updateSubscription(
                  subscription
                    ? { ...subscription, status: "cancelled" }
                    : null,
                ),
              );
              Alert.alert(
                "Cancelled",
                "Your subscription has been cancelled. Access remains until the billing period ends.",
              );
            } catch {
              Alert.alert("Error", "Failed to cancel. Please try again.");
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    return new Date(expiresAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ScreenWrapper
      onRefresh={fetchData}
      refreshing={pageLoading}
      title="EliteScope Access"
    >
      {pageLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6366f1" size="large" />
          <Text className="text-neutral-500 mt-4 text-sm">
            Loading plans...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Intro */}
          <Text className="text-neutral-400 leading-6 mb-6 text-sm">
            Structured analytical tools for disciplined market observation.
            Unlock full access with a tier that matches your strategy.
          </Text>

          {/* Current plan banner */}
          {subscription && subscription.status !== "expired" && (
            <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-neutral-400 text-xs uppercase tracking-widest mb-1">
                    Current Plan
                  </Text>
                  <Text className="text-white font-semibold text-base">
                    {subscription.tierName}
                  </Text>
                  <Text className="text-neutral-500 text-xs mt-0.5 capitalize">
                    {subscription.billingCycle === "oneTime"
                      ? "Lifetime access"
                      : `${subscription.billingCycle} · Renews ${formatExpiry(subscription.expiresAt)}`}
                  </Text>
                </View>

                <View
                  className={`px-3 py-1 rounded-full ${
                    subscription.status === "cancelled"
                      ? "bg-red-500/10"
                      : "bg-emerald-500/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium capitalize ${
                      subscription.status === "cancelled"
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {subscription.status}
                  </Text>
                </View>
              </View>

              {/* Cancel link — only show if active and not lifetime */}
              {subscription.status === "active" &&
                subscription.billingCycle !== "oneTime" && (
                  <Pressable
                    onPress={handleCancel}
                    disabled={cancelling}
                    className="mt-3 pt-3 border-t border-neutral-800"
                  >
                    <Text className="text-red-400 text-xs">
                      {cancelling ? "Cancelling..." : "Cancel subscription"}
                    </Text>
                  </Pressable>
                )}
            </View>
          )}

          {/* Billing cycle toggle */}
          <View className="flex-row bg-neutral-900 border border-neutral-800 rounded-xl p-1 mb-6">
            {BILLING_CYCLES.map(({ key, label }) => (
              <Pressable
                key={key}
                onPress={() => setBillingCycle(key)}
                className={`flex-1 py-2 rounded-lg items-center ${
                  billingCycle === key ? "bg-neutral-700" : ""
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    billingCycle === key ? "text-white" : "text-neutral-500"
                  }`}
                >
                  {label}
                </Text>
                {key === "annual" && (
                  <Text className="text-emerald-400 text-[9px] mt-0.5">
                    33% off
                  </Text>
                )}
                {key === "oneTime" && (
                  <Text className="text-violet-400 text-[9px] mt-0.5">
                    Best value
                  </Text>
                )}
              </Pressable>
            ))}
          </View>

          {/* Tier cards */}
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              billingCycle={billingCycle}
              isActive={
                subscription?.tierId === tier.id &&
                subscription?.status !== "expired"
              }
              isCancelled={
                subscription?.tierId === tier.id &&
                subscription?.status === "cancelled"
              }
              isLoading={loadingTierId === tier.id}
              onSelect={() => handleSubscribe(tier.id)}
            />
          ))}

          {/* Restore */}
          <Pressable onPress={fetchData} className="items-center mt-2 mb-6">
            <Text className="text-neutral-500 text-xs underline">
              Restore Purchases
            </Text>
          </Pressable>

          {/* Legal */}
          <View className="items-center gap-3">
            <View className="flex-row gap-4">
              <Pressable onPress={() => Linking.openURL(LINKS.privacyPolicy)}>
                <Text className="text-neutral-600 text-xs underline">
                  Privacy Policy
                </Text>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(LINKS.termsOfUse)}>
                <Text className="text-neutral-600 text-xs underline">
                  Terms of Use
                </Text>
              </Pressable>
            </View>
            <Text className="text-neutral-700 text-xs text-center px-6 leading-4">
              Subscriptions renew automatically unless cancelled at least 24
              hours before the end of the billing period. No guarantees of
              financial outcomes are made.
            </Text>
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}
