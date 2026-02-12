import { ScrollView, Text, View } from "react-native";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ScreenWrapper({ title, children }: Props) {
  return (
    <View className="flex-1 bg-slate-950 px-6 pt-14">
      <Text className="text-2xl font-bold text-white mb-6">{title}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </View>
  );
}
