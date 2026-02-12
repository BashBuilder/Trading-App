// import { useAppSelector } from "@/hooks/hooks";
// // import { useSubscriptionGate } from "@/navigation/Gate";
// import { Redirect } from "expo-router";

// export default function Index() {
//   const auth = useAppSelector((state) => state.auth);
//   // const { hasAccess } = useSubscriptionGate();

//   // if (!auth.isAuthenticated) {
//   //   return <Redirect href="/login" />;
//   // }

//   return <Redirect href="/login" />;
//   // if (!hasAccess) {
//   //   return <Redirect href="/paywall" />;
//   // }

//   // return <Redirect href="/tool" />;
// }

import { useRouter } from "expo-router";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {/* Slide 1 */}
        <View style={{ width }} className="flex-1 justify-center px-8">
          <View className="items-center mb-10">
            <View className="w-32 h-32 bg-indigo-600 rounded-full mb-8 animate-bounce " />
            <Text className="text-3xl font-bold text-white text-center">
              Trade Smarter
            </Text>
            <Text className="text-slate-400 text-center mt-4">
              Real-time market data and smart insights at your fingertips.
            </Text>
          </View>
        </View>

        {/* Slide 2 */}
        <View style={{ width }} className="flex-1 justify-center px-8">
          <View className="items-center mb-10">
            <View className="w-32 h-32 bg-emerald-600 rounded-full mb-8 animate-pulse" />
            <Text className="text-3xl font-bold text-white text-center">
              Track Your Portfolio
            </Text>
            <Text className="text-slate-400 text-center mt-4">
              Monitor gains, losses and performance in one dashboard.
            </Text>
          </View>
        </View>

        {/* Slide 3 */}
        <View style={{ width }} className="flex-1 justify-center px-8">
          <View className="items-center mb-10">
            <View className="w-32 h-32 bg-purple-600 rounded-full mb-8 animate-bounce" />
            <Text className="text-3xl font-bold text-white text-center">
              Secure & Fast
            </Text>
            <Text className="text-slate-400 text-center mt-4">
              Lightning-fast trades with enterprise-grade security.
            </Text>

            <Pressable
              onPress={() => router.replace("/login")}
              className="bg-indigo-600 px-8 py-4 rounded-2xl mt-10"
            >
              <Text className="text-white font-semibold text-lg">
                Get Started
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
