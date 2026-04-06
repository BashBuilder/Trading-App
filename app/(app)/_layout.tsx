import axios from "@/config/axios";
import { useAppDispatch } from "@/hooks/hooks";
import { updateUser } from "@/hooks/processes/auth-reducer";
import { clearToken, getToken } from "@/services/token.service";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const TAB_BAR_HEIGHT = 60;
  const BOTTOM_MARGIN = 12;

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      const user = await axios.get("auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(updateUser(user.data));
    } catch (error) {
      clearToken();
      router.replace("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: BOTTOM_MARGIN + insets.bottom,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#0a0a0f",
          borderRadius: 36,
          height: 68,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(99, 102, 241, 0.15)",
          shadowColor: "#6366f1",
          shadowOpacity: 0.12,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
        },
        tabBarActiveTintColor: "#818cf8",
        tabBarInactiveTintColor: "#374151",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.3,
          marginBottom: 8,
        },
        tabBarItemStyle: {
          paddingTop: 10,
        },
      }}
    >
      {/* ── Visible tabs ───────────────────────────────────── */}

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                backgroundColor: focused
                  ? "rgba(99,102,241,0.18)"
                  : "transparent",
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={18}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                backgroundColor: focused
                  ? "rgba(99,102,241,0.18)"
                  : "transparent",
              }}
            >
              <Ionicons
                name={focused ? "construct" : "construct-outline"}
                size={18}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Centre focal tab — Signals */}
      <Tabs.Screen
        name="insights/index"
        options={{
          title: "Signals",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: focused ? "#6366f1" : "#1e1b4b",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                borderWidth: 2,
                borderColor: focused ? "#818cf8" : "rgba(99,102,241,0.25)",
                shadowColor: "#6366f1",
                shadowOpacity: focused ? 0.5 : 0.2,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: focused ? 8 : 3,
              }}
            >
              <Ionicons
                name={focused ? "pulse" : "pulse-outline"}
                size={22}
                color={focused ? "#ffffff" : "#818cf8"}
              />
            </View>
          ),
          tabBarLabel: () => null, // hide label for centre tab
        }}
      />

      <Tabs.Screen
        name="paywall"
        options={{
          title: "Pro",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                backgroundColor: focused
                  ? "rgba(99,102,241,0.18)"
                  : "transparent",
              }}
            >
              <Ionicons
                name={focused ? "diamond" : "diamond-outline"}
                size={18}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 36,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                backgroundColor: focused
                  ? "rgba(99,102,241,0.18)"
                  : "transparent",
              }}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={18}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* ── Hidden routes (not tabs) ────────────────────────── */}

      {/* Hides the insights/[id] signal detail from tab bar */}
      <Tabs.Screen name="insights/[id]" options={{ href: null }} />
      {/* <Tabs.Screen name="insight/[id]" options={{ href: null }} /> */}
    </Tabs>
  );
}
