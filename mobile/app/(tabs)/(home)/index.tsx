import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { DayCard, ReservationSection, Title } from "@/components";
import { weekDays } from "@/constants";
import { useWeeklyPreferenceByUserId } from "@/hooks";
import { colors } from "@/styles";
import { BusReservation, Direction, Period } from "@/types";
import { filterReservations, getDateOfWeekDay, getWeekDay } from "@/utils";

const DayListItem = React.memo(
  ({
    day,
    index,
    overrides,
    onPress,
  }: {
    day: string;
    index: number;
    overrides: BusReservation[];
    onPress: (day: string, date: Date) => void;
  }) => {
    const currentDate = getDateOfWeekDay(index);
    const dayReservations = overrides.filter(
      (r) => getWeekDay(r.date.getDay()) === day,
    );

    const hasReservation = (period: Period, direction: Direction) => {
      return (
        filterReservations(dayReservations, period, direction).length === 1
      );
    };

    return (
      <DayCard
        date={currentDate}
        weekDay={day}
        onPress={() => onPress(day, currentDate)}
      >
        <ReservationSection
          title="Manhã"
          goReserved={hasReservation("morning", "go")}
          returnReserved={hasReservation("morning", "return")}
        />
        <ReservationSection
          title="Tarde"
          goReserved={hasReservation("afternoon", "go")}
          returnReserved={hasReservation("afternoon", "return")}
        />
      </DayCard>
    );
  },
);

DayListItem.displayName = "DayListItem";

export default function HomePage() {
  const router = useRouter();
  const { weeklyPreference, isLoading, error } = useWeeklyPreferenceByUserId();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title>Preferência semanal</Title>

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Preferência semanal não encontrada.
          </Text>
        </View>
      )}

      {weeklyPreference && (
        <FlatList
          contentContainerStyle={styles.list}
          data={weekDays}
          keyExtractor={(day) => day}
          renderItem={({ item: day, index }) => (
            <DayListItem
              day={day}
              index={index}
              overrides={weeklyPreference.overrides}
              onPress={() => router.push(`/${index}`)}
            />
          )}
        />
      )}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#666",
    fontSize: 16,
  },
  list: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 18,
    columnGap: 12,
  },
});
