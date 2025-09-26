import { Text, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Button({ children, style, onPress }: ButtonProps) {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}
