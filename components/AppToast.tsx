import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { BaseToastProps, ToastConfig } from "react-native-toast-message";

type Variant = "success" | "error" | "info";

const VARIANT_STYLES: Record<
  Variant,
  { icon: keyof typeof Ionicons.glyphMap; iconColor: string; iconBg: string; border: string }
> = {
  success: {
    icon: "checkmark-circle",
    iconColor: "#34d399",
    iconBg: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.35)",
  },
  error: {
    icon: "close-circle",
    iconColor: "#f87171",
    iconBg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.35)",
  },
  info: {
    icon: "information-circle",
    iconColor: "#818cf8",
    iconBg: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.35)",
  },
};

function AppToast({
  variant,
  props,
}: {
  variant: Variant;
  props: BaseToastProps;
}) {
  const style = VARIANT_STYLES[variant];
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 16,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        width: "92%",
        alignSelf: "center",
      }}
    >
      <Pressable
        onPress={props.onPress}
        className="flex-row items-start bg-slate-900 rounded-2xl px-4 py-3.5 border"
        style={{
          borderColor: style.border,
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-0.5"
          style={{ backgroundColor: style.iconBg }}
        >
          <Ionicons name={style.icon} size={18} color={style.iconColor} />
        </View>
        <View className="flex-1">
          {!!props.text1 && (
            <Text
              numberOfLines={2}
              className="text-white font-semibold text-[14px] leading-5"
            >
              {props.text1}
            </Text>
          )}
          {!!props.text2 && (
            <Text
              numberOfLines={2}
              className="text-slate-400 text-[12.5px] leading-4 mt-0.5"
            >
              {props.text2}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export const toastConfig: ToastConfig = {
  success: (props) => <AppToast variant="success" props={props} />,
  error: (props) => <AppToast variant="error" props={props} />,
  info: (props) => <AppToast variant="info" props={props} />,
};
