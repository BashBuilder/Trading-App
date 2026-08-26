import { useAppDispatch } from "@/hooks/hooks";
import { deactivateAccountRequest } from "@/hooks/processes/auth-reducer";
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

export default function DeactivateAccountScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);

  const handleDeactivate = async () => {
    if (!password) {
      Toast.show({ type: "error", text1: "Enter your password to confirm" });
      return;
    }
    setLoading(true);
    try {
      const result: any = await dispatch(deactivateAccountRequest({ password }));
      if (result.meta.requestStatus === "rejected") {
        throw new Error(result.payload as string);
      }
      Toast.show({ type: "success", text1: "Account deactivated" });
      router.replace("/login");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Couldn't deactivate account",
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
        <View className="w-16 h-16 rounded-2xl bg-red-500/10 items-center justify-center mb-4">
          <Ionicons name="warning-outline" size={28} color="#f87171" />
        </View>
        <Text className="text-2xl font-bold text-white text-center">
          Deactivate account
        </Text>
        <Text className="text-slate-400 text-center mt-2 leading-5 px-2">
          You&apos;ll be logged out and won&apos;t be able to sign in until you
          reactivate with your email and password.
        </Text>
      </View>

      <View className="bg-slate-900 p-6 rounded-3xl border border-red-500/20">
        {!confirmStep ? (
          <Pressable
            onPress={() => setConfirmStep(true)}
            className="border border-red-500/40 bg-red-500/5 py-4 rounded-2xl items-center"
          >
            <Text className="text-red-400 font-semibold">
              I understand, continue
            </Text>
          </Pressable>
        ) : (
          <>
            <Text className="text-slate-400 mb-2 text-sm">
              Confirm your password
            </Text>
            <View className="flex-row items-center bg-slate-800 rounded-xl px-4 mb-6">
              <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                secureTextEntry={!showPassword}
                className="flex-1 text-white p-4 ml-2"
                value={password}
                onChangeText={setPassword}
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

            <Pressable
              disabled={loading}
              onPress={handleDeactivate}
              className="bg-red-500 py-4 rounded-2xl items-center"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? "Deactivating..." : "Deactivate my account"}
              </Text>
            </Pressable>
          </>
        )}

        <Pressable onPress={() => router.back()} className="items-center mt-5">
          <Text className="text-slate-500 text-sm">Cancel, take me back</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
