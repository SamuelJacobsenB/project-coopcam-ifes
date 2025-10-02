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
    <Pressable onPress={onPress} style={styles.dayCard}>
      <View style={styles.dayCardFixedInfo}>
        <Text>{weekDay}</Text>
      </View>
      <View style={styles.dayCardBody}>{children}</View>
      <View style={styles.dayCardFixedInfo}>
        {date && <Text>{date.toLocaleTimeString()}</Text>}
      </View>
    </Pressable>
  );
}
