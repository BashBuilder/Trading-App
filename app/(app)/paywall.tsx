// app/(app)/paywall.tsx
import { TierCard } from "@/components/card/TierCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import { LINKS } from "@/config/links";
import { useAppSelector } from "@/hooks/hooks";
import { updateSubscription } from "@/hooks/processes/subscription-reducer";
import {
  findPackage,
  getCurrentOffering,
  getPurchasesUnavailableReason,
  openManageSubscriptions,
  purchasePackage,
  restorePurchases,
} from "@/services/purchases.service";
import { subscriptionService } from "@/services/subscription.service";
import { Tier } from "@/services/tier.service";
import { PurchasesOffering } from "react-native-purchases";
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

// Only monthly plans exist today — see RevenueCat-Mapping.md. Weekly/annual can be
// re-enabled by restoring the billing-cycle toggle here once those products exist.
const BILLING_CYCLE = "monthly" as const;

// Maps a purchasable tier to its RevenueCat package identifier (the "custom identifier"
// convention set up in the Offering — see RevenueCat-Mapping.md).
const PACKAGE_ID_BY_TIER: Record<string, string> = {
  strategist: "strategist_monthly",
  mathematician: "mathematician_monthly",
};

// Shown when purchases can't load an offering — worded to match the actual cause instead
// of a generic "try again" that won't fix anything if the cause is the runtime itself.
const UNAVAILABLE_BANNER: Record<string, string> = {
  "native-module-missing":
    "In-app purchases can't run in Expo Go. Open a development build, TestFlight, or the App Store build to subscribe.",
  "no-api-key":
    "In-app purchases aren't configured for this build yet (missing RevenueCat API key).",
  "configure-failed":
    "In-app purchases failed to start. Restart the app — if this keeps happening, check the RevenueCat setup.",
  "no-offering":
    "Plans aren't available to purchase right now. Please try again shortly.",
};

export default function PaywallScreen() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loadingTierId, setLoadingTierId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [unavailableKey, setUnavailableKey] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { subscription } = useAppSelector((state) => state.subscription);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setPageLoading(true);
      const [tiersData, subData, currentOffering] = await Promise.all([
        subscriptionService.getTiers(),
        subscriptionService.getCurrent(),
        getCurrentOffering(),
      ]);
      setTiers(tiersData);
      setOffering(currentOffering);
      dispatch(updateSubscription(subData));

      // Work out *why* purchases might not be usable, so the banner below matches the
      // real cause instead of a generic "unavailable" the person can't act on.
      const reason = getPurchasesUnavailableReason();
      if (reason) {
        setUnavailableKey(reason);
      } else if (!currentOffering) {
        setUnavailableKey("no-offering");
      } else {
        setUnavailableKey(null);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to load subscription data.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubscribe = async (tierId: string) => {
    // Explorer is the free default tier — there's no product to purchase for it.
    // Downgrading away from a paid plan happens via Apple's subscription management (see below).
    if (tierId === "explorer") {
      Alert.alert(
        "Explorer is free",
        "Explorer is the default tier — no purchase needed. To move off a paid plan, manage your subscription through Apple.",
      );
      return;
    }

    if (subscription?.tierId === tierId && subscription?.status === "active") {
      return;
    }

    const packageId = PACKAGE_ID_BY_TIER[tierId];
    const pkg = offering?.availablePackages.find((p) => p.identifier === packageId);

    if (!pkg) {
      Alert.alert(
        "Unavailable",
        UNAVAILABLE_BANNER[unavailableKey ?? "no-offering"],
      );
      return;
    }

    setLoadingTierId(tierId);
    try {
      const result = await purchasePackage(pkg);

      if (result.status === "cancelled") {
        return; // user backed out of Apple's payment sheet — not an error
      }
      if (result.status === "error") {
        Alert.alert("Purchase failed", result.message);
        return;
      }

      // Sync immediately rather than waiting on webhook delivery to reflect the new tier.
      const synced = await subscriptionService.sync();
      const subData = await subscriptionService.getCurrent();
      dispatch(updateSubscription(subData));

      Alert.alert("Success", `You're now on the ${synced.tier} plan.`);
    } finally {
      setLoadingTierId(null);
    }
  };

  const handleManageSubscription = async () => {
    // Real App Store subscriptions can only be cancelled through Apple's own management
    // UI — apps aren't permitted to cancel them via a custom in-app flow.
    await openManageSubscriptions();
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restorePurchases();
      const synced = await subscriptionService.sync();
      const subData = await subscriptionService.getCurrent();
      dispatch(updateSubscription(subData));
      Alert.alert(
        "Restored",
        synced.tier === "explorer"
          ? "No previous purchases were found for this account."
          : `Your ${synced.tier} plan has been restored.`,
      );
    } catch {
      Alert.alert("Error", "Failed to restore purchases. Please try again.");
    } finally {
      setRestoring(false);
    }
  };

  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    return new Date(expiresAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const priceLabelFor = (tierId: string) => {
    const packageId = PACKAGE_ID_BY_TIER[tierId];
    const pkg = offering?.availablePackages.find((p) => p.identifier === packageId);
    return pkg?.product.priceString;
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

          {/* Purchases-unavailable banner — explains *why* instead of failing silently on tap */}
          {unavailableKey && (
            <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6">
              <Text className="text-amber-400 text-xs font-medium uppercase tracking-widest mb-1">
                Purchases unavailable
              </Text>
              <Text className="text-amber-200/90 text-xs leading-4">
                {UNAVAILABLE_BANNER[unavailableKey]}
              </Text>
            </View>
          )}

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
                  {subscription.tierId !== "explorer" && (
                    <Text className="text-neutral-500 text-xs mt-0.5 capitalize">
                      {subscription.billingCycle} · Renews{" "}
                      {formatExpiry(subscription.expiresAt)}
                    </Text>
                  )}
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

              {/* Manage/cancel — only for real paid subscriptions, via Apple's own UI */}
              {subscription.tierId !== "explorer" &&
                subscription.status === "active" && (
                  <Pressable
                    onPress={handleManageSubscription}
                    className="mt-3 pt-3 border-t border-neutral-800"
                  >
                    <Text className="text-red-400 text-xs">
                      Manage or cancel subscription
                    </Text>
                  </Pressable>
                )}
            </View>
          )}

          {/* Tier cards — monthly only for now */}
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              billingCycle={BILLING_CYCLE}
              isActive={
                subscription?.tierId === tier.id &&
                subscription?.status !== "expired"
              }
              isCancelled={
                subscription?.tierId === tier.id &&
                subscription?.status === "cancelled"
              }
              isLoading={loadingTierId === tier.id}
              livePriceLabel={priceLabelFor(tier.id)}
              onSelect={() => handleSubscribe(tier.id)}
            />
          ))}

          {/* Restore */}
          <Pressable
            onPress={handleRestore}
            disabled={restoring}
            className="items-center mt-2 mb-6"
          >
            <Text className="text-neutral-500 text-xs underline">
              {restoring ? "Restoring..." : "Restore Purchases"}
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
