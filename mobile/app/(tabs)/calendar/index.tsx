import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAllAvailableOverrides, useAllUnavailableDays } from "@/hooks";
import { Calendar, LoadPage, Title, CalendarDayCard } from "@/components";
import { colors } from "@/styles";

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

  if (loadingOverrides || loadingUnavailable) {
    return <LoadPage />;
  }

  const dayKey = date.toISOString().split("T")[0];
  const selectedOverride =
    (availableOverrides || []).find(
      (o) => o.date.toISOString().split("T")[0] === dayKey
    ) || null;
  const selectedUnavailable =
    (unavailableDays || []).find(
      (u) => u.date.toISOString().split("T")[0] === dayKey
    ) || null;

  return (
    <View style={styles.container}>
      <Title>Calendário</Title>

      {overridesError && (
        <Text style={styles.errorText}>Erro ao carregar dias disponíveis</Text>
      )}
      {unavailableError && (
        <Text style={styles.errorText}>
          Erro ao carregar dias indisponíveis
        </Text>
      )}

      {!overridesError &&
        !unavailableError &&
        !loadingOverrides &&
        !loadingUnavailable && (
          <>
            <Calendar
              date={date}
              setDate={setDate}
              availableOverrides={availableOverrides || []}
              unavailableDays={unavailableDays || []}
            />

            <CalendarDayCard
              date={date}
              override={selectedOverride}
              unavailable={selectedUnavailable}
            />
          </>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.lightGray,
  },
  errorText: {
    color: colors.error,
    marginBottom: 8,
  },
});
