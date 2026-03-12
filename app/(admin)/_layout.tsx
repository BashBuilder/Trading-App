import { useAppSelector } from "@/hooks/hooks";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AdminLayout() {
  const user = useAppSelector((state) => state.auth.user);

  // Still loading user from Redux — wait before redirecting
  if (user === undefined) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#020617",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#6366f1" />
      </View>
    );
  }

  // Not an admin — silently redirect back to app
  if (!user || user.role !== "admin") {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
        contentStyle: { backgroundColor: "#020617" },
      }}
    />
  );
}
