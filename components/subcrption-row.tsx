import { STATUS_COLORS } from "@/constants/constants";
import { TIER_COLORS } from "@/constants/profile";
import { AdminSubscription } from "@/services/admin-subscription.service";
import { Pressable, Text, View } from "react-native";

export function SubscriptionRow({
  sub,
  onCancel,
  onAdd,
  onViewHistory,
}: {
  sub: AdminSubscription;
  onCancel: () => void;
  onAdd: () => void;
  onViewHistory: () => void;
}) {
  const statusColor = STATUS_COLORS[sub?.status] ?? STATUS_COLORS.expired ?? "";
  const tierColor = TIER_COLORS[sub.tierId] ?? "text-neutral-400";

  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-3">
      {/* User info */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-white font-semibold text-sm">
            {[sub.user.firstName, sub.user.lastName]
              .filter(Boolean)
              .join(" ") || "—"}
          </Text>
          <Text className="text-neutral-500 text-xs mt-0.5">
            {sub.user.email}
          </Text>
        </View>

        <View className={`px-2.5 py-1 rounded-full ${statusColor.bg}`}>
          <Text
            className={`text-xs font-semibold capitalize ${statusColor.text}`}
          >
            {sub.status}
          </Text>
        </View>
      </View>

      {/* Subscription details */}
      <View className="flex-row justify-between items-center mb-3 py-2.5 bg-neutral-800/50 rounded-xl px-3">
        <View>
          <Text className={`text-sm font-semibold ${tierColor?.text}`}>
            {sub.tierName}
          </Text>
          <Text className="text-neutral-600 text-xs capitalize mt-0.5">
            {sub.billingCycle === "oneTime" ? "Lifetime" : sub.billingCycle}
            {sub.addedByAdmin && " · Admin added"}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-white text-sm font-bold">${sub.price}</Text>
          {sub.expiresAt && (
            <Text className="text-neutral-600 text-xs mt-0.5">
              Exp.{" "}
              {new Date(sub.expiresAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          )}
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-2">
        {/* <Pressable
          onPress={onViewHistory}
          className="flex-1 py-2 bg-neutral-800 border border-neutral-700 rounded-xl items-center"
        >
          <Text className="text-neutral-300 text-xs font-medium">History</Text>
        </Pressable> */}

        {sub.status === "active" && (
          <Pressable
            onPress={onCancel}
            className="flex-1 py-2 bg-red-500/10 border border-red-500/20 rounded-xl items-center"
          >
            <Text className="text-red-400 text-xs font-medium">Cancel</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
