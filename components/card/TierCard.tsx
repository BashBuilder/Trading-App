import { TierDefinition } from "@/config/tier";
import { Pressable, Text, View } from "react-native";

interface TierCardProps {
  tier: TierDefinition;
  onSelect: () => void;
}

export function TierCard({ tier, onSelect }: TierCardProps) {
  return (
    <View className="flex-1">
      <View className="bg-indigo-600 p-6 rounded-3xl mb-6">
        <Text className="text-white text-xl font-bold"> {tier.name} </Text>
        {/* <View className="flex-row justify-between">
          <Text className="text-white  text-sm">
            Weekly: {tier.price.weekly}
          </Text>
          <Text className="text-white  text-sm">
            Monthly: {tier.price.monthly}
          </Text>
        </View> */}

        <Text className="text-white mt-2">{tier.price.monthly} / month</Text>
      </View>

      <View className="bg-slate-900 p-6 rounded-3xl mb-6">
        <Text className="text-white mb-2">✔ {tier.description}</Text>
        {/* <Text className="text-white mb-2">✔ Advanced analytics</Text>
        <Text className="text-white mb-2">✔ AI trade signals</Text>
        <Text className="text-white">✔ Real-time alerts</Text> */}
      </View>

      <Pressable className="bg-emerald-600 p-4 rounded-2xl items-center">
        <Text className="text-white font-semibold">Upgrade Now</Text>
      </Pressable>
    </View>
    // <View className="border border-neutral-700 rounded-xl p-4 gap-3">
    //   <Text className="text-white text-lg font-semibold">{tier.name}</Text>

    //   <Text className="text-neutral-300 text-sm">{tier.description}</Text>

    //   <View className="flex-row justify-between">
    //     <Text className="text-neutral-400 text-sm">
    //       Weekly: {tier.price.weekly}
    //     </Text>
    //     <Text className="text-neutral-400 text-sm">
    //       Monthly: {tier.price.monthly}
    //     </Text>
    //   </View>

    //   <Pressable
    //     onPress={onSelect}
    //     className="mt-2 bg-white py-2 rounded-lg items-center"
    //   >
    //     <Text className="text-black font-medium">Continue</Text>
    //   </Pressable>
    // </View>
  );
}
