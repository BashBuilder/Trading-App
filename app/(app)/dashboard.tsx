import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-slate-950 px-6 pt-14">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <Text className="text-slate-400">Welcome back</Text>
          <Text className="text-2xl font-bold text-white">Alex Trader</Text>
        </View>

        {/* Portfolio Card */}
        <View className="bg-slate-900 p-6 rounded-3xl mb-6 shadow-lg shadow-black/40">
          <Text className="text-slate-400">Total Portfolio</Text>
          <Text className="text-3xl font-bold text-white mt-2">$24,580.32</Text>
          <Text className="text-emerald-500 mt-2">+$1,240 (5.3%) today</Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-8">
          <Pressable className="bg-indigo-600 flex-1 p-4 rounded-2xl mr-2 items-center">
            <Text className="text-white font-semibold">Buy</Text>
          </Pressable>

          <Pressable className="bg-red-600 flex-1 p-4 rounded-2xl ml-2 items-center">
            <Text className="text-white font-semibold">Sell</Text>
          </Pressable>
        </View>

        {/* Market Watchlist */}
        <View className="mb-4">
          <Text className="text-white text-xl font-semibold mb-4">
            Market Watch
          </Text>

          {/* Stock Item */}
          <View className="bg-slate-900 p-4 rounded-2xl mb-3 flex-row justify-between">
            <View>
              <Text className="text-white font-semibold">AAPL</Text>
              <Text className="text-slate-400 text-sm">Apple Inc.</Text>
            </View>
            <View className="items-end">
              <Text className="text-white">$182.64</Text>
              <Text className="text-emerald-500 text-sm">+1.25%</Text>
            </View>
          </View>

          {/* Stock Item */}
          <View className="bg-slate-900 p-4 rounded-2xl mb-3 flex-row justify-between">
            <View>
              <Text className="text-white font-semibold">TSLA</Text>
              <Text className="text-slate-400 text-sm">Tesla Inc.</Text>
            </View>
            <View className="items-end">
              <Text className="text-white">$244.12</Text>
              <Text className="text-red-500 text-sm">-0.82%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
