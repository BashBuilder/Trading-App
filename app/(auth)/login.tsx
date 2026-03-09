import { useAppDispatch } from "@/hooks/hooks";
import { loginRequest } from "@/hooks/processes/auth-reducer";
import { saveToken } from "@/services/token.service";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data: any = await dispatch(loginRequest({ email, password }));
      if (data.meta.requestStatus === "rejected") {
        throw new Error(data.payload as string);
      }
      Toast.show({
        type: "success",
        text1: "Login successful! Redirecting...",
      });

      if (data.meta.requestStatus === "fulfilled") {
        Toast.show({
          type: "success",
          text1: "Login successful",
        });
        saveToken(data.payload.accessToken, 3600);
        router.replace("/dashboard");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Login failed. Please try again.",
      });
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950 justify-center px-6">
      {/* Title */}
      <View className="mb-10">
        <Text className="text-4xl font-bold text-white">Welcome Back 👋</Text>
        <Text className="text-slate-400 mt-2">Login to continue</Text>
      </View>

      {/* Card */}
      <View className="bg-slate-900 p-6 rounded-3xl shadow-lg shadow-black/40">
        {/* Email */}
        <View className="mb-4">
          <Text className="text-slate-400 mb-2">Email</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            className="bg-slate-800 p-4 text-white rounded-xl mb-4"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {/* Password */}
        <View className="mb-6">
          <Text className="text-slate-400 mb-2">Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#aaa"
            className="bg-slate-800 p-4 text-white rounded-xl mb-4"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {/* Login Button */}
        <Pressable
          disabled={loading}
          className="bg-indigo-600 p-4 rounded-2xl active:opacity-80"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? "Loading..." : "Login"}
          </Text>
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
    </View>
  );
}
