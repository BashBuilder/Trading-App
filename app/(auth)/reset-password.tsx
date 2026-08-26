import OtpInput from "@/components/OtpInput";
import { useCountdown } from "@/hooks/useCountdown";
import { useAppDispatch } from "@/hooks/hooks";
import {
  resendOtpRequest,
  resetPasswordRequest,
} from "@/hooks/processes/auth-reducer";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const cooldown = useCountdown(60);

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      Toast.show({ type: "error", text1: "Enter the 6-digit code" });
      return;
    }
    if (newPassword.length < 8) {
      Toast.show({ type: "error", text1: "Password must be at least 8 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const result: any = await dispatch(
        resetPasswordRequest({ email, otp, newPassword }),
      );
      if (result.meta.requestStatus === "rejected") {
        throw new Error(result.payload as string);
      }
      Toast.show({
        type: "success",
        text1: "Password reset! Please log in.",
      });
      router.replace("/login");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Couldn't reset password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown.isActive) return;
    try {
      const result: any = await dispatch(
        resendOtpRequest({ email, purpose: "reset_password" }),
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
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-950"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-2xl bg-indigo-600/15 items-center justify-center mb-4">
            <Ionicons name="lock-open-outline" size={28} color="#818cf8" />
          </View>
          <Text className="text-2xl font-bold text-white text-center">
            Reset your password
          </Text>
          <Text className="text-slate-400 text-center mt-2 leading-5">
            Enter the code sent to{"\n"}
            <Text className="text-slate-300 font-medium">{email}</Text>
          </Text>
        </View>

        <View className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <OtpInput value={otp} onChange={setOtp} />

          <View className="flex-row items-center bg-slate-800 rounded-xl px-4 mt-6">
            <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
            <TextInput
              placeholder="New password"
              placeholderTextColor="#64748b"
              secureTextEntry={!showPassword}
              className="flex-1 text-white p-4 ml-2"
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#64748b"
              />
            </Pressable>
          </View>

          <View className="flex-row items-center bg-slate-800 rounded-xl px-4 mt-3">
            <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor="#64748b"
              secureTextEntry={!showPassword}
              className="flex-1 text-white p-4 ml-2"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
          </View>

          <Pressable
            disabled={loading}
            onPress={handleSubmit}
            className="bg-indigo-600 py-4 rounded-2xl items-center flex-row justify-center mt-6 active:opacity-80"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <Text className="text-white font-semibold text-lg mr-2">
              {loading ? "Resetting..." : "Reset Password"}
            </Text>
            {!loading && <Ionicons name="checkmark" size={18} color="white" />}
          </Pressable>

          <View className="flex-row justify-center items-center mt-5">
            <Text className="text-slate-500 text-sm">Didn&apos;t get a code?</Text>
            <Pressable onPress={handleResend} disabled={cooldown.isActive}>
              <Text
                className="text-indigo-500 font-semibold ml-2 text-sm"
                style={{ opacity: cooldown.isActive ? 0.5 : 1 }}
              >
                {cooldown.isActive ? `Resend in ${cooldown.seconds}s` : "Resend"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
