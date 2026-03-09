import React from "react";
import { Text, View } from "react-native";

import styles from "./styles";

interface ProfileInfoCardProps {
  label: string;
  text: string;
}

export function ProfileInfoText({ label, text }: ProfileInfoCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
