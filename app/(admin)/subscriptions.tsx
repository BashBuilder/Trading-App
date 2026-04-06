// app/(admin)/subscriptions.tsx
import AddSubscriptionModal from "@/components/modals/add-subscription";
import { SubscriptionRow } from "@/components/subcrption-row";
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
  const [addDraft, setAddDraft] = useState<{
    uid?: string;
    tierId?: string;
    billingCycle?: string;
  }>({});
  const [historyUid, setHistoryUid] = useState<string | null>(null);
  const [historyName, setHistoryName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subs, tierList] = await Promise.all([
        adminSubscriptionService.getAll(statusFilter),
        tierService.getAll(),
      ]);
      setSubscriptions(subs);
      setTiers(tierList);
    } catch (error: any) {
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
              await adminSubscriptionService.cancel(sub.id);
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
              onPress={() => {
                setAddDraft({});
                setAddModalVisible(true);
              }}
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
                onAdd={() => {
                  setAddDraft({
                    uid: sub.uid,
                    tierId: sub.tierId,
                    billingCycle: sub.billingCycle,
                  });
                  setAddModalVisible(true);
                }}
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
        onClose={() => {
          setAddModalVisible(false);
          setAddDraft({});
        }}
        onAdded={fetchData}
        tiers={tiers}
        initialUid={addDraft.uid}
        initialTierId={addDraft.tierId}
        initialBillingCycle={addDraft.billingCycle}
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
