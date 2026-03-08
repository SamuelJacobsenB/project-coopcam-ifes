import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Calendar, CalendarDayCard, LoadPage, Title } from "@/components";
import { useAllAvailableOverrides, useAllUnavailableDays } from "@/hooks";
import { colors } from "@/styles";

const toDateId = (dateInput: Date | string | undefined | null): string => {
  if (!dateInput) return "";

  const d = new Date(dateInput);

  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function CalendarPage() {
  const {
    availableOverrides,
    isLoading: loadingOverrides,
    error: overridesError,
  } = useAllAvailableOverrides();

  const {
    unavailableDays,
    isLoading: loadingUnavailable,
    error: unavailableError,
  } = useAllUnavailableDays();

  const [date, setDate] = useState(() => new Date());

  const { selectedOverride, selectedUnavailable } = useMemo(() => {
    const dayKey = toDateId(date);

    const overrides = availableOverrides ?? [];
    const unavailables = unavailableDays ?? [];

    return {
      selectedOverride:
        overrides.find((o) => toDateId(o.date) === dayKey) || null,
      selectedUnavailable:
        unavailables.find((u) => toDateId(u.date) === dayKey) || null,
    };
  }, [date, availableOverrides, unavailableDays]);

  if (loadingOverrides || loadingUnavailable) {
    return <LoadPage />;
  }

  const hasError = overridesError || unavailableError;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Title>Calendário</Title>

      <View style={styles.scrollContent}>
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Ocorreu um problema ao carregar os dados do calendário.
            </Text>
          </View>
        ) : (
          <>
            <Calendar
              date={date}
              setDate={setDate}
              availableOverrides={availableOverrides ?? []}
              unavailableDays={unavailableDays ?? []}
            />

            <View style={styles.cardContainer}>
              <CalendarDayCard
                date={date}
                override={selectedOverride}
                unavailable={selectedUnavailable}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  cardContainer: {
    marginTop: 24,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FFECEC",
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    fontSize: 14,
  },
});
