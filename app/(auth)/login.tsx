import { useAppDispatch } from "@/hooks/hooks";
import { loginRequest } from "@/hooks/processes/auth-reducer";
import { saveToken } from "@/services/token.service";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Please enter your email and password" });
      return;
    }

    setLoading(true);
    try {
      const data: any = await dispatch(loginRequest({ email, password }));
      if (data.meta.requestStatus === "rejected") {
        const payload = data.payload;
        // Unverified account — send them straight to the OTP screen instead of a dead-end error.
        if (payload?.data?.emailVerified === false) {
          Toast.show({
            type: "info",
            text1: "Please verify your email to continue",
          });
          router.push({
            pathname: "/verify-otp",
            params: { email: payload.data.email || email },
          });
          return;
        }
        throw new Error(payload?.message || "Login failed. Please try again.");
      }

      saveToken(data.payload.accessToken, 3600);
      Toast.show({ type: "success", text1: "Login successful! Redirecting..." });
      router.replace("/dashboard");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
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
        {/* Brand */}
        <View className="items-center mb-10">
          <Image
            source={require("../../assets/images/elite-scope-icon.png")}
            className="w-16 h-16 rounded-2xl mb-3"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-white">Elite Scope</Text>
          <Text className="text-slate-400 mt-2">Welcome back 👋</Text>
        </View>

        {/* Card */}
        <View className="bg-slate-900 p-6 rounded-3xl shadow-lg shadow-black/40">
          {/* Email */}
          <View className="mb-4">
            <Text className="text-slate-400 mb-2 text-sm">Email</Text>
            <View className="flex-row items-center bg-slate-800 rounded-xl px-4">
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
                textContentType="emailAddress"
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-2">
            <Text className="text-slate-400 mb-2 text-sm">Password</Text>
            <View className="flex-row items-center bg-slate-800 rounded-xl px-4">
              <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
              <TextInput
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                placeholderTextColor="#64748b"
                className="flex-1 text-white p-4 ml-2"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                textContentType="password"
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#64748b"
                />
              </Pressable>
            </View>
          </View>

          <Link href="/forgot-password" asChild>
            <Pressable className="self-end mb-6">
              <Text className="text-indigo-500 text-sm font-medium">
                Forgot password?
              </Text>
            </Pressable>
          </Link>

          {/* Login Button */}
          <Pressable
            disabled={loading}
            className="bg-indigo-600 p-4 rounded-2xl active:opacity-80 flex-row items-center justify-center"
            style={{ opacity: loading ? 0.7 : 1 }}
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? "Logging in..." : "Login"}
            </Text>
            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={18}
                color="white"
                style={{ marginLeft: 8 }}
              />
            )}
          </Pressable>

          {/* Register Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-slate-400">Don&apos;t have an account?</Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text className="text-indigo-500 font-semibold ml-2">
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
