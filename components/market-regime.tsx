import { Text, View } from "react-native";

// In production: fetch from a dedicated /market/regime endpoin
const regimes = [
  { label: "Overall Bias", value: "Bullish", color: "text-emerald-400" },
  { label: "Volatility", value: "Moderate", color: "text-yellow-400" },
  { label: "Session", value: "London", color: "text-cyan-400" },
];

export default function MarketRegimeCard() {
  // In production: fetch from a dedicated /market/regime endpoint

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-5 overflow-hidden">
      {/* Top accent */}
      <View className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500/50" />

      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-neutral-500 text-xs uppercase tracking-widest">
            Market Regime
          </Text>
          <Text className="text-white text-2xl font-bold mt-1">Mixed</Text>
        </View>
        <View className="px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <Text className="text-emerald-400 text-xs font-medium">Live</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        {regimes.map((r) => (
          <View key={r.label} className="items-center">
            <Text className={`text-sm font-semibold ${r.color}`}>
              {r.value}
            </Text>
            <Text className="text-neutral-600 text-xs mt-0.5">{r.label}</Text>
          </View>
        ))}
      </View>

      <Text className="text-neutral-700 text-xs mt-4">Updated {timeStr}</Text>
    </View>
  );
}
