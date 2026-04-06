import {
  AdminUserOption,
  adminSubscriptionService,
} from "@/services/admin-subscription.service";
import { Tier } from "@/services/tier.service";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddSubscriptionModal({
  visible,
  onClose,
  onAdded,
  tiers,
  initialUid,
  initialTierId,
  initialBillingCycle,
}: {
  visible: boolean;
  onClose: () => void;
  onAdded: () => void;
  tiers: Tier[];
  initialUid?: string;
  initialTierId?: string;
  initialBillingCycle?: string;
}) {
  // const { user } = useAppSelector((state) => state.auth);
  const [uid, setUid] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("explorer");
  const [billingCycle, setBillingCycle] = useState<string>("monthly");
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const BILLING_CYCLES = ["weekly", "monthly", "annual", "oneTime", "custom"];
  const [customDays, setCustomDays] = useState("30");

  useEffect(() => {
    if (!visible) return;
    setUid(initialUid ?? "");
    setSelectedTier(initialTierId ?? "explorer");
    setBillingCycle(initialBillingCycle ?? "monthly");
    setCustomDays("30");
  }, [visible, initialUid, initialTierId, initialBillingCycle]);

  useEffect(() => {
    if (!visible) return;
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const list = await adminSubscriptionService.getUsers();
        setUsers(Array.isArray(list) ? list : []);
      } catch {
        Alert.alert("Error", "Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [visible]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [user.email, user.firstName, user.lastName, user.uid]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [users, userSearch]);

  const selectedUser = users.find((user) => user.uid === uid);

  const getUserLabel = (user?: AdminUserOption) => {
    if (!user) return fullName || "Select user";
    const userName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    if (userName) return userName;
    if (user.email) return user.email;
    return "";
  };

  const handleAdd = async () => {
    console.log(uid);
    if (!uid) {
      Alert.alert("Validation", "User UID is required.");
      return;
    }
    setSaving(true);
    try {
      await adminSubscriptionService.add({
        uid: uid.toLowerCase().trim(),
        tierId: selectedTier,
        billingCycle: billingCycle as any,
        durationDays:
          billingCycle === "custom" ? parseInt(customDays) : undefined,
      });

      Alert.alert("Success", "Subscription added successfully.");
      setUid("");
      onAdded();
      onClose();
      setFullName("");
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
          {/* User selection */}
          <View className="mb-4">
            <Text className="text-neutral-500 text-xs mb-1">User</Text>
            <Pressable
              onPress={() => setUserDropdownOpen((prev) => !prev)}
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3"
            >
              <Text className="text-white text-sm">
                {getUserLabel(selectedUser)}
              </Text>
            </Pressable>
            {userDropdownOpen && (
              <View className="mt-2 bg-neutral-900 border border-neutral-800 rounded-xl p-2">
                <TextInput
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm mb-2"
                  placeholder="Search users..."
                  placeholderTextColor="#525252"
                  value={userSearch}
                  onChangeText={setUserSearch}
                  autoCapitalize="none"
                />
                {loadingUsers ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator color="#6366f1" />
                  </View>
                ) : (
                  <ScrollView className="max-h-48">
                    {filteredUsers.length === 0 ? (
                      <Text className="text-neutral-500 text-xs px-2 py-2">
                        No users found
                      </Text>
                    ) : (
                      filteredUsers.map((user) => (
                        <Pressable
                          key={user.email}
                          onPress={() => {
                            setUid(user.email!);
                            setFullName(
                              `${user.firstName || ""} ${user.lastName || ""} `,
                            );
                            setUserDropdownOpen(false);
                          }}
                          className={`px-3 py-2.5 rounded-lg mb-1 ${
                            uid === user.email
                              ? "bg-indigo-600/20 border border-indigo-500/30"
                              : "bg-neutral-800"
                          }`}
                        >
                          <Text className="text-white text-sm">
                            {getUserLabel(user)}
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </ScrollView>
                )}
              </View>
            )}
            <Text className="text-neutral-600 text-xs mt-1">
              Select one user to continue.
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
                    className={`text-xs font-medium capitalize ${billingCycle === cycle ? "text-white" : "text-neutral-400"}`}
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
