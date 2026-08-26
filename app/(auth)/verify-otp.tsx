import OtpInput from "@/components/OtpInput";
import { useCountdown } from "@/hooks/useCountdown";
import { useAppDispatch } from "@/hooks/hooks";
import {
  resendOtpRequest,
  verifyOtpRequest,
} from "@/hooks/processes/auth-reducer";
import { saveToken } from "@/services/token.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const cooldown = useCountdown(60);

  const handleVerify = async (code: string) => {
    if (code.length !== 6) {
      Toast.show({ type: "error", text1: "Enter the 6-digit code" });
      return;
    }
    setLoading(true);
    try {
      const result: any = await dispatch(
        verifyOtpRequest({ email, otp: code, purpose: "verify_email" }),
      );
      if (result.meta.requestStatus === "rejected") {
        throw new Error(result.payload as string);
      }

      await saveToken(result.payload.accessToken, 3600);
      Toast.show({ type: "success", text1: "Email verified! Welcome aboard 🎉" });
      router.replace("/dashboard");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Invalid or expired code",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown.isActive) return;
    setResending(true);
    try {
      const result: any = await dispatch(
        resendOtpRequest({ email, purpose: "verify_email" }),
      );
      if (result.meta.requestStatus === "rejected") {
        throw new Error(result.payload as string);
      }
      Toast.show({ type: "success", text1: "New code sent to your email" });
      cooldown.start(60);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Couldn't resend code",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950 px-6 justify-center">
      <View className="items-center mb-8">
        <View className="w-16 h-16 rounded-2xl bg-indigo-600/15 items-center justify-center mb-4">
          <Ionicons name="mail-open-outline" size={28} color="#818cf8" />
        </View>
        <Text className="text-2xl font-bold text-white text-center">
          Verify your email
        </Text>
        <Text className="text-slate-400 text-center mt-2 leading-5">
          We sent a 6-digit code to{"\n"}
          <Text className="text-slate-300 font-medium">{email}</Text>
        </Text>
      </View>

      <View className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <OtpInput value={otp} onChange={setOtp} />

        <Pressable
          disabled={loading}
          onPress={() => handleVerify(otp)}
          className="bg-indigo-600 py-4 rounded-2xl items-center flex-row justify-center mt-6 active:opacity-80"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <Text className="text-white font-semibold text-lg mr-2">
            {loading ? "Verifying..." : "Verify Email"}
          </Text>
          {!loading && <Ionicons name="checkmark" size={18} color="white" />}
        </Pressable>

        <View className="flex-row justify-center items-center mt-5">
          <Text className="text-slate-500 text-sm">Didn&apos;t get a code?</Text>
          <Pressable onPress={handleResend} disabled={cooldown.isActive || resending}>
            <Text
              className="text-indigo-500 font-semibold ml-2 text-sm"
              style={{ opacity: cooldown.isActive ? 0.5 : 1 }}
            >
              {cooldown.isActive ? `Resend in ${cooldown.seconds}s` : "Resend"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
