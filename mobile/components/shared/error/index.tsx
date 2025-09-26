import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

interface ErrorProps {
  error: string;
  onClose: () => void;
}

export function Error({ error, onClose }: ErrorProps) {
  if (!error) return null;

  return (
    <View style={styles.error}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={onClose} style={styles.close}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
