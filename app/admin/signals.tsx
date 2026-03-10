// app/(admin)/signals.tsx
import {
  CreateSignalPayload,
  Signal,
  SignalDirection,
  SignalStatus,
  SignalTier,
  signalService,
} from "@/services/signal.service";
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

const TIER_COLORS: Record<string, { text: string; bg: string }> = {
  explorer: { text: "text-cyan-400", bg: "bg-cyan-500/10" },
  strategist: { text: "text-indigo-400", bg: "bg-indigo-500/10" },
  mathematician: { text: "text-violet-400", bg: "bg-violet-500/10" },
};

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  active: { text: "text-emerald-400", bg: "bg-emerald-500/10" },
  draft: { text: "text-yellow-400", bg: "bg-yellow-500/10" },
  closed: { text: "text-neutral-500", bg: "bg-neutral-800" },
};

const EMPTY_FORM: CreateSignalPayload = {
  pair: "",
  timeframe: "H1",
  direction: "Long",
  confidence: 75,
  tier: "explorer",
  summary: "",
  entry: undefined,
  stopLoss: undefined,
  takeProfit: undefined,
  chartImageUrl: "",
  analystNotes: "",
  status: "active",
};

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  numeric,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  numeric?: boolean;
  multiline?: boolean;
}) {
  return (
    <View className="mb-3">
      <Text className="text-neutral-500 text-xs mb-1">{label}</Text>
      <TextInput
        className={`bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm ${multiline ? "h-24" : ""}`}
        placeholder={placeholder}
        placeholderTextColor="#525252"
        keyboardType={numeric ? "numeric" : "default"}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

function SegmentControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="text-neutral-500 text-xs mb-1">{label}</Text>
      <View className="flex-row bg-neutral-800 rounded-xl p-1 flex-wrap gap-1">
        {options.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg ${value === opt ? "bg-indigo-600" : ""}`}
          >
            <Text
              className={`text-xs font-medium capitalize ${value === opt ? "text-white" : "text-neutral-400"}`}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function SignalFormModal({
  visible,
  onClose,
  onSave,
  initial,
  editId,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateSignalPayload, id?: string) => Promise<void>;
  initial: CreateSignalPayload;
  editId?: string;
}) {
  const [form, setForm] = useState<CreateSignalPayload>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [initial, visible]);

  const set = (key: keyof CreateSignalPayload, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!form.pair || !form.summary) {
      Alert.alert("Validation", "Pair and summary are required.");
      return;
    }
    setSaving(true);
    await onSave(form, editId);
    setSaving(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-slate-950">
        {/* Header */}
        <View className="px-6 pt-14 pb-4 border-b border-neutral-800 flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">
            {editId ? "Edit Signal" : "New Signal"}
          </Text>
          <Pressable onPress={onClose}>
            <Text className="text-neutral-400 text-base">Cancel</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-6 pt-5"
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <FormField
            label="Pair (e.g. EURUSD)"
            value={form.pair}
            onChangeText={(v) => set("pair", v.toUpperCase())}
            placeholder="EURUSD"
          />

          <SegmentControl
            label="Direction"
            options={["Long", "Short"] as SignalDirection[]}
            value={form.direction}
            onChange={(v) => set("direction", v)}
          />

          <SegmentControl
            label="Timeframe"
            options={["M15", "M30", "H1", "H4", "D1"]}
            value={form.timeframe}
            onChange={(v) => set("timeframe", v)}
          />

          <SegmentControl
            label="Tier"
            options={
              ["explorer", "strategist", "mathematician"] as SignalTier[]
            }
            value={form.tier}
            onChange={(v) => set("tier", v)}
          />

          <SegmentControl
            label="Status"
            options={["active", "draft", "closed"] as SignalStatus[]}
            value={form.status ?? "active"}
            onChange={(v) => set("status", v)}
          />

          <FormField
            label="Confidence (0–100)"
            value={String(form.confidence)}
            onChangeText={(v) => set("confidence", parseInt(v) || 0)}
            numeric
          />

          <FormField
            label="Summary"
            value={form.summary}
            onChangeText={(v) => set("summary", v)}
            placeholder="Brief description of the signal..."
            multiline
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Entry Price"
                value={form.entry ? String(form.entry) : ""}
                onChangeText={(v) => set("entry", parseFloat(v) || undefined)}
                placeholder="1.0850"
                numeric
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Stop Loss"
                value={form.stopLoss ? String(form.stopLoss) : ""}
                onChangeText={(v) =>
                  set("stopLoss", parseFloat(v) || undefined)
                }
                placeholder="1.0820"
                numeric
              />
            </View>
          </View>

          <FormField
            label="Take Profit"
            value={form.takeProfit ? String(form.takeProfit) : ""}
            onChangeText={(v) => set("takeProfit", parseFloat(v) || undefined)}
            placeholder="1.0920"
            numeric
          />

          <FormField
            label="Chart Image URL"
            value={form.chartImageUrl ?? ""}
            onChangeText={(v) => set("chartImageUrl", v)}
            placeholder="https://..."
          />

          <FormField
            label="Analyst Notes"
            value={form.analystNotes ?? ""}
            onChangeText={(v) => set("analystNotes", v)}
            placeholder="Detailed analyst commentary..."
            multiline
          />

          <Pressable
            onPress={handleSave}
            disabled={saving}
            className="bg-indigo-600 py-4 rounded-2xl items-center mt-4"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">
                {editId ? "Save Changes" : "Publish Signal"}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

function AdminSignalRow({
  signal,
  onEdit,
  onClose,
}: {
  signal: Signal;
  onEdit: () => void;
  onClose: () => void;
}) {
  const isLong = signal.direction === "Long";
  const tierColor = TIER_COLORS[signal.tier] ?? TIER_COLORS.explorer;
  const statusColor = STATUS_COLORS[signal.status ?? "active"];

  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-white font-bold">{signal.pair}</Text>
          <Text className="text-neutral-600 text-xs">{signal.timeframe}</Text>
          <View
            className={`px-2 py-0.5 rounded-md ${isLong ? "bg-emerald-500/15" : "bg-red-500/15"}`}
          >
            <Text
              className={`text-xs font-medium ${isLong ? "text-emerald-400" : "text-red-400"}`}
            >
              {signal.direction}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <View className={`px-2 py-0.5 rounded-full ${tierColor.bg}`}>
            <Text className={`text-xs capitalize ${tierColor.text}`}>
              {signal.tier}
            </Text>
          </View>
          <View className={`px-2 py-0.5 rounded-full ${statusColor.bg}`}>
            <Text className={`text-xs capitalize ${statusColor.text}`}>
              {signal.status}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-neutral-500 text-xs mb-3" numberOfLines={2}>
        {signal.summary}
      </Text>

      <View className="flex-row gap-2">
        <Pressable
          onPress={onEdit}
          className="flex-1 py-2 bg-neutral-800 border border-neutral-700 rounded-xl items-center"
        >
          <Text className="text-neutral-300 text-xs font-medium">Edit</Text>
        </Pressable>

        {signal.status !== "closed" && (
          <Pressable
            onPress={onClose}
            className="flex-1 py-2 bg-red-500/10 border border-red-500/20 rounded-xl items-center"
          >
            <Text className="text-red-400 text-xs font-medium">
              Close Signal
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function AdminSignalsScreen() {
  const router = useRouter();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editSignal, setEditSignal] = useState<Signal | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | SignalStatus>("all");

  const fetchSignals = async () => {
    try {
      const data = await signalService.adminGetAll();
      setSignals(data);
    } catch {
      Alert.alert("Error", "Failed to load signals.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleSave = async (data: CreateSignalPayload, id?: string) => {
    try {
      if (id) {
        await signalService.adminUpdate(id, data);
        Alert.alert("Updated", "Signal updated successfully.");
      } else {
        await signalService.adminCreate(data);
        Alert.alert("Published", "Signal is now live.");
      }
      setModalVisible(false);
      setEditSignal(null);
      fetchSignals();
    } catch {
      Alert.alert("Error", "Failed to save signal.");
    }
  };

  const handleClose = (id: string) => {
    Alert.alert("Close Signal", "Mark this signal as closed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Close",
        style: "destructive",
        onPress: async () => {
          try {
            await signalService.adminClose(id);
            fetchSignals();
          } catch {
            Alert.alert("Error", "Failed to close signal.");
          }
        },
      },
    ]);
  };

  const filtered =
    statusFilter === "all"
      ? signals
      : signals.filter((s) => s.status === statusFilter);

  const counts = {
    active: signals.filter((s) => s.status === "active").length,
    draft: signals.filter((s) => s.status === "draft").length,
    closed: signals.filter((s) => s.status === "closed").length,
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
            <Text className="text-white text-2xl font-bold">Signals</Text>
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
                setEditSignal(null);
                setModalVisible(true);
              }}
              className="px-4 py-2 bg-indigo-600 rounded-xl"
            >
              <Text className="text-white text-xs font-semibold">+ New</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mt-4">
          <View className="flex-1 items-center bg-neutral-900 border border-neutral-800 rounded-xl py-2">
            <Text className="text-emerald-400 font-bold">{counts.active}</Text>
            <Text className="text-neutral-600 text-xs">Active</Text>
          </View>
          <View className="flex-1 items-center bg-neutral-900 border border-neutral-800 rounded-xl py-2">
            <Text className="text-yellow-400 font-bold">{counts.draft}</Text>
            <Text className="text-neutral-600 text-xs">Draft</Text>
          </View>
          <View className="flex-1 items-center bg-neutral-900 border border-neutral-800 rounded-xl py-2">
            <Text className="text-neutral-500 font-bold">{counts.closed}</Text>
            <Text className="text-neutral-600 text-xs">Closed</Text>
          </View>
        </View>
      </View>

      {/* Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 pt-4 pb-2 max-h-14"
      >
        {(["all", "active", "draft", "closed"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setStatusFilter(f)}
            className={`px-4 py-1.5 mr-2 rounded-xl border ${
              statusFilter === f
                ? "bg-indigo-600 border-indigo-500"
                : "bg-neutral-900 border-neutral-800"
            }`}
          >
            <Text
              className={`text-xs font-medium capitalize ${statusFilter === f ? "text-white" : "text-neutral-400"}`}
            >
              {f}
            </Text>
          </Pressable>
        ))}
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
                fetchSignals();
              }}
              tintColor="#6366f1"
            />
          }
        >
          {filtered.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-neutral-600 text-sm">No signals found</Text>
            </View>
          ) : (
            filtered.map((s) => (
              <AdminSignalRow
                key={s.id}
                signal={s}
                onEdit={() => {
                  setEditSignal(s);
                  setModalVisible(true);
                }}
                onClose={() => handleClose(s.id)}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Form Modal */}
      <SignalFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditSignal(null);
        }}
        onSave={handleSave}
        initial={
          editSignal
            ? {
                pair: editSignal.pair,
                timeframe: editSignal.timeframe,
                direction: editSignal.direction,
                confidence: editSignal.confidence,
                tier: editSignal.tier,
                summary: editSignal.summary,
                entry: editSignal.entry ?? undefined,
                stopLoss: editSignal.stopLoss ?? undefined,
                takeProfit: editSignal.takeProfit ?? undefined,
                chartImageUrl: editSignal.chartImageUrl ?? "",
                analystNotes: editSignal.analystNotes ?? "",
                status: editSignal.status ?? "active",
              }
            : EMPTY_FORM
        }
        editId={editSignal?.id}
      />
    </View>
  );
}
