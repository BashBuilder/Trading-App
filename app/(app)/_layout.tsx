import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
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
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-2 rounded-xl ${focused ? "bg-indigo-600/20" : ""}`}
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

      {/* Hidden */}
      <Tabs.Screen
        name="Dashboard"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
