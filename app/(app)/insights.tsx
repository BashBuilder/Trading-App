import SignalsHome from "@/components/signal-card";
import { Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function Insights() {
  return (
    <ScreenWrapper title="Market Insights">
      <SignalsHome />
      <View className="bg-slate-900 p-6 rounded-3xl mb-4">
        <Text className="text-white font-semibold">Market Sentiment</Text>
        <Text className="text-emerald-500 mt-2">Bullish 📈</Text>
      </View>
    </ScreenWrapper>
  );
}
