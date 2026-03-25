import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

export function PriceInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number;
  placeholder?: string;
  onChange: (v: number) => void;
}) {
  const [inputValue, setInputValue] = useState(String(value ?? ""));

  // Keep local state in sync if parent value changes
  useEffect(() => {
    setInputValue(String(value ?? ""));
  }, [value]);

  const handleChange = (v: string) => {
    // Allow only numbers + optional decimal
    if (/^\d*\.?\d*$/.test(v)) {
      setInputValue(v);

      // Only update parent when it's a valid number
      if (v === "" || v === ".") {
        onChange(0);
      } else {
        onChange(parseFloat(v));
      }
    }
  };

  return (
    <View className="flex-1">
      <Text className="text-neutral-500 text-xs mb-1">{label}</Text>

      <View className="flex-row items-center bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5">
        <Text className="text-neutral-500 text-sm mr-1">$</Text>

        <TextInput
          className="flex-1 text-white text-sm"
          keyboardType="decimal-pad"
          value={inputValue}
          onChangeText={handleChange}
          placeholder={placeholder || "0.00"}
          placeholderTextColor="#525252"
        />
      </View>
    </View>
  );
}
