import { useRef, useState } from "react";
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData, View } from "react-native";

const LENGTH = 6;

export default function OtpInput({
  value,
  onChange,
  autoFocus = true,
}: {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const digits = value.split("").concat(Array(LENGTH).fill("")).slice(0, LENGTH);

  const setDigit = (index: number, char: string) => {
    const next = digits.slice();
    next[index] = char;
    onChange(next.join("").slice(0, LENGTH));
  };

  const handleChangeText = (text: string, index: number) => {
    // Handles both single-char typing and full-code paste into one box.
    const clean = text.replace(/[^0-9]/g, "");
    if (clean.length > 1) {
      onChange(clean.slice(0, LENGTH));
      const lastIndex = Math.min(clean.length, LENGTH) - 1;
      inputs.current[lastIndex]?.focus();
      return;
    }

    setDigit(index, clean);
    if (clean && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setDigit(index - 1, "");
    }
  };

  return (
    <View className="flex-row justify-between">
      {digits.map((digit, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={digit}
          onChangeText={(text) => handleChangeText(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          onFocus={() => setFocusedIndex(i)}
          keyboardType="number-pad"
          maxLength={LENGTH}
          autoFocus={autoFocus && i === 0}
          className="text-white text-2xl font-bold text-center rounded-2xl"
          style={{
            width: 46,
            height: 56,
            backgroundColor: "#1e293b",
            borderWidth: 1.5,
            borderColor: focusedIndex === i ? "#6366f1" : "#334155",
          }}
        />
      ))}
    </View>
  );
}
