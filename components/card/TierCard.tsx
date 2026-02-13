// import { TierDefinition } from "@/config/tier";
// import { Pressable, Text, View } from "react-native";

// interface TierCardProps {
//   tier: TierDefinition;
//   onSelect: () => void;
// }

// export function TierCard({ tier, onSelect }: TierCardProps) {
//   return (
//     <View className="flex-1">
//       <View className="bg-indigo-600 p-6 rounded-3xl mb-6">
//         <Text className="text-white text-xl font-bold"> {tier.name} </Text>

//         <Text className="text-white mt-2">{tier.price.monthly} / month</Text>
//       </View>

//       <View className="bg-slate-900 p-6 rounded-3xl mb-6">
//         <Text className="text-white mb-2">✔ {tier.description}</Text>

//       </View>

//       <Pressable className="bg-emerald-600 p-4 rounded-2xl items-center">
//         <Text className="text-white font-semibold">Upgrade Now</Text>
//       </Pressable>
//     </View>

//   );
// }

import { TierDefinition } from "@/config/tier";
import { Pressable, Text, View } from "react-native";

interface TierCardProps {
  tier: TierDefinition;
  onSelect: () => void;
  isActive?: boolean;
}

export function TierCard({ tier, onSelect, isActive }: TierCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      className={`p-6 rounded-2xl border mb-5 ${
        isActive
          ? "bg-neutral-900 border-indigo-500"
          : "bg-neutral-900 border-neutral-800"
      }`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-white text-lg font-semibold">{tier.name}</Text>

          <Text className="text-neutral-400 text-sm mt-1 max-w-xs">
            {tier.description}
          </Text>
        </View>

        {isActive && (
          <View className="px-3 py-1 bg-neutral-800 rounded-full">
            <Text className="text-indigo-400 text-xs">Active</Text>
          </View>
        )}
      </View>

      {/* Features (if available) */}
      {/* {tier.features && (
        <View className="mb-5">
          {tier.features.map((feature: string, index: number) => (
            <Text key={index} className="text-neutral-400 text-sm mb-2">
              • {feature}
            </Text>
          ))}
        </View> */}
      {/* )} */}

      {/* Price + CTA */}
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-white text-lg font-medium">
          {tier.price.monthly} / month
        </Text>

        <View
          className={`px-4 py-2 rounded-xl ${
            isActive ? "bg-neutral-800" : "bg-indigo-600"
          }`}
        >
          <Text className="text-white text-sm font-medium">
            {isActive ? "Current Plan" : "Continue"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
