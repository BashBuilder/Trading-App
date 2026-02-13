import ScreenWrapper from "@/components/ScreenWrapper";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HistoryScreen() {
  return (
    <ScreenWrapper title="History">
      <View className="flex-1 pt-14">
        {/* Header */}
        <Text className="text-2xl font-semibold text-white tracking-wide mb-2">
          Activity Log
        </Text>
        <Text className="text-neutral-500 mb-6">
          Structured record of scans and analytical outputs.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Filter Bar */}
          <View className="flex-row mb-6">
            {["All", "Signals", "Analytics"].map((item, index) => (
              <Pressable
                key={index}
                className={`px-4 py-2 rounded-full mr-3 border ${
                  index === 0
                    ? "border-indigo-500 bg-neutral-900"
                    : "border-neutral-800 bg-neutral-900"
                }`}
              >
                <Text
                  className={`text-sm ${
                    index === 0 ? "text-white" : "text-neutral-400"
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Summary Snapshot */}
          <View className="bg-neutral-900 p-6 rounded-2xl mb-8 border border-neutral-800">
            <Text className="text-neutral-400 mb-4">
              Activity Summary (Last 30 Days)
            </Text>

            <View className="flex-row justify-between">
              <View>
                <Text className="text-white text-lg font-medium">42</Text>
                <Text className="text-neutral-500 text-sm">Scans</Text>
              </View>

              <View>
                <Text className="text-white text-lg font-medium">18</Text>
                <Text className="text-neutral-500 text-sm">
                  Advanced Signals
                </Text>
              </View>

              <View>
                <Text className="text-white text-lg font-medium">9</Text>
                <Text className="text-neutral-500 text-sm">
                  Statistical Reports
                </Text>
              </View>
            </View>
          </View>

          {/* Today Section */}
          <Text className="text-neutral-500 text-sm mb-3">Today</Text>

          <View className="mb-6">
            <View className="py-4 border-b border-neutral-800">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white font-medium">
                  EURUSD Structural Scan
                </Text>
                <Text className="text-neutral-500 text-sm">14:32</Text>
              </View>

              <Text className="text-neutral-400 text-sm mb-3">
                Core signal with indicator alignment across H1 timeframe.
              </Text>

              <View className="px-3 py-1 bg-neutral-800 rounded-full self-start">
                <Text className="text-neutral-400 text-xs">
                  Generated • Strategist Tier
                </Text>
              </View>
            </View>

            <View className="py-4 border-b border-neutral-800">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white font-medium">
                  NASDAQ Volatility Analysis
                </Text>
                <Text className="text-neutral-500 text-sm">11:08</Text>
              </View>

              <Text className="text-neutral-400 text-sm mb-3">
                Compression phase detected within narrowing structural range.
              </Text>

              <View className="px-3 py-1 bg-neutral-800 rounded-full self-start">
                <Text className="text-neutral-400 text-xs">
                  Statistical Overlay • Mathematician Tier
                </Text>
              </View>
            </View>
          </View>

          {/* Yesterday Section */}
          <Text className="text-neutral-500 text-sm mb-3">Yesterday</Text>

          <View className="mb-10">
            <View className="py-4 border-b border-neutral-800">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white font-medium">
                  GBPUSD Core Signal
                </Text>
                <Text className="text-neutral-500 text-sm">16:44</Text>
              </View>

              <Text className="text-neutral-400 text-sm mb-3">
                Upward structural pressure observed within intraday channel.
              </Text>

              <View className="px-3 py-1 bg-neutral-800 rounded-full self-start">
                <Text className="text-neutral-400 text-xs">
                  Core Signal • Explorer Tier
                </Text>
              </View>
            </View>

            <View className="py-4 border-b border-neutral-800">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white font-medium">
                  S&P500 Indicator Alignment
                </Text>
                <Text className="text-neutral-500 text-sm">10:12</Text>
              </View>

              <Text className="text-neutral-400 text-sm mb-3">
                Multi-timeframe confirmation across momentum structures.
              </Text>

              <View className="px-3 py-1 bg-neutral-800 rounded-full self-start">
                <Text className="text-neutral-400 text-xs">
                  Indicator Analysis • Strategist Tier
                </Text>
              </View>
            </View>
          </View>

          {/* Footer Spacer */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
