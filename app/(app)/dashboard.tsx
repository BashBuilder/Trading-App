// import { Pressable, ScrollView, Text, View } from "react-native";

// export default function HomeScreen() {
//   return (
//     <View className="flex-1 bg-slate-950 px-6 pt-14">
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View className="mb-8">
//           <Text className="text-slate-400">Welcome back</Text>
//           <Text className="text-2xl font-bold text-white">Alex Trader</Text>
//         </View>

//         {/* Portfolio Card */}
//         <View className="bg-slate-900 p-6 rounded-3xl mb-6 shadow-lg shadow-black/40">
//           <Text className="text-slate-400">Total Portfolio</Text>
//           <Text className="text-3xl font-bold text-white mt-2">$24,580.32</Text>
//           <Text className="text-emerald-500 mt-2">+$1,240 (5.3%) today</Text>
//         </View>

//         {/* Quick Actions */}
//         <View className="flex-row justify-between mb-8">
//           <Pressable className="bg-indigo-600 flex-1 p-4 rounded-2xl mr-2 items-center">
//             <Text className="text-white font-semibold">Buy</Text>
//           </Pressable>

//           <Pressable className="bg-red-600 flex-1 p-4 rounded-2xl ml-2 items-center">
//             <Text className="text-white font-semibold">Sell</Text>
//           </Pressable>
//         </View>

//         {/* Market Watchlist */}
//         <View className="mb-4">
//           <Text className="text-white text-xl font-semibold mb-4">
//             Market Watch
//           </Text>

//           {/* Stock Item */}
//           <View className="bg-slate-900 p-4 rounded-2xl mb-3 flex-row justify-between">
//             <View>
//               <Text className="text-white font-semibold">AAPL</Text>
//               <Text className="text-slate-400 text-sm">Apple Inc.</Text>
//             </View>
//             <View className="items-end">
//               <Text className="text-white">$182.64</Text>
//               <Text className="text-emerald-500 text-sm">+1.25%</Text>
//             </View>
//           </View>

//           {/* Stock Item */}
//           <View className="bg-slate-900 p-4 rounded-2xl mb-3 flex-row justify-between">
//             <View>
//               <Text className="text-white font-semibold">TSLA</Text>
//               <Text className="text-slate-400 text-sm">Tesla Inc.</Text>
//             </View>
//             <View className="items-end">
//               <Text className="text-white">$244.12</Text>
//               <Text className="text-red-500 text-sm">-0.82%</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

import SignalsHome from "@/components/signal-card";
import { Pressable, ScrollView, Text, View } from "react-native";

const instruments = [
  { symbol: "EURUSD", bias: "Bullish", confidence: 78 },
  { symbol: "XAUUSD", bias: "Neutral", confidence: 61 },
  { symbol: "NAS100", bias: "Bullish", confidence: 72 },
];

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-slate-950 px-6 pt-14">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-slate-400">EliteScope</Text>
          <Text className="text-2xl font-bold text-white">
            Market Intelligence
          </Text>
        </View>

        {/* Market Regime Card */}
        <View className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl mb-6">
          <Text className="text-indigo-100">Market Regime</Text>
          <Text className="text-3xl font-bold text-white mt-1">Mixed</Text>

          <Text className="text-indigo-200 mt-2 text-xs">
            Structural Bias: Bullish
          </Text>

          <Text className="text-indigo-200 text-xs mt-1">
            Updated 10:45 UTC
          </Text>
        </View>

        {/* Active Instruments */}
        <View className="mb-6">
          <Text className="text-white text-xl font-semibold mb-4">
            Active Opportunities
          </Text>

          {instruments.map((item, i) => (
            <Pressable key={i} className="bg-slate-900 p-4 rounded-2xl mb-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-semibold">{item.symbol}</Text>

                <Text
                  className={`font-semibold ${
                    item.bias === "Bullish"
                      ? "text-emerald-500"
                      : item.bias === "Bearish"
                        ? "text-red-500"
                        : "text-yellow-400"
                  }`}
                >
                  {item.bias}
                </Text>
              </View>

              {/* Confidence Bar */}
              <View className="mt-3">
                <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <View
                    style={{ width: `${item.confidence}%` }}
                    className="h-2 bg-indigo-500 rounded-full"
                  />
                </View>

                <Text className="text-slate-400 text-xs mt-1">
                  Confidence {item.confidence}%
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Latest Signal */}
        {/* <View className="bg-slate-900 p-6 rounded-3xl mb-8">
          <Text className="text-slate-400">Latest Signal</Text>

          <Text className="text-xl font-bold text-white mt-2">EURUSD (H1)</Text>

          <Text className="text-emerald-500 mt-1">
            Break & Retest Structure
          </Text>

          <Text className="text-slate-400 mt-2">Confidence 78%</Text>

          <Pressable className="bg-indigo-600 mt-4 py-3 rounded-xl items-center">
            <Text className="text-white font-semibold">View Full Signal</Text>
          </Pressable>
        </View> */}
        <SignalsHome />
      </ScrollView>
    </View>
  );
}
