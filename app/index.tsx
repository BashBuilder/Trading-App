import { getToken } from "@/services/token.service";
import { Ionicons } from "@expo/vector-icons";
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

type Slide = {
  icon: keyof typeof Ionicons.glyphMap;
  accentIcons: { icon: keyof typeof Ionicons.glyphMap; style: object }[];
  eyebrow: string;
  title: string;
  subtitle: string;
  chips: string[];
  glow: string;
  ring: string;
  badgeBg: string;
  iconColor: string;
};

const slides: Slide[] = [
  {
    icon: "pulse",
    accentIcons: [
      { icon: "trending-up", style: { top: 18, right: 30 } },
      { icon: "stats-chart", style: { bottom: 24, left: 20 } },
    ],
    eyebrow: "REAL-TIME INTELLIGENCE",
    title: "AI Market Intelligence",
    subtitle:
      "Institutional-grade insights and smart trading signals, powered by advanced analytics that never sleep.",
    chips: ["Live data feeds", "AI-scored setups", "24/5 market coverage"],
    glow: "rgba(99,102,241,0.35)",
    ring: "rgba(99,102,241,0.25)",
    badgeBg: "#312e81",
    iconColor: "#a5b4fc",
  },
  {
    icon: "shield-checkmark",
    accentIcons: [
      { icon: "checkmark-circle", style: { top: 24, left: 26 } },
      { icon: "git-branch", style: { bottom: 20, right: 24 } },
    ],
    eyebrow: "TRADE WITH CLARITY",
    title: "Confidence-Based Signals",
    subtitle:
      "Every call is backed by bias, structure and probability models — so you know exactly why, not just what.",
    chips: ["Confidence scoring", "Structure mapping", "Bias detection"],
    glow: "rgba(16,185,129,0.35)",
    ring: "rgba(16,185,129,0.25)",
    badgeBg: "#064e3b",
    iconColor: "#6ee7b7",
  },
  {
    icon: "diamond",
    accentIcons: [
      { icon: "flash", style: { top: 20, right: 22 } },
      { icon: "layers", style: { bottom: 26, left: 24 } },
    ],
    eyebrow: "BUILT FOR SERIOUS TRADERS",
    title: "Professional Edge",
    subtitle:
      "Stay ahead with market regime, liquidity and structure tracking, all in one powerful platform.",
    chips: ["Market regime tracking", "Liquidity zones", "Pro-grade tools"],
    glow: "rgba(168,85,247,0.35)",
    ring: "rgba(168,85,247,0.25)",
    badgeBg: "#3b0764",
    iconColor: "#d8b4fe",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await getToken();
        if (token) {
          // Already signed in — skip onboarding & login entirely.
          router.replace("/dashboard");
          return;
        }

        const seen = await AsyncStorage.getItem("isOnBoardingSeen");
        if (seen === "true") {
          router.replace("/login");
          return;
        }

        setLoading(false);
      } catch {
        Toast.show({
          type: "error",
          text1: "Something went wrong while starting the app",
        });
        setLoading(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = async () => {
    await AsyncStorage.setItem("isOnBoardingSeen", "true");
    router.replace("/login");
  };

  const goToSlide = (i: number) => {
    scrollRef.current?.scrollTo({ x: width * i, animated: true });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    if (slide !== index) setIndex(slide);
  };

  if (loading) return null;

  const isLast = index === slides.length - 1;

  return (
    <View className="flex-1 bg-slate-950">
      {/* Top bar: brand + skip */}
      <View className="flex-row items-center justify-between px-6 pt-16 pb-2">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-lg bg-indigo-600/20 items-center justify-center">
            <Ionicons name="pulse" size={16} color="#818cf8" />
          </View>
          <Text className="text-white font-semibold tracking-wide">
            Elite Scope
          </Text>
        </View>
        {!isLast && (
          <Pressable onPress={handleFinish} hitSlop={10}>
            <Text className="text-slate-500 text-sm font-medium">Skip</Text>
          </Pressable>
        )}
      </View>

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
            className="flex-1 justify-between px-8 pb-6 pt-6"
          >
            {/* Illustration */}
            <View className="items-center justify-center" style={{ height: 260 }}>
              {/* Outer glow rings */}
              <View
                style={{
                  position: "absolute",
                  width: 220,
                  height: 220,
                  borderRadius: 110,
                  backgroundColor: item.glow,
                  opacity: 0.35,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 260,
                  height: 260,
                  borderRadius: 130,
                  borderWidth: 1,
                  borderColor: item.ring,
                }}
              />

              {/* Floating accent icon chips */}
              {item.accentIcons.map((a, idx) => (
                <View
                  key={idx}
                  style={{
                    position: "absolute",
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: "#0f172a",
                    borderWidth: 1,
                    borderColor: "rgba(148,163,184,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    ...a.style,
                  }}
                >
                  <Ionicons name={a.icon} size={18} color={item.iconColor} />
                </View>
              ))}

              {/* Core badge */}
              <View
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 40,
                  backgroundColor: item.badgeBg,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: item.ring,
                }}
              >
                <Ionicons name={item.icon} size={54} color={item.iconColor} />
              </View>
            </View>

            {/* Text */}
            <View>
              <Text
                className="text-center text-xs font-bold tracking-widest mb-3"
                style={{ color: item.iconColor }}
              >
                {item.eyebrow}
              </Text>
              <Text className="text-3xl font-bold text-white text-center">
                {item.title}
              </Text>
              <Text className="text-slate-400 text-center mt-4 leading-6">
                {item.subtitle}
              </Text>

              {/* Feature chips */}
              <View className="flex-row flex-wrap justify-center gap-2 mt-5">
                {item.chips.map((chip) => (
                  <View
                    key={chip}
                    className="flex-row items-center bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5"
                  >
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={item.iconColor}
                    />
                    <Text className="text-slate-300 text-xs ml-1">{chip}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* CTA */}
            <View className="mt-8">
              {isLast ? (
                <Pressable
                  onPress={handleFinish}
                  className="bg-indigo-600 py-4 rounded-2xl items-center flex-row justify-center active:opacity-80"
                >
                  <Text className="text-white font-semibold text-lg mr-2">
                    Start Trading
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => goToSlide(i + 1)}
                  className="bg-slate-800 py-4 rounded-2xl items-center flex-row justify-center active:opacity-80"
                >
                  <Text className="text-white font-semibold text-lg mr-2">
                    Continue
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Progress Indicator */}
      <View className="flex-row justify-center items-center mb-10 mt-2">
        {slides.map((_, i) => (
          <Pressable key={i} onPress={() => goToSlide(i)} hitSlop={8}>
            <View
              className={`h-2 mx-1 rounded-full ${
                i === index ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"
              }`}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
