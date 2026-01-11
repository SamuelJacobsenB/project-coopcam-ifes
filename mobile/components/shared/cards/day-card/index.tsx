import React from "react";
import { Pressable, Text, View } from "react-native";

import styles from "./styles";

interface DayCardProps {
  children: React.ReactNode;
  weekDay: string;
  date?: Date;
  onPress?: () => void;
}

export function DayCard({ children, date, weekDay, onPress }: DayCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayCard,
        pressed && {
          transform: [{ scale: 0.98 }],
          opacity: 0.9,
        }, // Feedback tátil ao pressionar
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.weekDayText}>{weekDay.toUpperCase()}</Text>
        {date && <Text style={styles.dateText}>{date.getDate()}</Text>}
      </View>

      <View style={styles.dayCardBody}>{children}</View>

      <View style={styles.footer}>
        <View style={styles.indicator} />
      </View>
    </Pressable>
  );
}
