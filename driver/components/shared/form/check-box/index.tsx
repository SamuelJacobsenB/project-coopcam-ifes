import React from "react";
import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

interface CheckBoxProps {
  isChecked: boolean;
  onPress: () => void;
  text?: string;
}

export function CheckBox({ isChecked, onPress, text }: CheckBoxProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.check, isChecked && styles.checked]}>
        {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}
