import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { DayCard, LoadPage, ReservationSection, Title } from "@/components";
import { weekDays } from "@/constants";
import {
  useAllAvailableOverrides,
  useAllUnavailableDays,
  useWeeklyPreferenceByUserId,
} from "@/hooks";
import { colors } from "@/styles";
import {
  AvailableOverride,
  BusReservation,
  Direction,
  Period,
  UnavailableDay,
} from "@/types";
import { filterReservations, getDateOfWeekDay, getWeekDay } from "@/utils";

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const DayListItem = React.memo(
  ({
    day,
    index,
    overrides,
    isAvailable,
    onPress,
  }: {
    day: string;
    index: number;
    overrides: BusReservation[];
    isAvailable: boolean;
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

    if (!isAvailable) return null;

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

  const { availableOverrides } = useAllAvailableOverrides();
  const { unavailableDays } = useAllUnavailableDays();

  const checkIsAvailable = useCallback(
    (date: Date) => {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      if (isWeekend) {
        return (
          availableOverrides?.some((override: AvailableOverride) =>
            isSameDay(new Date(override.date), date),
          ) ?? false
        );
      } else {
        return !(
          unavailableDays?.some((unav: UnavailableDay) =>
            isSameDay(new Date(unav.date), date),
          ) ?? false
        );
      }
    },
    [availableOverrides, unavailableDays],
  );

  if (isLoading) return <LoadPage />;

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
          renderItem={({ item: day, index }) => {
            const currentDate = getDateOfWeekDay(index);
            const isAvailable = checkIsAvailable(currentDate);

            return (
              <DayListItem
                day={day}
                index={index}
                overrides={weeklyPreference.overrides}
                isAvailable={isAvailable}
                onPress={() => router.push(`/${index}`)}
              />
            );
          }}
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
