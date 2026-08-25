// app/(admin)/index.tsx
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

const ADMIN_SECTIONS = [
  {
    title: "Signals",
    description: "Create, edit and close trading signals",
    icon: "📡",
    route: "/(admin)/signals",
    color: "border-indigo-500/40 bg-indigo-500/5",
    textColor: "text-indigo-400",
  },
  {
    title: "Tiers",
    description: "Manage pricing, capabilities and tier details",
    icon: "💎",
    route: "/(admin)/tiers",
    color: "border-cyan-500/40 bg-cyan-500/5",
    textColor: "text-cyan-400",
  },
  {
    title: "Subscriptions",
    description: "View, add and manage user subscriptions",
    icon: "👥",
    route: "/(admin)/subscriptions",
    color: "border-violet-500/40 bg-violet-500/5",
    textColor: "text-violet-400",
  },
];

export default function AdminIndexScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-950 px-6 pt-14">
      {/* Header */}
      <View className="mb-8">
        <Image
          source={require("../../assets/images/elite-scope-icon.png")}
          alt="EliteScope"
          className="w-12 h-12 rounded-xl mb-3"
          resizeMode="contain"
        />
        <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-1">
          EliteScope
        </Text>
        <Text className="text-white text-3xl font-bold">Admin Panel</Text>
        <Text className="text-neutral-500 text-sm mt-1">
          Manage your platform
        </Text>
      </View>

      {/* Section cards */}
      <View className="gap-4">
        {ADMIN_SECTIONS.map((section) => (
          <Pressable
            key={section.title}
            onPress={() => router.push(section.route as any)}
            className={`p-5 rounded-2xl border ${section.color}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-3xl">{section.icon}</Text>
                <View className="flex-1">
                  <Text className={`font-bold text-base ${section.textColor}`}>
                    {section.title}
                  </Text>
                  <Text className="text-neutral-500 text-xs mt-0.5">
                    {section.description}
                  </Text>
                </View>
              </View>
              <Text className="text-neutral-600 text-lg">→</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Back to app */}
      <Pressable
        onPress={() => router.replace("/(app)/dashboard")}
        className="mt-8 py-3 items-center border border-neutral-800 rounded-2xl"
      >
        <Text className="text-neutral-500 text-sm">← Back to App</Text>
      </Pressable>
    </View>
  );
}
