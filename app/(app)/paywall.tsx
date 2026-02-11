import { TierCard } from "@/components/card/TierCard";
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
    <ScrollView
      className="flex-1 bg-black py-6 "
      contentContainerClassName="p-6 gap-6"
    >
      {/* Header */}
      <View className="gap-2">
        <Text className="text-white text-2xl font-semibold">EliteScope</Text>
        <Text className="text-neutral-400 text-sm">
          Analytical tools for structured market observation.
        </Text>
      </View>

      {/* Tiers */}
      <View className="gap-4">
        {Object.values(TIERS).map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            onSelect={async () => {
              await purchaseSubscription(tier.id);
              subscription.activate(tier.id);
            }}
          />
        ))}
      </View>

      {/* Restore */}
      <Pressable
        onPress={async () => {
          await restorePurchases();
        }}
        className="items-center mt-4"
      >
        <Text className="text-neutral-400 text-sm underline">
          Restore Purchases
        </Text>
      </Pressable>

      {/* Legal */}
      <View className="items-center gap-2 mt-6">
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
      </View>
    </ScrollView>
  );
}
