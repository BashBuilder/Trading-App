import ScreenWrapper from "@/components/ScreenWrapper";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ScreenWrapper title="Profile">
      <View className="flex-1 pt-14">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View className="items-center mb-8">
            <View className=" p-6  rounded-full bg-indigo-600 items-center justify-center mb-4">
              <Text className="text-white text-xl font-semibold">John</Text>
            </View>

            <Text className="text-xl font-semibold text-white">
              Anthony John
            </Text>

            <Text className="text-neutral-400 mt-1">Strategist Tier</Text>

            <View className="flex-row mt-4">
              <View className="px-3 py-1 bg-indigo-500/20 rounded-full mr-2">
                <Text className="text-indigo-400 text-xs">Verified</Text>
              </View>

              <View className="px-3 py-1 bg-neutral-800 rounded-full">
                <Text className="text-neutral-400 text-xs">Pro Member</Text>
              </View>
            </View>
          </View>

          {/* Performance Snapshot */}
          <View className="bg-neutral-900 p-6 rounded-2xl mb-8 border border-neutral-800">
            <Text className="text-neutral-400 mb-4">Performance Snapshot</Text>

            <View className="flex-row justify-between">
              <View>
                <Text className="text-white text-lg font-medium">68%</Text>
                <Text className="text-neutral-500 text-sm">Accuracy</Text>
              </View>

              <View>
                <Text className="text-white text-lg font-medium">124</Text>
                <Text className="text-neutral-500 text-sm">Signals Used</Text>
              </View>

              <View>
                <Text className="text-white text-lg font-medium">+32%</Text>
                <Text className="text-neutral-500 text-sm">
                  Portfolio Growth
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-neutral-400 mb-4">Account & Settings</Text>

            {[
              "Subscription",
              "Security",
              "Notifications",
              "Risk Preferences",
            ].map((item, i) => (
              <Pressable
                key={i}
                className="bg-neutral-900 p-5 rounded-xl mb-3 border border-neutral-800"
              >
                <Text className="text-white">{item}</Text>
              </Pressable>
            ))}
          </View>

          {/* Activity Log */}
          <Text className="text-xl font-semibold text-white mb-2">
            Activity
          </Text>
          <Text className="text-neutral-500 mb-6">
            Structured record of your scans and signal interactions.
          </Text>

          {/* Filter */}
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

          {/* Activity Items */}
          {[
            {
              title: "EURUSD Structural Scan",
              time: "14:32",
              desc: "Core signal with indicator alignment across H1 timeframe.",
              tag: "Strategist Tier",
            },
            {
              title: "NASDAQ Volatility Analysis",
              time: "11:08",
              desc: "Compression phase detected within narrowing structural range.",
              tag: "Mathematician Tier",
            },
            {
              title: "GBPUSD Core Signal",
              time: "Yesterday",
              desc: "Upward structural pressure observed within intraday channel.",
              tag: "Explorer Tier",
            },
          ].map((item, i) => (
            <View key={i} className="py-4 border-b border-neutral-800">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white font-medium">{item.title}</Text>
                <Text className="text-neutral-500 text-sm">{item.time}</Text>
              </View>

              <Text className="text-neutral-400 text-sm mb-3">{item.desc}</Text>

              <View className="px-3 py-1 bg-neutral-800 rounded-full self-start">
                <Text className="text-neutral-400 text-xs">{item.tag}</Text>
              </View>
            </View>
          ))}

          {/* Logout */}
          <Pressable className="bg-red-500 mt-10 py-4 rounded-2xl items-center">
            <Text className="text-white font-semibold">Logout</Text>
          </Pressable>

          <View className="h-24" />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
