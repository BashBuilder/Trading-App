// app/(admin)/_layout.tsx
import { useAppSelector } from "@/hooks/hooks";
import { Redirect, Stack } from "expo-router";

export default function AdminLayout() {
  const user = useAppSelector((state) => state.auth.user);

  // Role check — only admins can access this group
  if (!user || user.role !== "admin") {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
