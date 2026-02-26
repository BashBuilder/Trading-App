import { Pressable, Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function Tools() {
  return (
    <ScreenWrapper title="Trading Tools">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-neutral-400">Current Tier</Text>
        <View className="px-3 py-1 bg-neutral-800 rounded-full">
          <Text className="text-indigo-400 text-sm">The Mathematician</Text>
        </View>
      </View>

      <View className="bg-neutral-900 p-6 rounded-2xl mb-6">
        <Text className="text-white text-lg font-medium mb-3">
          Structured Market Scan
        </Text>

        <Text className="text-neutral-400 mb-6">
          Analyze structural movement across selected instruments.
        </Text>

        <Pressable className="bg-indigo-600 py-4 rounded-xl items-center">
          <Text className="text-white font-medium">Run Scan</Text>
        </Pressable>
      </View>

      <View className="bg-neutral-900 p-5 rounded-2xl mb-4">
        <Text className="text-white font-medium mb-2">Indicator Overlay</Text>
        <Text className="text-neutral-400 text-sm">
          Structural alignment across timeframes.
        </Text>
      </View>

      <Pressable className="bg-slate-900 p-6 rounded-3xl mb-4">
        <Text className="text-white font-semibold">Risk Calculator</Text>
        <Text className="text-slate-400 mt-2">
          Manage position sizing and stop loss.
        </Text>
      </Pressable>

      <Pressable className="bg-slate-900 p-6 rounded-3xl mb-4">
        <Text className="text-white font-semibold">Profit Simulator</Text>
        <Text className="text-slate-400 mt-2">Forecast trade scenarios.</Text>
      </Pressable>
    </ScreenWrapper>
  );
}
