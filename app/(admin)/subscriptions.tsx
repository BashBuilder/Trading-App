// app/(admin)/subscriptions.tsx
import { STATUS_COLORS } from "@/constants/constants";
import { TIER_COLORS } from "@/constants/profile";
import {
  AdminSubscription,
  adminSubscriptionService,
} from "@/services/admin-subscription.service";
import { Tier, tierService } from "@/services/tier.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type StatusFilter = "all" | "active" | "cancelled" | "expired";

function HistoryModal({
  visible,
  uid,
  userName,
  onClose,
}: {
  visible: boolean;
  uid: string;
  userName: string;
  onClose: () => void;
}) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    adminSubscriptionService
      .getHistory(uid)
      .then(setHistory)
      .finally(() => setLoading(false));
  }, [visible, uid]);

  const ACTION_LABELS: Record<string, string> = {
    admin_add: "Added by Admin",
    admin_cancel: "Cancelled by Admin",
    subscribe: "Subscribed",
    cancel: "Cancelled",
    upgrade: "Upgraded",
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-slate-950">
        <View className="pt-14 px-6 pb-4 border-b border-neutral-800 flex-row justify-between items-center">
          <View>
            <Text className="text-neutral-500 text-xs uppercase tracking-widest">
              History
            </Text>
            <Text className="text-white text-lg font-bold">{userName}</Text>
          </View>
          <Pressable onPress={onClose}>
            <Text className="text-neutral-400">Close</Text>
          </Pressable>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#6366f1" />
          </View>
        ) : history.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-neutral-600">No history found</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-6 pt-4"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {history.map((item, i) => (
              <View key={i} className="flex-row gap-3 mb-4">
                <View className="items-center">
                  <View className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                  {i < history.length - 1 && (
                    <View className="w-0.5 flex-1 bg-neutral-800 mt-1" />
                  )}
                </View>
                <View className="flex-1 pb-4">
                  <Text className="text-white text-sm font-medium">
                    {ACTION_LABELS[item.action] ?? item.action}
                  </Text>
                  <Text className="text-neutral-500 text-xs mt-0.5">
                    {item.tierName}
                  </Text>
                  <Text className="text-neutral-700 text-xs mt-0.5">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

function AddSubscriptionModal({
  visible,
  onClose,
  onAdded,
  tiers,
}: {
  visible: boolean;
  onClose: () => void;
  onAdded: () => void;
  tiers: Tier[];
}) {
  // const { user } = useAppSelector((state) => state.auth);
  const [uid, setUid] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("explorer");
  const [billingCycle, setBillingCycle] = useState<string>("monthly");
  const [saving, setSaving] = useState(false);

  const BILLING_CYCLES = ["weekly", "monthly", "annual", "oneTime", "custom"];
  const [customDays, setCustomDays] = useState("30");

  const handleAdd = async () => {
    if (!uid.trim()) {
      Alert.alert("Validation", "User UID is required.");
      return;
    }
    setSaving(true);
    try {
      await adminSubscriptionService.add({
        uid: uid.trim(),
        tierId: selectedTier,
        billingCycle: billingCycle as any,
        durationDays:
          billingCycle === "custom" ? parseInt(customDays) : undefined,
      });
      Alert.alert("Success", "Subscription added successfully.");
      setUid("");
      onAdded();
      onClose();
    } catch {
      Alert.alert(
        "Error",
        "Failed to add subscription. Check the UID is correct.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-slate-950">
        <View className="pt-14 px-6 pb-4 border-b border-neutral-800 flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">Add Subscription</Text>
          <Pressable onPress={onClose}>
            <Text className="text-neutral-400">Cancel</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-6 pt-5"
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* User UID */}
          <View className="mb-4">
            <Text className="text-neutral-500 text-xs mb-1">User UID</Text>
            <TextInput
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm"
              placeholder="Firebase User UID"
              placeholderTextColor="#525252"
              value={uid}
              onChangeText={setUid}
              autoCapitalize="none"
            />
            <Text className="text-neutral-600 text-xs mt-1">
              Find this in Firebase Auth or from subscription list
            </Text>
          </View>

          {/* Tier selection */}
          <View className="mb-4">
            <Text className="text-neutral-500 text-xs mb-2">Tier</Text>
            <View className="gap-2">
              {tiers.map((tier) => (
                <Pressable
                  key={tier.id}
                  onPress={() => setSelectedTier(tier.id)}
                  className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${
                    selectedTier === tier.id
                      ? "bg-indigo-600/15 border-indigo-500/40"
                      : "bg-neutral-900 border-neutral-800"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedTier === tier.id
                        ? "text-white"
                        : "text-neutral-400"
                    }`}
                  >
                    {tier.name}
                  </Text>
                  {selectedTier === tier.id && (
                    <Text className="text-indigo-400 text-xs">✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Billing cycle */}
          <View className="mb-4">
            <Text className="text-neutral-500 text-xs mb-2">Billing Cycle</Text>
            <View className="flex-row flex-wrap gap-2">
              {BILLING_CYCLES.map((cycle) => (
                <Pressable
                  key={cycle}
                  onPress={() => setBillingCycle(cycle)}
                  className={`px-4 py-2 rounded-xl border ${
                    billingCycle === cycle
                      ? "bg-indigo-600 border-indigo-500"
                      : "bg-neutral-900 border-neutral-800"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium capitalize ${
                      billingCycle === cycle ? "text-white" : "text-neutral-400"
                    }`}
                  >
                    {cycle === "oneTime" ? "Lifetime" : cycle}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Custom days */}
          {billingCycle === "custom" && (
            <View className="mb-4">
              <Text className="text-neutral-500 text-xs mb-1">
                Duration (days)
              </Text>
              <TextInput
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm"
                placeholder="30"
                placeholderTextColor="#525252"
                keyboardType="numeric"
                value={customDays}
                onChangeText={setCustomDays}
              />
            </View>
          )}

          <Pressable
            onPress={handleAdd}
            disabled={saving}
            className="bg-indigo-600 py-4 rounded-2xl items-center mt-2"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Add Subscription</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

function SubscriptionRow({
  sub,
  onCancel,
  onViewHistory,
}: {
  sub: AdminSubscription;
  onCancel: () => void;
  onViewHistory: () => void;
}) {
  const statusColor = STATUS_COLORS[sub.status] ?? STATUS_COLORS.expired;
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
          <Text className="text-neutral-700 text-xs mt-0.5 font-mono">
            {sub.uid}
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
          <Text className={`text-sm font-semibold ${tierColor}`}>
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
        <Pressable
          onPress={onViewHistory}
          className="flex-1 py-2 bg-neutral-800 border border-neutral-700 rounded-xl items-center"
        >
          <Text className="text-neutral-300 text-xs font-medium">History</Text>
        </Pressable>

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

export default function AdminSubscriptionsScreen() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [historyUid, setHistoryUid] = useState<string | null>(null);
  const [historyName, setHistoryName] = useState("");

  const fetchData = async () => {
    try {
      const [subs, tierList] = await Promise.all([
        adminSubscriptionService.getAll(statusFilter),
        tierService.getAll(),
      ]);
      setSubscriptions(subs);
      setTiers(tierList);
    } catch {
      Alert.alert("Error", "Failed to load subscriptions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      fetchData();
      return;
    }
    setSearching(true);
    try {
      const results = await adminSubscriptionService.searchByEmail(
        searchEmail.trim(),
      );
      setSubscriptions(results);
    } catch {
      Alert.alert("Error", "Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = (sub: AdminSubscription) => {
    Alert.alert(
      "Cancel Subscription",
      `Cancel ${sub.user.email}'s ${sub.tierName} subscription?`,
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: async () => {
            try {
              await adminSubscriptionService.cancel(sub.uid);
              fetchData();
            } catch {
              Alert.alert("Error", "Failed to cancel subscription.");
            }
          },
        },
      ],
    );
  };

  const counts = {
    active: subscriptions.filter((s) => s.status === "active").length,
    cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
    expired: subscriptions.filter((s) => s.status === "expired").length,
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="pt-14 px-6 pb-4 border-b border-neutral-800">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-neutral-500 text-xs uppercase tracking-widest">
              Admin
            </Text>
            <Text className="text-white text-2xl font-bold">Subscriptions</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => router.back()}
              className="px-3 py-2 bg-neutral-800 rounded-xl"
            >
              <Text className="text-neutral-400 text-xs">← Back</Text>
            </Pressable>
            <Pressable
              onPress={() => setAddModalVisible(true)}
              className="px-4 py-2 bg-indigo-600 rounded-xl"
            >
              <Text className="text-white text-xs font-semibold">+ Add</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2 mb-3">
          <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl py-2 items-center">
            <Text className="text-emerald-400 font-bold">{counts.active}</Text>
            <Text className="text-neutral-600 text-xs">Active</Text>
          </View>
          <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl py-2 items-center">
            <Text className="text-red-400 font-bold">{counts.cancelled}</Text>
            <Text className="text-neutral-600 text-xs">Cancelled</Text>
          </View>
          <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl py-2 items-center">
            <Text className="text-neutral-500 font-bold">{counts.expired}</Text>
            <Text className="text-neutral-600 text-xs">Expired</Text>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm"
            placeholder="Search by email..."
            placeholderTextColor="#525252"
            value={searchEmail}
            onChangeText={setSearchEmail}
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Pressable
            onPress={handleSearch}
            disabled={searching}
            className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl"
          >
            {searching ? (
              <ActivityIndicator color="#6366f1" size="small" />
            ) : (
              <Text className="text-neutral-300 text-sm">Search</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 pt-3 pb-1 max-h-12"
      >
        {(["all", "active", "cancelled", "expired"] as StatusFilter[]).map(
          (f) => (
            <Pressable
              key={f}
              onPress={() => {
                setSearchEmail("");
                setStatusFilter(f);
              }}
              className={`px-4 py-1.5 mr-2 rounded-xl border ${
                statusFilter === f
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-neutral-900 border-neutral-800"
              }`}
            >
              <Text
                className={`text-xs font-medium capitalize ${
                  statusFilter === f ? "text-white" : "text-neutral-400"
                }`}
              >
                {f}
              </Text>
            </Pressable>
          ),
        )}
      </ScrollView>

      {/* List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6366f1" size="large" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-3"
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchData();
              }}
              tintColor="#6366f1"
            />
          }
        >
          {subscriptions.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-neutral-600 text-sm">
                No subscriptions found
              </Text>
            </View>
          ) : (
            subscriptions.map((sub) => (
              <SubscriptionRow
                key={sub.uid}
                sub={sub}
                onCancel={() => handleCancel(sub)}
                onViewHistory={() => {
                  setHistoryUid(sub.uid);
                  setHistoryName(
                    [sub.user.firstName, sub.user.lastName]
                      .filter(Boolean)
                      .join(" ") || sub.user.email,
                  );
                }}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Modals */}
      <AddSubscriptionModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdded={fetchData}
        tiers={tiers}
      />

      {historyUid && (
        <HistoryModal
          visible={!!historyUid}
          uid={historyUid}
          userName={historyName}
          onClose={() => setHistoryUid(null)}
        />
      )}
    </View>
  );
}
