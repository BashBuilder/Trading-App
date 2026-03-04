import { useAppSelector } from "@/hooks/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "AI Market Intelligence",
    subtitle:
      "Get real-time institutional-grade insights and smart trading signals powered by advanced analytics.",
    color: "bg-indigo-600",
  },
  {
    title: "Confidence-Based Signals",
    subtitle:
      "Trade with clarity using bias, structure and probability models designed for modern traders.",
    color: "bg-emerald-600",
  },
  {
    title: "Professional Edge",
    subtitle:
      "Stay ahead with market regime, liquidity and structure tracking in one powerful platform.",
    color: "bg-purple-600",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  // const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const scrollRef = useRef<ScrollView>(null);

  // useEffect(() => {
  //   dispatch(hydrateAuth());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace("/dashboard");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated]);

  const checkOnboarding = async () => {
    const seen = await AsyncStorage.getItem("isOnBoardingSeen");

    if (seen === "true") {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = async () => {
    await AsyncStorage.setItem("isOnBoardingSeen", "true");
    router.replace("/login");
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(slide);
  };

  if (loading) return null;

  return (
    <View className="flex-1 bg-slate-950">
      <Toast />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {slides.map((item, i) => (
          <View
            key={i}
            style={{ width }}
            className="flex-1 justify-between px-8 pb-14 pt-20"
          >
            {/* Illustration */}
            <View className="items-center">
              <View
                className={`w-64 h-64 rounded-full ${item.color} opacity-20 absolute`}
              />

              {/* Modern illustration placeholder */}
              <View
                className={`w-40 h-40 rounded-3xl ${item.color} items-center justify-center`}
              >
                <Text className="text-white font-bold text-lg">{i + 1}</Text>
              </View>
            </View>

            {/* Text */}
            <View>
              <Text className="text-3xl font-bold text-white text-center">
                {item.title}
              </Text>

              <Text className="text-slate-400 text-center mt-5 leading-6">
                {item.subtitle}
              </Text>
            </View>

            {/* CTA */}
            <View>
              {i === slides.length - 1 ? (
                <Pressable
                  onPress={handleFinish}
                  className="bg-indigo-600 py-4 rounded-2xl items-center"
                >
                  <Text className="text-white font-semibold text-lg">
                    Start Trading
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() =>
                    scrollRef.current?.scrollTo({
                      x: width * (i + 1),
                      animated: true,
                    })
                  }
                  className="bg-slate-800 py-4 rounded-2xl items-center"
                >
                  <Text className="text-white font-semibold text-lg">
                    Continue
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Progress Indicator */}
      <View className="flex-row justify-center mb-10">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`h-2 mx-1 rounded-full ${
              i === index ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
