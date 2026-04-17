import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Calendar, CalendarDayCard, LoadPage, Title } from "@/components";
import { useAllAvailableOverrides, useAllUnavailableDays } from "@/hooks";
import { colors } from "@/styles";
import type { AvailableOverride } from "@/types";

const normalizeDate = (dateInput: Date | string | undefined | null): string => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
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

  const [date, setDate] = useState(new Date());

  const { selectedOverride, selectedUnavailable } = useMemo(() => {
    const dayKey = normalizeDate(date);

    return {
      selectedOverride:
        availableOverrides?.find(
          (o: AvailableOverride) => normalizeDate(o.date) === dayKey,
        ) || null,
      selectedUnavailable:
        unavailableDays?.find((u: any) => normalizeDate(u.date) === dayKey) ||
        null,
    };
  }, [date, availableOverrides, unavailableDays]);

  if (loadingOverrides || loadingUnavailable) {
    return <LoadPage />;
  }

  const hasError = !!(overridesError || unavailableError);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Title>Calendário</Title>

        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Ocorreu um problema ao carregar os dados do calendário.
            </Text>
          </View>
        ) : (
          <View style={styles.mainContent}>
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
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  mainContent: {
    marginTop: 16,
  },
  cardContainer: {
    marginTop: 24,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#FFECEC",
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: "center",
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
});
