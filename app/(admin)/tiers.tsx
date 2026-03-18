// app/(admin)/tiers.tsx
import {
  Tier,
  TierCapability,
  TierPrice,
  tierService,
} from "@/services/tier.service";
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

const CAPABILITY_LABELS: Record<string, string> = {
  coreSignals: "Core Signals",
  advancedIndicators: "Advanced Indicators",
  analytics: "Analytics",
};

const ALL_CAPABILITIES: TierCapability[] = [
  "coreSignals",
  "advancedIndicators",
  "analytics",
];

const TIER_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  explorer: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/40",
  },
  strategist: {
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/40",
  },
  mathematician: {
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/40",
  },
};

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View className="flex-1">
      <Text className="text-neutral-500 text-xs mb-1">{label}</Text>
      <View className="flex-row items-center bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5">
        <Text className="text-neutral-500 text-sm mr-1">$</Text>
        <TextInput
          className="flex-1 text-white text-sm"
          keyboardType="numeric"
          value={String(value)}
          onChangeText={(v) => onChange(parseFloat(v) || 0)}
          placeholderTextColor="#525252"
        />
      </View>
    </View>
  );
}

function EditTierModal({
  tier,
  visible,
  onClose,
  onSave,
}: {
  tier: Tier;
  visible: boolean;
  onClose: () => void;
  onSave: (updated: Partial<Tier>) => Promise<void>;
}) {
  const [name, setName] = useState(tier.name);
  const [description, setDescription] = useState(tier.description);
  const [capabilities, setCapabilities] = useState<TierCapability[]>(
    tier.capabilities,
  );
  const [price, setPrice] = useState<TierPrice>({ ...tier.price });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(tier.name);
    setDescription(tier.description);
    setCapabilities([...tier.capabilities]);
    setPrice({ ...tier.price });
  }, [tier, visible]);

  const toggleCapability = (cap: TierCapability) => {
    setCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap],
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Tier name is required.");
      return;
    }
    setSaving(true);
    await onSave({ name, description, capabilities, price });
    setSaving(false);
  };

  const colors = TIER_COLORS[tier.id] ?? TIER_COLORS.explorer;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-slate-950">
        {/* Header */}
        <View className="pt-14 px-6 pb-4 border-b border-neutral-800 flex-row justify-between items-center">
          <View>
            <Text className="text-neutral-500 text-xs uppercase tracking-widest">
              Editing
            </Text>
            <Text className="text-white text-xl font-bold">{tier.name}</Text>
          </View>
          <Pressable onPress={onClose}>
            <Text className="text-neutral-400">Cancel</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-6 pt-5"
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* Name */}
          <View className="mb-4">
            <Text className="text-neutral-500 text-xs mb-1">Tier Name</Text>
            <TextInput
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#525252"
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-neutral-500 text-xs mb-1">Description</Text>
            <TextInput
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm h-20"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#525252"
            />
          </View>

          {/* Capabilities */}
          <View className="mb-4">
            <Text className="text-neutral-500 text-xs mb-2">Capabilities</Text>
            <View className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              {ALL_CAPABILITIES.map((cap, i) => {
                const enabled = capabilities.includes(cap);
                return (
                  <Pressable
                    key={cap}
                    onPress={() => toggleCapability(cap)}
                    className={`flex-row items-center justify-between px-4 py-3.5 ${
                      i < ALL_CAPABILITIES.length - 1
                        ? "border-b border-neutral-800"
                        : ""
                    }`}
                  >
                    <Text
                      className={`text-sm ${enabled ? "text-white" : "text-neutral-600"}`}
                    >
                      {CAPABILITY_LABELS[cap]}
                    </Text>
                    <View
                      className={`w-10 h-6 rounded-full items-center justify-center ${
                        enabled ? "bg-indigo-600" : "bg-neutral-700"
                      }`}
                    >
                      <View
                        className={`w-4 h-4 rounded-full bg-white ${
                          enabled ? "translate-x-2" : "-translate-x-1"
                        }`}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Pricing */}
          <View className="mb-6">
            <Text className="text-neutral-500 text-xs mb-2">Pricing</Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <PriceInput
                  label="Weekly"
                  value={price.weekly}
                  onChange={(v) => setPrice((p) => ({ ...p, weekly: v }))}
                />
                <PriceInput
                  label="Monthly"
                  value={price.monthly}
                  onChange={(v) => setPrice((p) => ({ ...p, monthly: v }))}
                />
              </View>
              <View className="flex-row gap-3">
                <PriceInput
                  label="Annual"
                  value={price.annual}
                  onChange={(v) => setPrice((p) => ({ ...p, annual: v }))}
                />
                <PriceInput
                  label="One-Time"
                  value={price.oneTime}
                  onChange={(v) => setPrice((p) => ({ ...p, oneTime: v }))}
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            className="bg-indigo-600 py-4 rounded-2xl items-center"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Save Changes</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

function TierCard({ tier, onEdit }: { tier: Tier; onEdit: () => void }) {
  const colors = TIER_COLORS[tier.id] ?? TIER_COLORS.explorer;

  return (
    <View
      className={`bg-neutral-900 border ${colors.border} rounded-2xl p-5 mb-4`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-white font-bold text-base">{tier.name}</Text>
          <Text className="text-neutral-500 text-xs mt-1 leading-4">
            {tier.description}
          </Text>
        </View>
        <Pressable
          onPress={onEdit}
          className={`px-3 py-1.5 rounded-xl border ${colors.border} ${colors.bg}`}
        >
          <Text className={`text-xs font-semibold ${colors.text}`}>Edit</Text>
        </Pressable>
      </View>

      {/* Capabilities */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        {tier.capabilities.map((cap) => (
          <View key={cap} className="px-2.5 py-1 bg-neutral-800 rounded-lg">
            <Text className="text-neutral-400 text-xs">
              {CAPABILITY_LABELS[cap]}
            </Text>
          </View>
        ))}
      </View>

      {/* Prices */}
      <View className="flex-row justify-between pt-3 border-t border-neutral-800">
        {(["weekly", "monthly", "annual", "oneTime"] as const).map((cycle) => (
          <View key={cycle} className="items-center">
            <Text className={`font-bold text-sm ${colors.text}`}>
              ${tier.price[cycle]}
            </Text>
            <Text className="text-neutral-600 text-xs capitalize">
              {cycle === "oneTime" ? "Once" : cycle}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function AdminTiersScreen() {
  const router = useRouter();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);

  const fetchTiers = async () => {
    try {
      const data = await tierService.getAll();
      setTiers(data);
    } catch {
      Alert.alert("Error", "Failed to load tiers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleSave = async (updated: Partial<Tier>) => {
    if (!editingTier) return;
    try {
      await tierService.adminUpdate(editingTier.id, updated);
      Alert.alert("Saved", "Tier updated successfully.");
      setEditingTier(null);
      fetchTiers();
    } catch {
      Alert.alert("Error", "Failed to update tier.");
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="pt-14 px-6 pb-4 border-b border-neutral-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-neutral-500 text-xs uppercase tracking-widest">
              Admin
            </Text>
            <Text className="text-white text-2xl font-bold">Tiers</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="px-3 py-2 bg-neutral-800 rounded-xl"
          >
            <Text className="text-neutral-400 text-xs">← Back</Text>
          </Pressable>
        </View>
        <Text className="text-neutral-500 text-sm mt-1">
          Manage subscription tier pricing and capabilities
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6366f1" size="large" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchTiers();
              }}
              tintColor="#6366f1"
            />
          }
        >
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              onEdit={() => setEditingTier(tier)}
            />
          ))}
        </ScrollView>
      )}

      {editingTier && (
        <EditTierModal
          tier={editingTier}
          visible={!!editingTier}
          onClose={() => setEditingTier(null)}
          onSave={handleSave}
        />
      )}
    </View>
  );
}
