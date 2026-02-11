import { TierDefinition } from "@/config/tier";
import { Pressable, Text, View } from "react-native";

interface TierCardProps {
  tier: TierDefinition;
  onSelect: () => void;
}

export function TierCard({ tier, onSelect }: TierCardProps) {
  return (
    <View className="border border-neutral-700 rounded-xl p-4 gap-3">
      <Text className="text-white text-lg font-semibold">{tier.name}</Text>

      <Text className="text-neutral-300 text-sm">{tier.description}</Text>

      <View className="flex-row justify-between">
        <Text className="text-neutral-400 text-sm">
          Weekly: {tier.price.weekly}
        </Text>
        <Text className="text-neutral-400 text-sm">
          Monthly: {tier.price.monthly}
        </Text>
      </View>

      <Pressable
        onPress={onSelect}
        className="mt-2 bg-white py-2 rounded-lg items-center"
      >
        <Text className="text-black font-medium">Continue</Text>
      </Pressable>
    </View>
  );
}
