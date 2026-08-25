import { useAppDispatch } from "@/hooks/hooks";
import { registerRequest } from "@/hooks/processes/auth-reducer";
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

function FieldRow({
  icon,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center bg-slate-800 rounded-2xl px-4 mb-4">
      <Ionicons name={icon} size={18} color="#64748b" />
      {children}
    </View>
  );
}

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    if (formState.password.length < 8) {
      return Toast.show({
        type: "error",
        text1: "Password must be at least 8 characters",
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
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-950"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 32 }}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        {/* Brand */}
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/images/elite-scope-icon.png")}
            className="w-16 h-16 rounded-2xl mb-3"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-white">Elite Scope</Text>
          <Text className="text-slate-400 mt-2">Create your account 🚀</Text>
        </View>

        {/* Card */}
        <View className="bg-slate-900 p-6 rounded-3xl shadow-lg shadow-black/40">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FieldRow icon="person-outline">
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor="#64748b"
                  className="flex-1 text-white p-4 ml-2"
                  value={formState.firstName}
                  onChangeText={(text) =>
                    setFormState({ ...formState, firstName: text })
                  }
                  textContentType="givenName"
                />
              </FieldRow>
            </View>
            <View className="flex-1">
              <FieldRow icon="person-outline">
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor="#64748b"
                  className="flex-1 text-white p-4 ml-2"
                  value={formState.lastName}
                  onChangeText={(text) =>
                    setFormState({ ...formState, lastName: text })
                  }
                  textContentType="familyName"
                />
              </FieldRow>
            </View>
          </View>

          <FieldRow icon="mail-outline">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#64748b"
              className="flex-1 text-white p-4 ml-2"
              value={formState.email}
              onChangeText={(text) => setFormState({ ...formState, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />
          </FieldRow>

          <FieldRow icon="lock-closed-outline">
            <TextInput
              placeholder="Password"
              placeholderTextColor="#64748b"
              secureTextEntry={!showPassword}
              className="flex-1 text-white p-4 ml-2"
              value={formState.password}
              onChangeText={(text) =>
                setFormState({ ...formState, password: text })
              }
              autoCapitalize="none"
              textContentType="newPassword"
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#64748b"
              />
            </Pressable>
          </FieldRow>

          <FieldRow icon="lock-closed-outline">
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#64748b"
              secureTextEntry={!showConfirm}
              className="flex-1 text-white p-4 ml-2"
              value={formState.confirmPassword}
              onChangeText={(text) =>
                setFormState({ ...formState, confirmPassword: text })
              }
              autoCapitalize="none"
              textContentType="newPassword"
            />
            <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={10}>
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#64748b"
              />
            </Pressable>
          </FieldRow>

          {/* Register Button */}
          <Pressable
            disabled={formState.loading}
            className="bg-indigo-600 p-4 rounded-2xl active:opacity-80 flex-row items-center justify-center mt-2"
            style={{ opacity: formState.loading ? 0.7 : 1 }}
            onPress={handleSignup}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {formState.loading ? "Creating..." : "Create Account"}
            </Text>
            {!formState.loading && (
              <Ionicons
                name="arrow-forward"
                size={18}
                color="white"
                style={{ marginLeft: 8 }}
              />
            )}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
