import { useAppDispatch } from "@/hooks/hooks";
import { registerRequest } from "@/hooks/processes/auth-reducer";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: "",
  });

  const handleSignup = async () => {
    if (
      !formState.firstName ||
      !formState.lastName ||
      !formState.email ||
      !formState.password ||
      !formState.confirmPassword
    ) {
      return Toast.show({
        type: "error",
        text1: "Please fill in all fields",
      });
    }
    if (formState.password !== formState.confirmPassword) {
      return Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
    }
    setFormState({ ...formState, loading: true, error: "" });
    try {
      const data = await dispatch(
        registerRequest({
          email: formState.email,
          password: formState.password,
          firstName: formState.firstName,
          lastName: formState.lastName,
        }),
      );

      if (data.meta.requestStatus === "rejected") {
        throw new Error(data.payload as string);
      }
      Toast.show({
        type: "success",
        text1: "Account created successfully! Please login.",
      });
      router.replace("/login");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error?.message || "Error during registration",
      });
    } finally {
      setFormState({ ...formState, loading: false });
    }
  };

  return (
    <View className="flex-1 bg-slate-950 justify-center px-6">
      <View className="flex-row items-center gap-2">
        <Image
          source={require("../../assets/images/elite-scope-icon.png")}
          className="w-20 h-40"
        />
        <Text className="text-4xl font-bold text-white">Elite Scope</Text>
      </View>
      {/* Title */}
      <View className="mb-10">
        <Text className="text-lg font-bold text-white">Create Account 🚀</Text>
      </View>

      
      {/* Title */}
      {/* <View className="mb-10">
        <Text className="text-4xl font-bold text-white">Create Account 🚀</Text>
        <Text className="text-slate-400 mt-2">Join us today</Text>
      </View> */}
      {/* Card */}
      <View className="bg-slate-900 p-6 rounded-3xl shadow-lg shadow-black/40">
        {/* Name */}
        <View className="mb-4">
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#64748b"
            className="bg-slate-800 text-white p-4 rounded-2xl mb-4"
            value={formState.firstName}
            onChangeText={(text) =>
              setFormState({ ...formState, firstName: text })
            }
          />
        </View>
        <View className="mb-4">
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#64748b"
            className="bg-slate-800 text-white p-4 rounded-2xl mb-4"
            value={formState.lastName}
            onChangeText={(text) =>
              setFormState({ ...formState, lastName: text })
            }
          />
        </View>
        {/* Email */}
        <View className="mb-4">
          <TextInput
            placeholder="Email"
            placeholderTextColor="#64748b"
            className="bg-slate-800 text-white p-4 rounded-2xl mb-4"
            value={formState.email}
            onChangeText={(text) => setFormState({ ...formState, email: text })}
          />
        </View>
        {/* Password */}
        <View className="mb-6">
          <TextInput
            placeholder="Password"
            placeholderTextColor="#64748b"
            secureTextEntry
            className="bg-slate-800 text-white p-4 rounded-2xl mb-4"
            value={formState.password}
            onChangeText={(text) =>
              setFormState({ ...formState, password: text })
            }
          />
        </View>
        <View className="mb-6">
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#64748b"
            secureTextEntry
            className="bg-slate-800 text-white p-4 rounded-2xl mb-4"
            value={formState.confirmPassword}
            onChangeText={(text) =>
              setFormState({ ...formState, confirmPassword: text })
            }
          />
        </View>
        {/* Register Button */}
        <Pressable
          disabled={formState.loading}
          className="bg-indigo-600 p-4 rounded-2xl active:opacity-80"
          onPress={handleSignup}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {formState.loading ? "Creating..." : "Create Account"}
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
