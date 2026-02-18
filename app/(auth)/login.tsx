import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { loginRequest } from "@/hooks/processes/auth-reducer";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pageError, setPageError] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      const res: any = await dispatch(loginRequest({ email, password }));
      if (res.meta.requestStatus === "rejected") {
        setPageError(res.payload);
        return;
      }
      if (res.meta.requestStatus === "fulfilled") {
        router.replace("/dashboard");
      }
    } catch (error: any) {
      setPageError("An unexpected error occurred. Please try again.");
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
          {/* <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#64748b"
            className="bg-slate-800 text-white p-4 rounded-2xl"
          /> */}
        </View>

        {/* Password */}
        <View className="mb-6">
          <Text className="text-slate-400 mb-2">Password</Text>
          {/* <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#64748b"
            secureTextEntry
            className="bg-slate-800 text-white p-4 rounded-2xl"
          /> */}
          <TextInput
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#aaa"
            className="bg-slate-800 p-4 text-white rounded-xl mb-4"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {error && <Text className="text-red-400">{error}</Text>}

        {/* Login Button */}
        <Pressable
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
