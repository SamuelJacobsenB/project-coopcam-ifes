import { Pressable, Text, View } from "react-native";

import { getWeekDay } from "@/utils";

import styles from "./styles";

interface DayCardProps {
  children: React.ReactNode;
  date: Date;
  onPress?: () => void;
}

export function DayCard({ children, date, onPress }: DayCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.dayCard}>
      <View style={styles.dayCardFixedInfo}>
        <Text>{getWeekDay(date.getDay())}</Text>
      </View>
      <View style={styles.dayCardBody}>{children}</View>
      <View style={styles.dayCardFixedInfo}>
        <Text>{date.toLocaleDateString()}</Text>
      </View>
    </Pressable>
  );
}
