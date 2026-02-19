import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const filters = ["All", "Explorer", "Strategist", "Mathematician"];

const signals = [
  {
    pair: "EURUSD",
    tf: "H1",
    direction: "Long",
    confidence: 78,
    tier: "Explorer",
    time: "10:42 UTC",
    summary: "Higher low retest confirmed.",
  },
  {
    pair: "NASDAQ",
    tf: "M30",
    direction: "Short",
    confidence: 82,
    tier: "Strategist",
    time: "10:38 UTC",
    summary: "Structure failure under resistance.",
  },
  {
    pair: "XAUUSD",
    tf: "H4",
    direction: "Long",
    confidence: 88,
    tier: "Mathematician",
    time: "10:35 UTC",
    summary: "Multi-timeframe structural alignment.",
  },
  {
    pair: "EURUSD",
    tf: "H1",
    direction: "Long",
    confidence: 78,
    tier: "Explorer",
    time: "10:42 UTC",
    summary: "Higher low retest confirmed.",
  },
  {
    pair: "NASDAQ",
    tf: "M30",
    direction: "Short",
    confidence: 82,
    tier: "Strategist",
    time: "10:38 UTC",
    summary: "Structure failure under resistance.",
  },
  {
    pair: "XAUUSD",
    tf: "H4",
    direction: "Long",
    confidence: 88,
    tier: "Mathematician",
    time: "10:35 UTC",
    summary: "Multi-timeframe structural alignment.",
  },
  {
    pair: "EURUSD",
    tf: "H1",
    direction: "Long",
    confidence: 78,
    tier: "Explorer",
    time: "10:42 UTC",
    summary: "Higher low retest confirmed.",
  },
  {
    pair: "NASDAQ",
    tf: "M30",
    direction: "Short",
    confidence: 82,
    tier: "Strategist",
    time: "10:38 UTC",
    summary: "Structure failure under resistance.",
  },
  {
    pair: "XAUUSD",
    tf: "H4",
    direction: "Long",
    confidence: 88,
    tier: "Mathematician",
    time: "10:35 UTC",
    summary: "Multi-timeframe structural alignment.",
  },
  {
    pair: "EURUSD",
    tf: "H1",
    direction: "Long",
    confidence: 78,
    tier: "Explorer",
    time: "10:42 UTC",
    summary: "Higher low retest confirmed.",
  },
  {
    pair: "NASDAQ",
    tf: "M30",
    direction: "Short",
    confidence: 82,
    tier: "Strategist",
    time: "10:38 UTC",
    summary: "Structure failure under resistance.",
  },
  {
    pair: "XAUUSD",
    tf: "H4",
    direction: "Long",
    confidence: 88,
    tier: "Mathematician",
    time: "10:35 UTC",
    summary: "Multi-timeframe structural alignment.",
  },
];

export default function SignalsHome() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredSignals =
    activeFilter === "All"
      ? signals
      : signals.filter((s) => s.tier === activeFilter);

  return (
    // <View className="flex-1 bg-slate-950 px-6 pt-14">
    <View className="flex-1 mb-20 ">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white">Signals</Text>
          <Text className="text-slate-400 mt-1">
            Institutional-grade trading insights
          </Text>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {filters.map((item) => {
            const active = activeFilter === item;
            return (
              <Pressable
                key={item}
                onPress={() => setActiveFilter(item)}
                className={`px-4 py-2 mr-3 rounded-xl ${
                  active ? "bg-indigo-600" : "bg-slate-900"
                }`}
              >
                <Text
                  className={`${
                    active ? "text-white" : "text-slate-400"
                  } font-semibold`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Signal Cards */}
        {filteredSignals.map((signal, i) => (
          <Pressable key={i} className="bg-slate-900 p-5 rounded-2xl mb-4">
            {/* Top Row */}
            <View className="flex-row justify-between items-center">
              <Text className="text-white font-bold text-lg">
                {signal.pair} — {signal.tf}
              </Text>

              <View
                className={`px-3 py-1 rounded-lg ${
                  signal.direction === "Long"
                    ? "bg-emerald-500/20"
                    : "bg-red-500/20"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    signal.direction === "Long"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {signal.direction}
                </Text>
              </View>
            </View>

            {/* Confidence */}
            <View className="mt-3">
              <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <View
                  style={{ width: `${signal.confidence}%` }}
                  className="h-2 bg-indigo-500"
                />
              </View>

              <Text className="text-slate-400 text-xs mt-1">
                Confidence {signal.confidence}%
              </Text>
            </View>

            {/* Tier + Time */}
            <View className="flex-row justify-between mt-3">
              <Text className="text-indigo-400 text-sm font-semibold">
                {signal.tier}
              </Text>

              <Text className="text-slate-500 text-sm">{signal.time}</Text>
            </View>

            {/* Summary */}
            <Text className="text-slate-400 mt-3">{signal.summary}</Text>

            {/* CTA */}
            <View className="mt-4">
              <View className="bg-indigo-600 py-2 rounded-xl items-center">
                <Text className="text-white font-semibold">View Details</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
