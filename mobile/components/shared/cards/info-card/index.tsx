import React from "react";
import { Text, View } from "react-native";

import { Line } from "../../line";
import styles from "./styles";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Line />
      <View style={styles.content}>{children}</View>
    </View>
  );
}
