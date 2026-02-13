import { TierCard } from "@/components/card/TierCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import { LINKS } from "@/config/links";
import { TIERS } from "@/config/tier";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import {
  purchaseSubscription,
  restorePurchases,
} from "../../features/subscription/subscription.service";
import { useSubscriptionStore } from "../../features/subscription/subscription.store";

export default function PaywallScreen() {
  const subscription = useSubscriptionStore();

  return (
    <ScreenWrapper title="EliteScope Access">
      {/* Intro */}
      <View className="mt-2 mb-8">
        <Text className="text-neutral-400 leading-6">
          EliteScope provides structured analytical tools designed for
          disciplined market observation. Subscription unlocks full access to
          tier-specific analytical modules.
        </Text>
      </View>

      {/* Tiers */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {Object.values(TIERS).map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            // isActive={subscription.activeTier === tier.id}
            onSelect={async () => {
              // if (subscription.activeTier === tier.id) return;

              await purchaseSubscription(tier.id);
              subscription.activate(tier.id);
            }}
          />
        ))}

        {/* Restore */}
        <Pressable
          onPress={async () => {
            await restorePurchases();
          }}
          className="items-center mt-6"
        >
          <Text className="text-neutral-400 text-sm underline">
            Restore Purchases
          </Text>
        </Pressable>

        {/* Legal */}
        <View className="items-center gap-3 mt-8">
          <Pressable onPress={() => Linking.openURL(LINKS.privacyPolicy)}>
            <Text className="text-neutral-500 text-xs underline">
              Privacy Policy
            </Text>
          </Pressable>

          <Pressable onPress={() => Linking.openURL(LINKS.termsOfUse)}>
            <Text className="text-neutral-500 text-xs underline">
              Terms of Use
            </Text>
          </Pressable>

          <Text className="text-neutral-600 text-xs mt-2 text-center px-6">
            Subscriptions renew automatically unless cancelled at least 24 hours
            before the end of the billing period. No guarantees of financial
            outcomes are made.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
