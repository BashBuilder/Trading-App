import { Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function Insights() {
  return (
    <ScreenWrapper title="Market Insights">
      <View className="bg-slate-900 p-6 rounded-3xl mb-4">
        <Text className="text-white font-semibold">Market Sentiment</Text>
        <Text className="text-emerald-500 mt-2">Bullish 📈</Text>
      </View>

      <View className="bg-slate-900 p-6 rounded-3xl">
        <Text className="text-white font-semibold">Top Gainers Today</Text>
        <Text className="text-slate-400 mt-2">NVDA • META • AMD</Text>
      </View>
    </ScreenWrapper>
  );
}
