import { useAppDispatch } from "@/hooks/hooks";
import { forgotPasswordRequest } from "@/hooks/processes/auth-reducer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Enter your email address" });
      return;
    }
    setLoading(true);
    try {
      const result: any = await dispatch(forgotPasswordRequest({ email }));
      if (result.meta.requestStatus === "rejected") {
        throw new Error(result.payload as string);
      }
      Toast.show({
        type: "success",
        text1: "If that email exists, a reset code is on its way",
      });
      router.push({ pathname: "/reset-password", params: { email } });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-950 px-6 justify-center"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="items-center mb-8">
        <View className="w-16 h-16 rounded-2xl bg-indigo-600/15 items-center justify-center mb-4">
          <Ionicons name="key-outline" size={28} color="#818cf8" />
        </View>
        <Text className="text-2xl font-bold text-white text-center">
          Forgot your password?
        </Text>
        <Text className="text-slate-400 text-center mt-2 leading-5 px-4">
          Enter the email on your account and we&apos;ll send you a reset code.
        </Text>
      </View>

      <View className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <View className="flex-row items-center bg-slate-800 rounded-xl px-4 mb-6">
          <Ionicons name="mail-outline" size={18} color="#64748b" />
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#64748b"
            className="flex-1 text-white p-4 ml-2"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Pressable
          disabled={loading}
          onPress={handleSubmit}
          className="bg-indigo-600 py-4 rounded-2xl items-center flex-row justify-center active:opacity-80"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <Text className="text-white font-semibold text-lg mr-2">
            {loading ? "Sending..." : "Send Reset Code"}
          </Text>
          {!loading && <Ionicons name="arrow-forward" size={18} color="white" />}
        </Pressable>

        <Pressable onPress={() => router.back()} className="items-center mt-5">
          <Text className="text-slate-500 text-sm">Back to login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
