// import { useAppSelector } from "@/hooks/hooks";
// import { ScrollView, Text } from "react-native";

// export default function PaywallScreen() {
//   // const auth = useSelector((state: RootState) => state.auth);
//   const auth = useAppSelector((state) => state.auth);
//   return (
//     <ScrollView
//       className="flex-1 bg-black py-6 "
//       contentContainerClassName="p-6 gap-6"
//     >
//       <Text className="text-white text-2xl">
//         Login screen {auth.isAuthenticated ? "true" : "false"}
//       </Text>
//     </ScrollView>
//   );
// }

import { useAppDispatch } from "@/hooks/hooks";
import { login } from "@/hooks/processes/auth-reducer";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = () => {
    dispatch(login());
    router.push("/dashboard");
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
            placeholder="Enter your email"
            placeholderTextColor="#64748b"
            className="bg-slate-800 text-white p-4 rounded-2xl"
          />
        </View>

        {/* Password */}
        <View className="mb-6">
          <Text className="text-slate-400 mb-2">Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#64748b"
            secureTextEntry
            className="bg-slate-800 text-white p-4 rounded-2xl"
          />
        </View>

        {/* Login Button */}
        <Pressable
          className="bg-indigo-600 p-4 rounded-2xl active:opacity-80"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Login
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
