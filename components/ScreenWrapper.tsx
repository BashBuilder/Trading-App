import { RefreshControl, ScrollView, Text, View } from "react-native";

interface Props {
  title: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export default function ScreenWrapper({
  title,
  refreshing,
  onRefresh,
  children,
}: Props) {
  return (
    <View className="flex-1 bg-slate-950 px-6 pt-14">
      <Text className="text-2xl font-bold text-white mb-6">{title}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || false}
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}
