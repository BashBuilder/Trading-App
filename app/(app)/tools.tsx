// app/(app)/tools.tsx
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  Subscription,
  subscriptionService,
} from "@/services/subscription.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const TIER_RANK: Record<string, number> = {
  explorer: 0,
  strategist: 1,
  mathematician: 2,
};

const CAPABILITY_TIER: Record<string, string> = {
  coreSignals: "explorer",
  advancedIndicators: "strategist",
  analytics: "mathematician",
};

const TIER_DISPLAY: Record<string, string> = {
  explorer: "The Explorer",
  strategist: "The Strategist",
  mathematician: "The Mathematician",
};

const TIER_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  explorer: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
  strategist: {
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
  },
  mathematician: {
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
};

function LockedTool({ requiredTier }: { requiredTier: string }) {
  const router = useRouter();
  const colors = TIER_COLORS[requiredTier];
  return (
    <View className="absolute inset-0 rounded-2xl bg-slate-950/80 items-center justify-center">
      <Text className="text-lg mb-1">🔒</Text>
      <Text className="text-neutral-400 text-xs text-center px-4">
        Requires {TIER_DISPLAY[requiredTier]}
      </Text>
      <Pressable
        onPress={() => router.push("/(app)/paywall")}
        className={`mt-2 px-4 py-1.5 rounded-lg border ${colors.border} ${colors.bg}`}
      >
        <Text className={`text-xs font-semibold ${colors.text}`}>Upgrade</Text>
      </Pressable>
    </View>
  );
}

function RiskCalculator({ locked }: { locked: boolean }) {
  const [accountSize, setAccountSize] = useState("");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [result, setResult] = useState<{
    positionSize: string;
    riskAmount: string;
    pips: string;
  } | null>(null);

  const calculate = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercent) / 100;
    const e = parseFloat(entry);
    const sl = parseFloat(stopLoss);

    if (!account || !risk || !e || !sl) {
      Alert.alert("Missing fields", "Fill in all fields to calculate.");
      return;
    }

    const riskAmount = account * risk;
    const pips = Math.abs(e - sl);
    const positionSize = pips > 0 ? riskAmount / pips : 0;

    setResult({
      riskAmount: `$${riskAmount.toFixed(2)}`,
      pips: pips.toFixed(5),
      positionSize: positionSize.toFixed(2),
    });
  };

  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-4 overflow-hidden relative">
      <Text className="text-white font-semibold text-base mb-1">
        Risk Calculator
      </Text>
      <Text className="text-neutral-500 text-xs mb-4">
        Position sizing & stop loss management
      </Text>

      <View className="gap-3">
        <View>
          <Text className="text-neutral-500 text-xs mb-1">
            Account Size ($)
          </Text>
          <TextInput
            className="bg-neutral-800 rounded-xl px-4 py-3 text-white text-sm border border-neutral-700"
            placeholder="e.g. 10000"
            placeholderTextColor="#525252"
            keyboardType="numeric"
            value={accountSize}
            onChangeText={setAccountSize}
            editable={!locked}
          />
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-neutral-500 text-xs mb-1">Risk %</Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3 text-white text-sm border border-neutral-700"
              placeholder="1"
              placeholderTextColor="#525252"
              keyboardType="numeric"
              value={riskPercent}
              onChangeText={setRiskPercent}
              editable={!locked}
            />
          </View>
          <View className="flex-1">
            <Text className="text-neutral-500 text-xs mb-1">Entry Price</Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3 text-white text-sm border border-neutral-700"
              placeholder="1.0850"
              placeholderTextColor="#525252"
              keyboardType="numeric"
              value={entry}
              onChangeText={setEntry}
              editable={!locked}
            />
          </View>
        </View>

        <View>
          <Text className="text-neutral-500 text-xs mb-1">Stop Loss Price</Text>
          <TextInput
            className="bg-neutral-800 rounded-xl px-4 py-3 text-white text-sm border border-neutral-700"
            placeholder="1.0820"
            placeholderTextColor="#525252"
            keyboardType="numeric"
            value={stopLoss}
            onChangeText={setStopLoss}
            editable={!locked}
          />
        </View>

        <Pressable
          onPress={calculate}
          disabled={locked}
          className="bg-indigo-600 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Calculate</Text>
        </Pressable>

        {result && (
          <View className="flex-row justify-between mt-1">
            <View className="items-center">
              <Text className="text-emerald-400 font-bold">
                {result.riskAmount}
              </Text>
              <Text className="text-neutral-600 text-xs">Risk Amount</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold">{result.pips}</Text>
              <Text className="text-neutral-600 text-xs">Pips / Points</Text>
            </View>
            <View className="items-center">
              <Text className="text-indigo-400 font-bold">
                {result.positionSize}
              </Text>
              <Text className="text-neutral-600 text-xs">Lot Size</Text>
            </View>
          </View>
        )}
      </View>

      {locked && <LockedTool requiredTier="explorer" />}
    </View>
  );
}

function MarketScanTool({ locked }: { locked: boolean }) {
  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-4 overflow-hidden relative">
      <Text className="text-white font-semibold text-base mb-1">
        Structured Market Scan
      </Text>
      <Text className="text-neutral-500 text-xs mb-4">
        Analyze structural movement across selected instruments.
      </Text>

      <View className="flex-row flex-wrap gap-2 mb-4">
        {["EURUSD", "XAUUSD", "NAS100", "GBPUSD", "USDJPY"].map((sym) => (
          <Pressable
            key={sym}
            disabled={locked}
            className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg"
          >
            <Text className="text-neutral-300 text-xs font-medium">{sym}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        disabled={locked}
        className="bg-indigo-600 py-3 rounded-xl items-center"
        onPress={() =>
          Alert.alert(
            "Scan Complete",
            "No structural divergence detected across selected instruments.",
          )
        }
      >
        <Text className="text-white font-medium">Run Scan</Text>
      </Pressable>

      {locked && <LockedTool requiredTier="strategist" />}
    </View>
  );
}

function IndicatorOverlayTool({ locked }: { locked: boolean }) {
  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-4 overflow-hidden relative">
      <Text className="text-white font-semibold text-base mb-1">
        Indicator Overlay
      </Text>
      <Text className="text-neutral-500 text-xs mb-3">
        Structural alignment across timeframes.
      </Text>

      <View className="gap-2">
        {[
          {
            label: "H1 Structure",
            value: "Bullish",
            color: "text-emerald-400",
          },
          { label: "H4 Trend", value: "Neutral", color: "text-yellow-400" },
          { label: "D1 Bias", value: "Bullish", color: "text-emerald-400" },
        ].map((row) => (
          <View
            key={row.label}
            className="flex-row justify-between items-center py-2 border-b border-neutral-800"
          >
            <Text className="text-neutral-400 text-sm">{row.label}</Text>
            <Text className={`text-sm font-semibold ${row.color}`}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {locked && <LockedTool requiredTier="strategist" />}
    </View>
  );
}

function AnalyticsTool({ locked }: { locked: boolean }) {
  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-4 overflow-hidden relative">
      <Text className="text-white font-semibold text-base mb-1">
        Deep Analytics
      </Text>
      <Text className="text-neutral-500 text-xs mb-3">
        Comprehensive structural analytics & pattern recognition.
      </Text>

      <View className="flex-row gap-3">
        <View className="flex-1 bg-neutral-800 rounded-xl p-3 items-center">
          <Text className="text-violet-400 font-bold text-xl">94%</Text>
          <Text className="text-neutral-600 text-xs mt-0.5">Pattern Match</Text>
        </View>
        <View className="flex-1 bg-neutral-800 rounded-xl p-3 items-center">
          <Text className="text-emerald-400 font-bold text-xl">1:3.2</Text>
          <Text className="text-neutral-600 text-xs mt-0.5">Avg R:R</Text>
        </View>
        <View className="flex-1 bg-neutral-800 rounded-xl p-3 items-center">
          <Text className="text-white font-bold text-xl">12</Text>
          <Text className="text-neutral-600 text-xs mt-0.5">Setups</Text>
        </View>
      </View>

      {locked && <LockedTool requiredTier="mathematician" />}
    </View>
  );
}

export default function ToolsScreen() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subscriptionService
      .getCurrent()
      .then(setSubscription)
      .finally(() => setLoading(false));
  }, []);

  const userRank = subscription?.tierId ? TIER_RANK[subscription.tierId] : -1;
  const hasCapability = (cap: string) => {
    const required = CAPABILITY_TIER[cap];
    return userRank >= TIER_RANK[required];
  };

  const tierColors = subscription?.tierId
    ? TIER_COLORS[subscription.tierId]
    : null;

  return (
    <ScreenWrapper title="Trading Tools">
      {/* Tier indicator */}
      <View className="flex-row items-center justify-between mb-5 -mt-1">
        <Text className="text-neutral-500 text-sm">Your toolkit</Text>
        {subscription?.status === "active" && tierColors ? (
          <View
            className={`px-3 py-1 rounded-full border ${tierColors.border} ${tierColors.bg}`}
          >
            <Text className={`text-xs font-semibold ${tierColors.text}`}>
              {TIER_DISPLAY[subscription.tierId]}
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() => router.push("/(app)/paywall")}
            className="px-3 py-1 rounded-full bg-indigo-600/15 border border-indigo-500/30"
          >
            <Text className="text-indigo-400 text-xs font-semibold">
              No Plan — Upgrade
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <RiskCalculator locked={!hasCapability("coreSignals")} />
        <MarketScanTool locked={!hasCapability("advancedIndicators")} />
        <IndicatorOverlayTool locked={!hasCapability("advancedIndicators")} />
        <AnalyticsTool locked={!hasCapability("analytics")} />
      </ScrollView>
    </ScreenWrapper>
  );
}
