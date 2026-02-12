import { Link, useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const handleSignup = () => {
    // dispatch(login());
    router.push("/dashboard");
  };
  return (
    <View className="flex-1 bg-slate-950 justify-center px-6">
      {/* Title */}
      <View className="mb-10">
        <Text className="text-4xl font-bold text-white">Create Account 🚀</Text>
        <Text className="text-slate-400 mt-2">Join us today</Text>
      </View>

      {/* Card */}
      <View className="bg-slate-900 p-6 rounded-3xl shadow-lg shadow-black/40">
        {/* Name */}
        <View className="mb-4">
          <Text className="text-slate-400 mb-2">Full Name</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#64748b"
            className="bg-slate-800 text-white p-4 rounded-2xl"
          />
        </View>

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
            placeholder="Create a password"
            placeholderTextColor="#64748b"
            secureTextEntry
            className="bg-slate-800 text-white p-4 rounded-2xl"
          />
        </View>

        {/* Register Button */}
        <Pressable
          className="bg-indigo-600 p-4 rounded-2xl active:opacity-80"
          onPress={handleSignup}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Create Account
          </Text>
        </Pressable>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-400">Already have an account?</Text>
          <Link href="/login" asChild>
            <Pressable>
              <Text className="text-indigo-500 font-semibold ml-2">Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
