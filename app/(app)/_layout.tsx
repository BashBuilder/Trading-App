import axios from "@/config/axios";
import { useAppDispatch } from "@/hooks/hooks";
import { updateUser } from "@/hooks/processes/auth-reducer";
import { clearToken, getToken } from "@/services/token.service";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
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
          bottom: 10,
          left: 10,
          right: 10,
          elevation: 0,
          // backgroundColor: "#020617",
          backgroundColor: "#000",
          borderRadius: 32,
          height: 75,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
        },

        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#64748b",

        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 6,
          fontWeight: "500",
        },

        tabBarItemStyle: {
          paddingTop: 8,
        },
      }}
    >
      {/* Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-2 rounded-xl ${focused ? "bg-indigo-600/20" : ""}`}
            >
              <Ionicons
                name={focused ? "analytics" : "analytics-outline"}
                size={13}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Tools */}
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-2 rounded-xl ${focused ? "bg-indigo-600/20" : ""}`}
            >
              <Ionicons
                name={focused ? "construct" : "construct-outline"}
                size={13}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Insights */}
      <Tabs.Screen
        name="insights"
        options={{
          title: "Signals",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-2 rounded-xl ${focused ? "bg-indigo-600/20" : ""}`}
            >
              <Ionicons
                name={focused ? "pulse" : "pulse-outline"}
                size={13}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Subscription */}
      <Tabs.Screen
        name="paywall"
        options={{
          title: "Pro",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-2 rounded-xl ${focused ? "bg-indigo-600/20" : ""}`}
            >
              <Ionicons
                name={focused ? "diamond" : "diamond-outline"}
                size={13}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* History */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-2  rounded-xl ${focused ? "bg-indigo-600/20" : ""}`}
            >
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={13}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
