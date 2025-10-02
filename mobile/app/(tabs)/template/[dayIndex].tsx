import { View, Text, StyleSheet } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { GoBack, Line } from "@/components";
import { weekDays } from "@/constants";
import { colors } from "@/styles";

export default function TemplateDayPage() {
  const { dayIndex } = useLocalSearchParams();
  const index = Number(dayIndex);

  const dayName = weekDays[index];

  if (isNaN(index) || index < 0 || index > 6) {
    return (
      <View>
        <GoBack path="/template" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dayName}</Text>
      <Line style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: colors.lightGray,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  line: {
    marginBottom: 24,
  },
});
